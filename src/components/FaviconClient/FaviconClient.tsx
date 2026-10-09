'use client';

import { useEffect } from 'react';

export default function FaviconClient() {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      document.head.appendChild(link);
    }

    // Cache-busting only when needed
    link.href = `/favicon.ico?v=${Date.now()}`;
  }, []);

  return null;
}
