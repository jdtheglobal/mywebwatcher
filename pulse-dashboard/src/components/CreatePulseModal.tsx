import React, { useState } from 'react';
import { X, Loader2, Globe, Activity } from 'lucide-react';
import { useCreateSite } from '../lib/api';

interface CreatePulseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePulseModal = ({ isOpen, onClose }: CreatePulseModalProps) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [frequency, setFrequency] = useState('15m');
  const [error, setError] = useState<string | null>(null);

  const { mutate: createSite, isPending } = useCreateSite();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !url) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    createSite(
      { name, url, frequency },
      {
        onSuccess: () => {
          setName('');
          setUrl('');
          setFrequency('15m');
          onClose();
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to create pulse. Please try again.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Create New Pulse</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Pulse Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Competitor Pricing Page"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Target URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Check Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              disabled={isPending}
            >
              <option value="15m">Every 15 minutes</option>
              <option value="1h">Hourly</option>
              <option value="12h">Twice a day</option>
              <option value="24h">Daily</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-sm hover:shadow flex items-center disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Pulse'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
