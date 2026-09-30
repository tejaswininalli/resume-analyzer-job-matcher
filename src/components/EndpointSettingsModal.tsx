import React, { useState } from 'react';
import { 
  X, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Radio, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { EndpointConfig, EndpointMode } from '../types';

interface EndpointSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: EndpointConfig;
  onSave: (newConfig: EndpointConfig) => void;
}

export const EndpointSettingsModal: React.FC<EndpointSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [mode, setMode] = useState<EndpointMode>(config.mode);
  const [customUrl, setCustomUrl] = useState(config.customUrl);
  const [pingStatus, setPingStatus] = useState<{
    testing: boolean;
    success?: boolean;
    latencyMs?: number;
    message?: string;
  }>({ testing: false });

  if (!isOpen) return null;

  const currentActiveUrl = 
    mode === 'production' 
      ? config.defaultProdUrl 
      : mode === 'test' 
        ? config.defaultTestUrl 
        : customUrl;

  const handleTestConnection = async () => {
    setPingStatus({ testing: true });
    const startTime = performance.now();
    try {
      // Send OPTIONS or GET check to test endpoint availability
      const res = await fetch(currentActiveUrl, {
        method: 'GET',
        headers: { Accept: 'text/html, application/json' },
      });
      const latency = Math.round(performance.now() - startTime);

      if (res.status === 200) {
        setPingStatus({
          testing: false,
          success: true,
          latencyMs: latency,
          message: 'Endpoint is online and actively receiving submissions (200 OK).',
        });
      } else if (res.status === 404 && mode === 'test') {
        setPingStatus({
          testing: false,
          success: false,
          latencyMs: latency,
          message: 'n8n test trigger is waiting. Open your n8n workflow and click "Test step" or "Execute workflow" to listen.',
        });
      } else {
        setPingStatus({
          testing: false,
          success: false,
          latencyMs: latency,
          message: `Endpoint responded with status ${res.status}.`,
        });
      }
    } catch (err: any) {
      const latency = Math.round(performance.now() - startTime);
      setPingStatus({
        testing: false,
        success: false,
        latencyMs: latency,
        message: 'Could not connect directly. (CORS preflight or network restrictions may apply).',
      });
    }
  };

  const handleSave = () => {
    onSave({
      ...config,
      mode,
      customUrl,
      url: currentActiveUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-slate-900">
              n8n Target Endpoint Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select whether to target the Live Production or Test Trigger webhook
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Mode Option 1: Live Production */}
          <label 
            className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              mode === 'production' 
                ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="endpoint-mode"
                checked={mode === 'production'}
                onChange={() => setMode('production')}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">Live Production Mode</span>
                  <span className="text-xs text-emerald-600 font-medium">· Active & Ready</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sends directly to <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800 text-[11px]">/form/...</code>. Executes published n8n workflow immediately without needing editor focus.
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-500 break-all bg-white/80 p-2 rounded border border-slate-200">
                  {config.defaultProdUrl}
                </div>
              </div>
            </div>
          </label>

          {/* Mode Option 2: Test Mode */}
          <label 
            className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              mode === 'test' 
                ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="endpoint-mode"
                checked={mode === 'test'}
                onChange={() => setMode('test')}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">Test Trigger Mode</span>
                  <span className="text-xs text-amber-600 font-medium">· Initial URL</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sends to <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-800 text-[11px]">/form-test/...</code>. Use this when debugging in n8n while clicking "Test step" in the trigger node.
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-500 break-all bg-white/80 p-2 rounded border border-slate-200">
                  {config.defaultTestUrl}
                </div>
              </div>
            </div>
          </label>

          {/* Mode Option 3: Custom Endpoint */}
          <label 
            className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              mode === 'custom' 
                ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="endpoint-mode"
                checked={mode === 'custom'}
                onChange={() => setMode('custom')}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-900">Custom Webhook / Form URL</span>
                <p className="text-xs text-slate-500 mt-1">
                  Point to another self-hosted or cloud n8n webhook instance.
                </p>
                {mode === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://your-n8n.cloud/form/..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          </label>

          {/* Connection Test Tool */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Check endpoint connectivity</span>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={pingStatus.testing}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 disabled:opacity-50 min-h-[36px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${pingStatus.testing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
                <span>{pingStatus.testing ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {pingStatus.message && (
              <div className={`text-xs p-2 rounded-lg flex items-start gap-2 ${
                pingStatus.success ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
              }`}>
                {pingStatus.success ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p>{pingStatus.message}</p>
                  {pingStatus.latencyMs !== undefined && (
                    <span className="text-[11px] opacity-75 mt-0.5 block">
                      Latency: {pingStatus.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors min-h-[44px]"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
