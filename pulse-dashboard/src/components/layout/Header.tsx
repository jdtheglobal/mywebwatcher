import { Bell, Settings, Search, LogIn, LogOut } from 'lucide-react';
import { usePulseStore } from '../../store/usePulseStore';

export const Header = () => {
  const { user, isAuthLoading } = usePulseStore();

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
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-primary-300 flex items-center justify-center text-white font-bold text-sm shadow-md uppercase">
              {user.userDetails.charAt(0)}
            </div>
            <a href="/.auth/logout" className="text-slate-500 hover:text-slate-800 hidden group-hover:flex items-center text-sm transition-all">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </a>
          </div>
        ) : !isAuthLoading && !user ? (
          <a href="/.auth/login/github" className="flex items-center text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
            <LogIn className="w-4 h-4 mr-2" />
            Login with GitHub
          </a>
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
        )}
      </div>
    </header>
  );
};
