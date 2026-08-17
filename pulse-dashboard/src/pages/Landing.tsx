import React from 'react';
import { Activity, Zap, BrainCircuit, Mail, ArrowRight, Shield } from 'lucide-react';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary-200">
      
      {/* Navbar */}
      <nav className="w-full px-8 h-20 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">MyWebWatcher</span>
        </div>
        <div className="flex items-center space-x-4">
          <GoogleLoginButton />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Monitor the web in real-time</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl animate-in slide-in-from-bottom-6 duration-700 delay-100">
          Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Web Change</span> Again.
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-2xl animate-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed">
          Automate your web monitoring. Track prices, news, and competitor updates. Get instant AI summaries sent straight to your inbox the moment something changes.
        </p>

        <div className="animate-in slide-in-from-bottom-10 duration-700 delay-300 transform hover:scale-105 transition-all">
          <GoogleLoginButton />
        </div>

        <p className="mt-6 text-sm text-slate-500 flex items-center animate-in fade-in duration-1000 delay-500">
          <Shield className="w-4 h-4 mr-1 text-emerald-500" /> Secure authentication via Google
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left w-full">
          <FeatureCard 
            icon={<Activity className="text-blue-500" />}
            title="Automated Pulses"
            desc="Set up pulses to automatically capture website snapshots on your preferred schedule without writing any code."
            delay="delay-100"
          />
          <FeatureCard 
            icon={<BrainCircuit className="text-purple-500" />}
            title="AI-Powered Summaries"
            desc="Don't just see what changed. Let AI analyze the diffs and provide a human-readable summary of the exact updates."
            delay="delay-200"
          />
          <FeatureCard 
            icon={<Mail className="text-emerald-500" />}
            title="Instant Alerts"
            desc="Receive instant notifications via Email, Slack, or Microsoft Teams the moment a meaningful change is detected."
            delay="delay-300"
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 border-t border-slate-200 bg-white text-center text-slate-500 text-sm">
        <p>© 2026 MyWebWatcher. Built with Azure Static Web Apps.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }: any) => (
  <div className={`bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group animate-in slide-in-from-bottom-8 duration-700 ${delay}`}>
    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { className: `w-6 h-6 ${icon.props.className}` })}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
    <div className="mt-6 flex items-center text-primary-600 font-medium opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all">
      Learn more <ArrowRight className="w-4 h-4 ml-1" />
    </div>
  </div>
);
