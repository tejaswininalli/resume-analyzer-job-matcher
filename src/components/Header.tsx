import React from 'react';
import { 
  FileText, 
  Settings2, 
  Globe, 
  Radio, 
  ExternalLink,
  History,
  LayoutGrid,
  GitBranch
} from 'lucide-react';
import { EndpointConfig } from '../types';

interface HeaderProps {
  endpointConfig: EndpointConfig;
  onOpenSettings: () => void;
  activeTab: 'upload' | 'embed' | 'history' | 'workflow';
  onSelectTab: (tab: 'upload' | 'embed' | 'history' | 'workflow') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  endpointConfig,
  onOpenSettings,
  activeTab,
  onSelectTab,
  historyCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top row */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
                  Resume Analyser
                </h1>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">·</span>
                <span className="hidden sm:inline text-xs font-medium text-slate-500 truncate">
                  n8n Automation Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block truncate">
                AI-assisted candidate screening pipeline & resume extractor
              </p>
            </div>
          </div>

          {/* Controls on right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Active Endpoint Quick Indicator & Switcher Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 min-h-[40px]"
              title="Configure n8n webhook target URL and test mode"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  endpointConfig.mode === 'production' ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  endpointConfig.mode === 'production' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </span>
              <span className="hidden xs:inline">
                {endpointConfig.mode === 'production' ? 'Live Webhook' : endpointConfig.mode === 'test' ? 'Test Mode' : 'Custom URL'}
              </span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Direct Link to n8n Cloud */}
            <a
              href="https://tejasyam.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent rounded-lg transition-colors min-h-[40px]"
              title="Open your n8n Cloud workflow canvas"
            >
              <Radio className="w-3.5 h-3.5 text-indigo-500" />
              <span>n8n Cloud</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs (Functional segmented controls) */}
        <div className="flex items-center justify-between overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none border-t border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => onSelectTab('upload')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px] ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Upload & Submit</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('embed')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px] ${
                activeTab === 'embed'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Embed View</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px] ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Submissions</span>
              {historyCount > 0 && (
                <span className="text-xs font-semibold text-slate-500 ml-0.5">
                  ({historyCount})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('workflow')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px] ${
                activeTab === 'workflow'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-4 h-4 text-slate-500" />
              <span>n8n Pipeline</span>
            </button>
          </div>

          {/* Quick metadata unboxed */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 shrink-0 pr-1">
            <span>Form ID: fbd6de1f...</span>
            <span aria-hidden="true">·</span>
            <span>n8n Cloud</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-medium">Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
