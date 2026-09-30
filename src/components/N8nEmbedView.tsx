import React, { useState } from 'react';
import { 
  ExternalLink, 
  RotateCw, 
  AlertCircle, 
  Maximize2, 
  CheckCircle2, 
  HelpCircle,
  Radio
} from 'lucide-react';
import { EndpointConfig } from '../types';

interface N8nEmbedViewProps {
  endpointConfig: EndpointConfig;
  onOpenSettings: () => void;
}

export const N8nEmbedView: React.FC<N8nEmbedViewProps> = ({
  endpointConfig,
  onOpenSettings,
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Live n8n Form Trigger Frame
            </h3>
            <p className="text-xs text-slate-500 font-mono truncate max-w-md">
              {endpointConfig.url}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors min-h-[40px]"
            title="Reload form frame"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reload</span>
          </button>

          <a
            href={endpointConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors min-h-[40px]"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Helpful notice regarding Test vs Production */}
      {endpointConfig.mode === 'test' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900">Test Trigger Mode Active</p>
            <p className="mt-0.5">
              If you see "Form Trigger isn't listening yet" below, click <strong>"Execute step"</strong> in your n8n workflow canvas or switch to Live Production mode in settings.
            </p>
            <button
              type="button"
              onClick={onOpenSettings}
              className="mt-2 text-xs font-semibold text-amber-900 underline hover:text-amber-950"
            >
              Switch to Live Production URL
            </button>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-xs relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-3 z-10">
            <RotateCw className="w-6 h-6 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-500 font-medium">Connecting to n8n form host...</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={endpointConfig.url}
          title="n8n Resume Analyser Form"
          onLoad={() => setIsLoading(false)}
          className="w-full h-[650px] border-0 bg-white"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-downloads"
        />
      </div>
    </div>
  );
};
