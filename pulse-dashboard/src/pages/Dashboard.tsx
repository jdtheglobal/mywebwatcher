import React, { useState } from 'react';
import { Activity, Zap, Mail, BrainCircuit, Play, Pause, MoreHorizontal, Loader2, Plus } from 'lucide-react';
import { useSites } from '../lib/api';
import { CreatePulseModal } from '../components/CreatePulseModal';

export const Dashboard = () => {
  const { data: sites, isLoading: isLoadingSites } = useSites();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <CreatePulseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Active Pulses" value={sites?.length || "0"} icon={<Activity className="text-blue-500" />} />
        <KpiCard title="Changes Detected" value="5" icon={<Zap className="text-amber-500" />} subtitle="Today" />
        <KpiCard title="Alerts Sent" value="8" icon={<Mail className="text-emerald-500" />} />
        <KpiCard title="AI Summaries" value="15" icon={<BrainCircuit className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sites Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">My Pulses</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Create Pulse
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">URL</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Frequency</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoadingSites ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                  ) : sites?.length > 0 ? (
                    sites.map((site: any) => (
                      <SiteRow key={site.id} name={site.name} url={site.url} status="Monitoring" freq={site.frequency} />
                    ))
                  ) : (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">No pulses found. Create your first one!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Changes Grid */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Changes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card bg-gradient-to-br from-green-50 to-white border-green-100">
                <h3 className="font-semibold text-slate-800 mb-2">Product Price Monitor</h3>
                <p className="text-sm text-slate-600">Price dropped from <span className="line-through text-red-400">$120</span> to <span className="font-bold text-green-600">$99</span></p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-slate-800 mb-2">News Monitor</h3>
                <p className="text-sm text-slate-600">New article published: <br/><span className="italic">"Tech Trends 2025"</span></p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-slate-800 mb-2">Stock Alert</h3>
                <p className="text-sm text-slate-600">Item back in stock: <br/><span className="font-medium text-slate-700">Gaming Console</span></p>
              </div>
            </div>
          </div>

          {/* Snapshot History UI */}
          <div className="card">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Snapshot History</h2>
              <span className="text-sm text-slate-500">29 April 2026 - 01 May 2026</span>
             </div>
             <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200 flex items-center justify-between">
                <div className="w-5/12 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Old Snapshot</h4>
                  <div className="space-y-2 opacity-60">
                    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                    <p className="text-sm font-medium mt-4">Price: <span className="text-red-500">$120</span></p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                    View Diff
                  </button>
                </div>

                <div className="w-5/12 bg-white p-4 rounded-lg shadow-sm border border-primary-100 ring-1 ring-primary-500/20">
                  <h4 className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">New Snapshot</h4>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                    <p className="text-sm font-medium mt-4">Price: <span className="text-green-500">$99</span></p>
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-8">
          
          {/* AI Summary Card */}
          <div className="card relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Change Summary</h2>
            <p className="text-xs text-slate-500 mb-4">Product Price Monitor</p>
            
            <div className="bg-purple-50/50 rounded-lg p-4 mb-4 border border-purple-100/50">
              <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
                <BrainCircuit className="w-4 h-4 mr-2" />
                AI Analysis
              </h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                The price of the product has dropped from $120 to $99. Significant discount detected.
              </p>
            </div>
            
            <button className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700">View Details</button>
          </div>

          {/* Alerts Feed */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Alerts</h2>
            <div className="space-y-4">
              <AlertItem icon={<Mail className="w-4 h-4 text-amber-500"/>} text="Email Notification Sent" time="30 mins ago" />
              <AlertItem icon={<div className="w-4 h-4 text-blue-500 font-bold text-xs flex items-center justify-center">T</div>} text="Teams Alert Sent" time="1 hour ago" />
              <AlertItem icon={<div className="w-4 h-4 text-red-500 font-bold text-xs flex items-center justify-center">#</div>} text="Slack Message sent" time="Yesterday" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Components

const KpiCard = ({ title, value, icon, trend, subtitle }: any) => (
  <div className="glass card relative overflow-hidden group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        {trend && <p className="text-xs font-medium text-green-500 mt-2">{trend}</p>}
        {subtitle && <p className="text-xs font-medium text-slate-400 mt-2">{subtitle}</p>}
      </div>
      <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon, { className: `w-6 h-6 ${icon.props.className}` })}
      </div>
    </div>
  </div>
);

const SiteRow = ({ name, url, status, last, freq }: any) => {
  const isMonitoring = status === 'Monitoring';
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="py-4 font-medium text-slate-800">{name}</td>
      <td className="py-4 text-slate-500 truncate max-w-[150px]">{url}</td>
      <td className="py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isMonitoring ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          {isMonitoring ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
          {status}
        </span>
      </td>
      <td className="py-4 text-slate-600">{last}</td>
      <td className="py-4 text-slate-600 flex items-center justify-between">
        <span>Every {freq}</span>
        <button className="text-slate-400 hover:text-primary-600 p-1 rounded hover:bg-slate-100 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

const AlertItem = ({ icon, text, time }: any) => (
  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
    <div className="mt-0.5 p-2 bg-white shadow-sm border border-slate-100 rounded-md">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-700">{text}</p>
      <p className="text-xs text-slate-400">{time}</p>
    </div>
  </div>
);
