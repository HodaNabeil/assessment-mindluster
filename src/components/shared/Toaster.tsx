'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useEffect, useState } from 'react';


export default function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <SonnerToaster {...props} />;
}
