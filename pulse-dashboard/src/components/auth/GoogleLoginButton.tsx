import { useEffect, useRef } from 'react';
import { usePulseStore } from '../../store/usePulseStore';

declare global {
  interface Window {
    google: any;
  }
}

export const GoogleLoginButton = () => {
  const { login } = usePulseStore();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = async (response: any) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      if (res.ok) {
        const data = await res.json();
        if (window.google) {
          window.google.accounts.id.cancel();
        }
        login(data.token, data.user);
      } else {
        const text = await res.text();
        alert('Google auth failed on backend: ' + text);
        console.error('Google auth failed on backend', text);
      }
    } catch (e: any) {
      alert('Network error during Google auth: ' + e.message);
      console.error('Network error during Google auth', e);
    }
  };

  useEffect(() => {
    const initializeGsi = () => {
      if (!window.google) return;
      
      window.google.accounts.id.initialize({
        client_id: '124071957979-kdk3lfqvu0uuphusvre7sail7oefr694.apps.googleusercontent.com',
        callback: handleCredentialResponse
      });
      
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large' }
        );
      }
    };

    if (window.google) {
      initializeGsi();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGsi;
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return <div ref={googleButtonRef}></div>;
};
