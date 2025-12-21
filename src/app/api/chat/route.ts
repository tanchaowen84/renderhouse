import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { project } from '@/db/schema';
import { getSession } from '@/lib/server';
import { deleteFile, uploadFile } from '@/storage';

export const runtime = 'nodejs';

type ChatRole = 'user' | 'assistant';
type AllowedImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9'
  | 'auto'
  | 'auto_2K'
  | 'auto_4K';

interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

interface RenderSpec {
  shouldRender: boolean;
  prompt?: string;
  imageSize?: AllowedImageSize;
}

interface ChatRequestBody {
  projectId?: string;
  messages?: ChatRequestMessage[];
}

interface ChatResponseBody {
  reply: string;
  renderSpec: RenderSpec;
  imageUrl?: string;
}

/**
 * Stage 3:
 * - AI chat via OpenRouter (Grok-4.1-fast) + image edit via fal Seedream v4 edit.
 * - Stores only the latest render in R2 and returns the new URL.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ChatRequestBody | null;
  const projectId = body?.projectId;
  const messages = body?.messages;

  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages are required' }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterApiKey) {
    return NextResponse.json(
      { error: 'OPENROUTER_API_KEY is not configured' },
      { status: 500 }
    );
  }

  const db = await getDb();
  const record = await db
    .select()
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!record || record.userId !== session.user.id) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const currentImageUrl = getPrimaryImageUrl(record);

  const history = messages
    .slice(-20)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({ role: m.role, content: String(m.content ?? '') }))
    .filter((m) => m.content.trim().length > 0);

  if (history.length === 0) {
    return NextResponse.json(
      { error: 'At least one non-empty message is required' },
      { status: 400 }
    );
  }

  const systemPrompt = [
    'You are RenderHouse AI assistant.',
    'Goal: help the user refine the CURRENT image via iterative edits.',
    'Important: you cannot view the image. Do not claim you can see it. Ask clarifying questions if needed.',
    '',
    'You must decide whether the user message requires generating a new edited image now.',
    '',
    'Return ONLY valid JSON with this exact shape:',
    '{',
    '  "reply": string,',
    '  "renderSpec": {',
    '    "shouldRender": boolean,',
    '    "prompt"?: string,',
    '    "imageSize"?: string',
    '  }',
    '}',
    '',
    'Rules:',
    '- If the user is chatting (e.g. greetings, identity questions), set renderSpec.shouldRender=false and OMIT prompt/imageSize.',
    '- If the user requests visual changes, set renderSpec.shouldRender=true and provide a clean, concise English prompt for the image edit model.',
    '- If shouldRender=true, include imageSize using one of: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9, auto, auto_2K, auto_4K (default "auto").',
    '- Do not include markdown or extra keys.',
  ].join('\n');

  const contextMessages: Array<{ role: 'system'; content: string }> = [];
  if (currentImageUrl) {
    contextMessages.push({
      role: 'system',
      content: `Current image URL (reference only, you cannot view it): ${currentImageUrl}`,
    });
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openRouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost',
      'X-Title': 'RenderHouse',
    },
    body: JSON.stringify({
      model: 'x-ai/grok-4.1-fast',
      messages: [{ role: 'system', content: systemPrompt }, ...contextMessages, ...history],
      temperature: 0.4,
      max_tokens: 700,
    }),
  });

  const result = (await response.json().catch(() => null)) as any;
  if (!response.ok) {
    const errorMessage =
      result?.error?.message || result?.message || 'OpenRouter request failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  const content = result?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json(
      { error: 'Empty response from model' },
      { status: 500 }
    );
  }

  const parsed = safeParseJson(content);
  if (!parsed) {
    return NextResponse.json(
      {
        reply: content.trim(),
        renderSpec: { shouldRender: false },
      } satisfies ChatResponseBody,
      { status: 200 }
    );
  }

  const reply = typeof parsed.reply === 'string' ? parsed.reply : content.trim();
  const renderSpecInput = parsed.renderSpec ?? {};
  const shouldRender = Boolean(renderSpecInput.shouldRender);
  const prompt =
    shouldRender && typeof renderSpecInput.prompt === 'string'
      ? renderSpecInput.prompt
      : undefined;
  const imageSize = normalizeImageSize(
    shouldRender && typeof renderSpecInput.imageSize === 'string'
      ? renderSpecInput.imageSize
      : undefined
  );

  // If the model suggests rendering but we don't have a prompt or a base image,
  // fall back to a reply-only message (still returns the structured output for UI).
  if (shouldRender && (!prompt || !currentImageUrl)) {
    return NextResponse.json({
      reply,
      renderSpec: {
        shouldRender: Boolean(prompt && currentImageUrl),
        ...(prompt ? { prompt } : {}),
        ...(imageSize ? { imageSize } : {}),
      },
    } satisfies ChatResponseBody);
  }

  if (!shouldRender) {
    return NextResponse.json({
      reply,
      renderSpec: { shouldRender: false },
    } satisfies ChatResponseBody);
  }

  const promptText = prompt;
  const baseImageUrl = currentImageUrl;
  if (!promptText || !baseImageUrl) {
    return NextResponse.json(
      { error: 'Missing prompt or image for rendering' },
      { status: 400 }
    );
  }

  const falApiKey = process.env.FAL_API_KEY;
  if (!falApiKey) {
    return NextResponse.json(
      { error: 'FAL_API_KEY is not configured' },
      { status: 500 }
    );
  }

  // Update status → rendering (best-effort).
  await db
    .update(project)
    .set({ status: 'rendering', updatedAt: new Date() })
    .where(eq(project.id, projectId));

  try {
    fal.config({ credentials: falApiKey });

    const result = await fal.subscribe('fal-ai/bytedance/seedream/v4/edit', {
      input: {
        prompt: promptText,
        image_urls: [baseImageUrl],
        image_size: imageSize ?? 'auto',
        num_images: 1,
        max_images: 1,
      },
    });

    const generatedUrl = (result as any)?.data?.images?.[0]?.url as
      | string
      | undefined;
    if (!generatedUrl) {
      throw new Error('No image URL returned from Seedream');
    }

    const uploaded = await uploadRemoteImageToR2({
      url: generatedUrl,
      folder: `renders/${projectId}`,
    });

    const previousOutputUrl = getFirstOutputUrl(record);

    await db
      .update(project)
      .set({
        outputUrls: [uploaded.url],
        status: 'done',
        updatedAt: new Date(),
      })
      .where(eq(project.id, projectId));

    // Best-effort cleanup of previous render file (do not block success response).
    if (previousOutputUrl && previousOutputUrl !== uploaded.url) {
      const key = tryGetStorageKeyFromPublicUrl(previousOutputUrl);
      if (key) {
        await deleteFile(key).catch(() => undefined);
      }
    }

    return NextResponse.json({
      reply,
      renderSpec: {
        shouldRender: true,
        ...(prompt ? { prompt } : {}),
        ...(imageSize ? { imageSize } : {}),
      },
      imageUrl: uploaded.url,
    } satisfies ChatResponseBody);
  } catch (error) {
    await db
      .update(project)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(project.id, projectId));

    const message =
      error instanceof Error ? error.message : 'Failed to generate render';
    return NextResponse.json({ error: message }, { status: 500 });
  }

}

function safeParseJson(input: string): any | null {
  try {
    return JSON.parse(input);
  } catch {
    // Try to extract the first JSON object from the output
    const start = input.indexOf('{');
    const end = input.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(input.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

function getPrimaryImageUrl(record: any): string | null {
  const outputUrl = getFirstOutputUrl(record);
  if (outputUrl) return outputUrl;

  const inputUrl = record?.inputUrl;
  if (typeof inputUrl === 'string' && inputUrl.length > 0) return inputUrl;

  return null;
}

function getFirstOutputUrl(record: any): string | null {
  const outputUrls = record?.outputUrls;

  if (Array.isArray(outputUrls) && typeof outputUrls[0] === 'string') {
    return outputUrls[0];
  }

  if (typeof outputUrls === 'string' && outputUrls.length > 0) {
    return outputUrls;
  }

  return null;
}

function normalizeImageSize(value?: string): AllowedImageSize | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  const allowed = new Set([
    'square_hd',
    'square',
    'portrait_4_3',
    'portrait_16_9',
    'landscape_4_3',
    'landscape_16_9',
    'auto',
    'auto_2K',
    'auto_4K',
  ]);

  return allowed.has(trimmed) ? (trimmed as AllowedImageSize) : 'auto';
}

async function uploadRemoteImageToR2(params: { url: string; folder: string }) {
  const response = await fetch(params.url);
  if (!response.ok) {
    throw new Error('Failed to download generated image');
  }

  const contentType = response.headers.get('content-type') || 'image/png';
  const fileBuffer = Buffer.from(await response.arrayBuffer());
  const extension = getImageExtensionFromContentType(contentType);

  return uploadFile(fileBuffer, `render.${extension}`, contentType, params.folder);
}

function getImageExtensionFromContentType(contentType: string): string {
  const normalized = contentType.split(';')[0]?.trim().toLowerCase();
  if (normalized === 'image/jpeg') return 'jpg';
  if (normalized === 'image/webp') return 'webp';
  if (normalized === 'image/png') return 'png';
  return 'png';
}

function tryGetStorageKeyFromPublicUrl(url: string): string | null {
  const publicUrl = process.env.STORAGE_PUBLIC_URL;
  if (!publicUrl) return null;

  try {
    const publicUrlObj = new URL(publicUrl);
    const urlObj = new URL(url);

    if (urlObj.origin !== publicUrlObj.origin) return null;
    return urlObj.pathname.replace(/^\//, '') || null;
  } catch {
    return null;
  }
}
