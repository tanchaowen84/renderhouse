import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default function PageLayout({ children }: PropsWithChildren) {
  notFound();
  return children;
}
