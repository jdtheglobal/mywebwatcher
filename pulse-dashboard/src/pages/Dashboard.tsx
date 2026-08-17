import React, { useState } from 'react';
import { Activity, Zap, Mail, BrainCircuit, Play, Pause, Loader2, Plus } from 'lucide-react';
import { useSites, useUpdateSiteStatus, useSiteChanges } from '../lib/api';
import { CreatePulseModal } from '../components/CreatePulseModal';

export const Dashboard = () => {
  const { data: sites, isLoading: isLoadingSites } = useSites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  
  // Set first site as selected by default once sites load
  React.useEffect(() => {
    if (sites && sites.length > 0 && !selectedSiteId) {
      setSelectedSiteId(sites[0].id);
    }
  }, [sites, selectedSiteId]);

  const { data: changes, isLoading: isLoadingChanges } = useSiteChanges(selectedSiteId);

  const selectedSite = sites?.find((s: any) => s.id === selectedSiteId);
  const latestChange = changes && changes.length > 0 ? changes[0] : null;

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
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium">Last Checked</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoadingSites ? (
                    <tr><td colSpan={6} className="py-8 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                  ) : sites?.length > 0 ? (
                    sites.map((site: any) => (
                      <SiteRow 
                        key={site.id} 
                        site={site} 
                        isSelected={site.id === selectedSiteId} 
                        onClick={() => setSelectedSiteId(site.id)} 
                      />
                    ))
                  ) : (
                    <tr><td colSpan={6} className="py-8 text-center text-slate-400">No pulses found. Create your first one!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Changes Grid */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              History: {selectedSite?.name || 'Select a pulse'}
            </h2>
            
            {isLoadingChanges ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
            ) : changes?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {changes.map((change: any) => (
                  <div key={change.id} className="card hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${change.severity === 'High' ? 'bg-red-500' : change.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                    <div className="pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-800 text-sm">AI Summary</h3>
                        <span className="text-xs text-slate-400">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(change.createdAt))}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-3">{change.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center text-slate-500 border-dashed">
                <BrainCircuit className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                No changes detected yet for this pulse.
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-8">
          
          {/* AI Summary Card */}
          <div className="card relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Latest Insight</h2>
            <p className="text-xs text-slate-500 mb-4">{selectedSite?.name || 'Waiting for selection...'}</p>
            
            {latestChange ? (
              <div className="bg-purple-50/50 rounded-lg p-4 mb-4 border border-purple-100/50 animate-in fade-in zoom-in-95">
                <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
                  <BrainCircuit className="w-4 h-4 mr-2" />
                  AI Analysis
                </h4>
                <p className="text-sm text-purple-800 leading-relaxed">
                  {latestChange.summary}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-4 mb-4 text-sm text-slate-500 text-center">
                Waiting for the next scrape to analyze changes.
              </div>
            )}
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

const SiteRow = ({ site, isSelected, onClick }: { site: any; isSelected: boolean; onClick: () => void }) => {
  const { mutate: updateStatus, isPending } = useUpdateSiteStatus();
  const isMonitoring = site.status === 'Monitoring';

  const toggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatus({ siteId: site.id, status: isMonitoring ? 'Suspended' : 'Monitoring' });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(dateStr));
  };

  return (
    <tr 
      onClick={onClick}
      className={`border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${isSelected ? 'bg-primary-50/50 hover:bg-primary-50' : 'hover:bg-slate-50/50'}`}
    >
      <td className="py-4 font-medium text-slate-800">
        <div className="flex items-center">
          {isSelected && <div className="w-1.5 h-6 bg-primary-500 rounded-full mr-2"></div>}
          {site.name}
        </div>
      </td>
      <td className="py-4 text-slate-500 truncate max-w-[200px]"><a href={site.url} target="_blank" rel="noreferrer" className="hover:text-primary-600 hover:underline">{site.url}</a></td>
      <td className="py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isMonitoring ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
          {isMonitoring ? <Activity className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
          {site.status}
        </span>
      </td>
      <td className="py-4 text-slate-500 text-xs">{formatDate(site.createdAt)}</td>
      <td className="py-4 text-slate-500 text-xs">{formatDate(site.lastChecked)}</td>
      <td className="py-4 text-right">
        <button 
          onClick={toggleStatus}
          disabled={isPending}
          className="text-slate-400 hover:text-primary-600 p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          title={isMonitoring ? "Suspend Pulse" : "Resume Pulse"}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
