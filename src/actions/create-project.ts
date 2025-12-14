'use server';

import { getDb } from '@/db';
import { project } from '@/db/schema';
import { getSession } from '@/lib/server';
import { randomUUID } from 'crypto';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

const actionClient = createSafeActionClient();

const schema = z.object({
  inputUrl: z.string().url(),
  title: z.string().min(1).max(200).optional(),
});

export const createProjectAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const session = await getSession();
    if (!session) {
      return { error: 'Unauthorized' };
    }

    const db = await getDb();
    const id = randomUUID();

    await db.insert(project).values({
      id,
      userId: session.user.id,
      title: parsedInput.title ?? 'Untitled',
      inputUrl: parsedInput.inputUrl,
      status: 'uploaded',
    });

    return { projectId: id };
  });
