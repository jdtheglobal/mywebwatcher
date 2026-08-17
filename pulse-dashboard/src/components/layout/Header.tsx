import { useEffect, useRef } from 'react';
import { Bell, Settings, Search, LogOut } from 'lucide-react';
import { usePulseStore } from '../../store/usePulseStore';

declare global {
  interface Window {
    google: any;
  }
}

export const Header = () => {
  const { user, isAuthLoading, login, logout } = usePulseStore();
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
    if (user || isAuthLoading) return;

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
  }, [user, isAuthLoading]);

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search pulses..." 
          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-slate-500 hover:text-primary-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <button className="text-slate-500 hover:text-primary-600 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        
        {!isAuthLoading && user ? (
          <div className="flex items-center space-x-3 cursor-pointer group">
            {user.picture ? (
              <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full shadow-md" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-primary-300 flex items-center justify-center text-white font-bold text-sm shadow-md uppercase">
                {user.name ? user.name.charAt(0) : user.email.charAt(0)}
              </div>
            )}
            <button onClick={logout} className="text-slate-500 hover:text-slate-800 hidden group-hover:flex items-center text-sm transition-all">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </button>
          </div>
        ) : !isAuthLoading && !user ? (
          <div ref={googleButtonRef}></div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
        )}
      </div>
    </header>
  );
};
