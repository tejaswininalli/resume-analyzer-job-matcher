/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EndpointConfig, SubmissionRecord } from './types';
import { Header } from './components/Header';
import { ResumeUploadForm } from './components/ResumeUploadForm';
import { EndpointSettingsModal } from './components/EndpointSettingsModal';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { N8nEmbedView } from './components/N8nEmbedView';
import { SubmissionHistory } from './components/SubmissionHistory';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { 
  FileText, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEY_CONFIG = 'n8n_resume_analyser_config';
const STORAGE_KEY_HISTORY = 'n8n_resume_analyser_history';

const DEFAULT_CONFIG: EndpointConfig = {
  mode: 'production',
  url: 'https://tejasyam.app.n8n.cloud/form/fbd6de1f-7cb5-4b5f-8c9e-7d6baa71ad2b',
  customUrl: 'https://tejasyam.app.n8n.cloud/form/fbd6de1f-7cb5-4b5f-8c9e-7d6baa71ad2b',
  defaultProdUrl: 'https://tejasyam.app.n8n.cloud/form/fbd6de1f-7cb5-4b5f-8c9e-7d6baa71ad2b',
  defaultTestUrl: 'https://tejasyam.app.n8n.cloud/form-test/fbd6de1f-7cb5-4b5f-8c9e-7d6baa71ad2b',
};

export default function App() {
  const [endpointConfig, setEndpointConfig] = useState<EndpointConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'upload' | 'embed' | 'history' | 'workflow'>('upload');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [successRecord, setSuccessRecord] = useState<SubmissionRecord | null>(null);

  // Sync config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(endpointConfig));
    } catch (e) {
      console.error(e);
    }
  }, [endpointConfig]);

  // Sync submissions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  const handleSubmitSuccess = (record: SubmissionRecord) => {
    setSubmissions((prev) => [record, ...prev]);
    setSuccessRecord(record);
  };

  const handleClearHistory = () => {
    setSubmissions([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {}
  };

  const handleSwitchToProd = () => {
    const updated: EndpointConfig = {
      ...endpointConfig,
      mode: 'production',
      url: endpointConfig.defaultProdUrl,
    };
    setEndpointConfig(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        endpointConfig={endpointConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        historyCount={submissions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner with Endpoint status info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-white border border-slate-200/80 rounded-xl px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                endpointConfig.mode === 'production' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                endpointConfig.mode === 'production' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
            <span className="text-slate-700 font-medium">
              Target Webhook:
            </span>
            <code className="text-slate-900 font-mono text-[11px] truncate max-w-[280px] sm:max-w-md bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
              {endpointConfig.url}
            </code>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {endpointConfig.mode === 'test' && (
              <button
                type="button"
                onClick={handleSwitchToProd}
                className="text-amber-700 hover:text-amber-900 font-semibold underline text-xs"
              >
                Switch to Live Prod
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
            >
              Configure Endpoint
            </button>
          </div>
        </div>

        {/* Tab 1: Upload & Submit */}
        {activeTab === 'upload' && (
          <ResumeUploadForm
            endpointConfig={endpointConfig}
            onSubmitSuccess={handleSubmitSuccess}
            onSwitchToProd={handleSwitchToProd}
          />
        )}

        {/* Tab 2: Embedded n8n Form */}
        {activeTab === 'embed' && (
          <N8nEmbedView
            endpointConfig={endpointConfig}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <SubmissionHistory
            records={submissions}
            onClearHistory={handleClearHistory}
            onSelectRecord={(rec) => setSuccessRecord(rec)}
            onGoToUpload={() => setActiveTab('upload')}
          />
        )}

        {/* Tab 4: Pipeline Architecture */}
        {activeTab === 'workflow' && (
          <WorkflowDiagram endpointConfig={endpointConfig} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Resume Analyser</span>
            <span aria-hidden="true">·</span>
            <span>n8n Cloud Webhook Integration</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-medium">Ready</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://tejasyam.app.n8n.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <span>n8n Cloud Canvas</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Endpoint Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Endpoint Settings Modal */}
      <EndpointSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={endpointConfig}
        onSave={setEndpointConfig}
      />

      {/* Submission Success Modal */}
      <SubmissionSuccessModal
        isOpen={!!successRecord}
        onClose={() => setSuccessRecord(null)}
        record={successRecord}
        onNewSubmission={() => setSuccessRecord(null)}
        onViewHistory={() => {
          setSuccessRecord(null);
          setActiveTab('history');
        }}
      />
    </div>
  );
}
