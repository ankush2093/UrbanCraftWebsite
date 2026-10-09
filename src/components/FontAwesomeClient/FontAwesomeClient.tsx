'use client';

import { useEffect } from 'react';

export default function FontAwesomeClient() {
  useEffect(() => {
    // Check if Font Awesome is already loaded
    const existingLink = document.querySelector('link[href*="font-awesome"]') || 
                         document.querySelector('link[href*="fontawesome"]');
    if (existingLink) {
      return;
    }

    // Try multiple CDN sources for better reliability
    const cdnUrls = [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    ];

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cdnUrls[0];
    link.crossOrigin = 'anonymous';
    link.media = 'all';
    
    // Try fallback if first fails
    link.onerror = () => {
      const fallbackLink = document.createElement('link');
      fallbackLink.rel = 'stylesheet';
      fallbackLink.href = cdnUrls[1];
      fallbackLink.crossOrigin = 'anonymous';
      fallbackLink.media = 'all';
      document.head.appendChild(fallbackLink);
    };
    
    // Append to head immediately - before other styles if possible
    const firstLink = document.head.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      document.head.insertBefore(link, firstLink);
    } else {
      document.head.appendChild(link);
    }
  }, []);

  return null;
}

