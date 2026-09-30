import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Download, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail,
  ArrowRight,
  Filter
} from 'lucide-react';
import { SubmissionRecord } from '../types';
import { formatBytes } from '../utils/resumeInspector';

interface SubmissionHistoryProps {
  records: SubmissionRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: SubmissionRecord) => void;
  onGoToUpload: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  records,
  onClearHistory,
  onSelectRecord,
  onGoToUpload,
}) => {
  const [search, setSearch] = useState('');

  const filtered = records.filter((r) => {
    const query = search.toLowerCase();
    return (
      r.candidateName.toLowerCase().includes(query) ||
      r.candidateEmail.toLowerCase().includes(query) ||
      r.fileName.toLowerCase().includes(query) ||
      (r.targetRole && r.targetRole.toLowerCase().includes(query))
    );
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `n8n_resume_submissions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Submissions Audit Log
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            History of resumes transmitted to the n8n Resume Analyser pipeline
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {records.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors min-h-[40px]"
                title="Export submission log as JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors min-h-[40px]"
                title="Clear local submission history"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clear</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onGoToUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors min-h-[40px]"
          >
            <span>New Submission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {records.length > 0 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates, emails, filenames, or roles..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
          />
        </div>
      )}

      {/* Records list */}
      {records.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">No submissions recorded yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Submit your first resume using the upload portal or try one of the instant sample profiles.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToUpload}
            className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors min-h-[40px]"
          >
            Go to Upload Portal
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
          No records match your search filter "{search}".
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelectRecord(record)}
              className="bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs"
            >
              <div className="space-y-1.5 min-w-0">
                {/* Candidate title row */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {record.candidateName}
                  </h4>
                  {record.targetRole && (
                    <>
                      <span aria-hidden="true" className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500 truncate font-normal">
                        {record.targetRole}
                      </span>
                    </>
                  )}
                </div>

                {/* Metadata row (Zero-pill compliant: unboxed text with middle dots) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {record.candidateEmail}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {record.fileName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatBytes(record.fileSizeBytes)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">
                    {new Date(record.submittedAt).toLocaleDateString()} {new Date(record.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Transmitted ({record.statusCode})</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate max-w-[160px]">
                    {record.id}
                  </div>
                </div>

                <div className="p-2 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
