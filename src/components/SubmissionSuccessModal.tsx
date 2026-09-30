import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  X, 
  FileText, 
  User, 
  Mail, 
  ExternalLink, 
  Copy, 
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SubmissionRecord } from '../types';
import { formatBytes } from '../utils/resumeInspector';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SubmissionRecord | null;
  onNewSubmission: () => void;
  onViewHistory: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  record,
  onNewSubmission,
  onViewHistory,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch (e) {
        // Fallback gracefully if confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen || !record) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(record.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Success Banner */}
        <div className="bg-emerald-600 px-6 py-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold tracking-tight">Resume Submitted to n8n!</h3>
            <p className="text-xs text-emerald-100 mt-1 max-w-sm">
              Workflow trigger acknowledged receipt with status {record.statusCode} OK
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Candidate Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Submission Receipt</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 transition-colors"
                title="Copy submission reference ID"
              >
                <span>ID: {record.id.slice(0, 14)}...</span>
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-900">{record.candidateName}</span>
                {record.targetRole && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{record.targetRole}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{record.candidateEmail}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">{record.fileName}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">{formatBytes(record.fileSizeBytes)}</span>
              </div>
            </div>
          </div>

          {/* Workflow Execution Info */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                n8n Webhook Response
              </span>
              <span className="text-[11px] text-slate-400">
                {new Date(record.submittedAt).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-slate-600">
              The automated resume analyzer workflow is now parsing the document, extracting structured qualifications, and evaluating match metrics.
            </p>

            {record.responsePayload && (
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                <div className="text-[10px] text-slate-400 mb-1">Payload returned by n8n:</div>
                <code>{record.responsePayload}</code>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onViewHistory}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px] text-center"
          >
            View Submissions Log
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onNewSubmission}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <span>Submit Another Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
