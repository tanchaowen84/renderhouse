import { NextResponse } from 'next/server';

type ChatRole = 'user' | 'assistant';

interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

interface RenderSpec {
  shouldRender: boolean;
  prompt?: string;
  strength?: number;
  imageSize?: string;
}

interface ChatRequestBody {
  messages?: ChatRequestMessage[];
  currentImageUrl?: string | null;
}

interface ChatResponseBody {
  reply: string;
  renderSpec: RenderSpec;
}

/**
 * Stage 2 (UI-testable):
 * - Real AI chat via OpenRouter (Grok-4.1-fast).
 * - Returns a user-facing reply + a structured prompt draft (no image generation yet).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ChatRequestBody | null;
  const messages = body?.messages;
  const currentImageUrl = body?.currentImageUrl ?? null;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterApiKey) {
    return NextResponse.json(
      { error: 'OPENROUTER_API_KEY is not configured' },
      { status: 500 }
    );
  }

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
    'This stage does NOT generate images. You only respond and produce a prompt draft for a future image-edit step.',
    '',
    'Return ONLY valid JSON with this exact shape:',
    '{',
    '  "reply": string,',
    '  "renderSpec": {',
    '    "shouldRender": boolean,',
    '    "prompt"?: string,',
    '    "strength"?: number,',
    '    "imageSize"?: string',
    '  }',
    '}',
    '',
    'Rules:',
    '- If the user is chatting (e.g. greetings, identity questions), set renderSpec.shouldRender=false and OMIT prompt/strength/imageSize.',
    '- If the user requests visual changes, set renderSpec.shouldRender=true and provide a clean, concise English prompt for the image edit model.',
    '- If shouldRender=true, you may include strength (0..1, default 0.6) and imageSize ("auto" by default).',
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
  const strength =
    shouldRender && typeof renderSpecInput.strength === 'number'
      ? renderSpecInput.strength
      : undefined;
  const imageSize =
    shouldRender && typeof renderSpecInput.imageSize === 'string'
      ? renderSpecInput.imageSize
      : undefined;

  return NextResponse.json({
    reply,
    renderSpec: {
      shouldRender,
      ...(prompt ? { prompt } : {}),
      ...(typeof strength === 'number' ? { strength } : {}),
      ...(imageSize ? { imageSize } : {}),
    },
  } satisfies ChatResponseBody);
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
