'use server';

import { getDb } from '@/db';
import { project } from '@/db/schema';
import { getSession } from '@/lib/server';
import { deleteFile } from '@/storage';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

const actionClient = createSafeActionClient();

const schema = z.object({
  projectId: z.string().min(1),
});

export const deleteProjectAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await getSession();
    if (!session) {
      return { error: 'Unauthorized' };
    }

    const db = await getDb();
    const record = await db
      .select()
      .from(project)
      .where(eq(project.id, parsedInput.projectId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!record || record.userId !== session.user.id) {
      return { error: 'Project not found' };
    }

    const urls = new Set<string>();
    if (typeof record.inputUrl === 'string' && record.inputUrl.length > 0) {
      urls.add(record.inputUrl);
    }

    const outputUrls = record.outputUrls;
    if (Array.isArray(outputUrls)) {
      outputUrls.forEach((url) => {
        if (typeof url === 'string' && url.length > 0) {
          urls.add(url);
        }
      });
    } else if (typeof outputUrls === 'string' && outputUrls.length > 0) {
      urls.add(outputUrls);
    }

    await db.delete(project).where(eq(project.id, parsedInput.projectId));

    const keys = Array.from(urls)
      .map((url) => tryGetStorageKeyFromPublicUrl(url))
      .filter((key): key is string => Boolean(key));

    for (const key of keys) {
      await deleteFile(key).catch(() => undefined);
    }

    return { success: true };
  });

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
