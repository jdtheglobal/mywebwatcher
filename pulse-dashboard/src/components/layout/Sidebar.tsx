import React from 'react';
import { Activity, LayoutDashboard, History, Bell, PlusCircle } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-2xl z-20">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <Activity className="w-8 h-8 text-primary-500" />
        <span className="text-2xl font-bold tracking-wider">Pulse</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
        <NavItem icon={<Activity />} label="My Pulses" />
        <NavItem icon={<History />} label="History" />
        <NavItem icon={<Bell />} label="Notifications" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-3 rounded-lg transition-colors font-medium">
          <PlusCircle className="w-5 h-5" />
          <span>Create New Pulse</span>
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => {
  return (
    <a href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-primary-600/20 text-primary-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      <span>{label}</span>
    </a>
  );
};
