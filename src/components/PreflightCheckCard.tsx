import React from 'react';
import { CheckCircle2, AlertTriangle, FileCheck, Sparkles } from 'lucide-react';
import { PreflightAnalysis } from '../types';

interface PreflightCheckCardProps {
  analysis: PreflightAnalysis;
  fileName: string;
  fileSizeBytes: number;
}

export const PreflightCheckCard: React.FC<PreflightCheckCardProps> = ({
  analysis,
  fileName,
  fileSizeBytes,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-600 shadow-xs">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Pre-Flight Resume Inspector</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{fileName}</span>
              <span aria-hidden="true">·</span>
              <span>~{analysis.wordCount.toLocaleString()} words</span>
            </div>
          </div>
        </div>

        {/* ATS Score Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${getScoreColor(analysis.atsScore)}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS Readiness: {analysis.atsScore}/100</span>
          </div>
        </div>
      </div>

      {/* Detected Sections Checklist */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 text-xs">
        <div className="flex items-center gap-1.5">
          {analysis.hasEmail ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className={analysis.hasEmail ? 'text-slate-700' : 'text-slate-400'}>
            Email Header
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {analysis.hasPhone ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className={analysis.hasPhone ? 'text-slate-700' : 'text-slate-400'}>
            Phone Number
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {analysis.hasExperience ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className={analysis.hasExperience ? 'text-slate-700' : 'text-slate-400'}>
            Work Experience
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {analysis.hasEducation ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className={analysis.hasEducation ? 'text-slate-700' : 'text-slate-400'}>
            Education Block
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {analysis.hasSkills ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className={analysis.hasSkills ? 'text-slate-700' : 'text-slate-400'}>
            Skills Section
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-slate-700">Supported Format</span>
        </div>
      </div>

      {/* Recommendations if any */}
      {analysis.recommendations.length > 0 && (
        <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-600">
          <span className="font-medium text-slate-700 block mb-1">ATS Optimization Suggestions:</span>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
            {analysis.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
