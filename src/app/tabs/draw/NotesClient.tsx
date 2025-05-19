// app/dashboard/notes/NotesClient.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamic import WITH ssr: false is allowed here because this is a client component
const ExcalidrawWrapper = dynamic(() => import('./ExcalidrawClient'), { ssr: false });

export default function NotesClient() {
  return <ExcalidrawWrapper />;
}
