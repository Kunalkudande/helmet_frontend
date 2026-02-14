'use client';

import { useEffect } from 'react';
import api from '@/lib/api';

// Generate a session ID that persists for the browser session
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('visitor_session_id');
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem('visitor_session_id', sid);
  }
  return sid;
}

export function VisitorTracker() {
  useEffect(() => {
    // Only track once per browser session
    if (sessionStorage.getItem('visitor_tracked')) return;
    sessionStorage.setItem('visitor_tracked', '1');

    api.post('/visitors/track', {
      page: window.location.pathname,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    }).catch(() => {
      // silently ignore tracking errors
    });
  }, []);

  return null; // This component renders nothing
}
