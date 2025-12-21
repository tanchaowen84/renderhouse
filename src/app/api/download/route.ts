import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const targetUrl = requestUrl.searchParams.get('url');
  const filenameParam = requestUrl.searchParams.get('filename') || 'render.png';

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  const publicUrl = process.env.STORAGE_PUBLIC_URL;
  if (!publicUrl) {
    return NextResponse.json(
      { error: 'STORAGE_PUBLIC_URL is not configured' },
      { status: 500 }
    );
  }

  try {
    const target = new URL(targetUrl);
    const allowed = new URL(publicUrl);

    if (target.origin !== allowed.origin) {
      return NextResponse.json({ error: 'URL not allowed' }, { status: 400 });
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch file' },
        { status: 502 }
      );
    }

    const contentType =
      response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();
    const filename = sanitizeFilename(filenameParam);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

function sanitizeFilename(value: string): string {
  const safe = value.replace(/[^a-zA-Z0-9._-]/g, '');
  if (!safe || safe.startsWith('.')) return 'render.png';
  return safe.length > 100 ? safe.slice(0, 100) : safe;
}
