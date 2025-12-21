import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default function BlogListLayout({ children }: PropsWithChildren) {
  notFound();
  return children;
}
