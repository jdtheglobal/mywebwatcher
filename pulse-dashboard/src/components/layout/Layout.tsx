import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <Header />
        <main className="flex-1 p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
