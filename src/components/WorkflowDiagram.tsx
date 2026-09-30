import React from 'react';
import { 
  FileText, 
  Radio, 
  Cpu, 
  Database, 
  Mail, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2,
  Code2,
  Workflow
} from 'lucide-react';
import { EndpointConfig } from '../types';

interface WorkflowDiagramProps {
  endpointConfig: EndpointConfig;
}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ endpointConfig }) => {
  return (
    <div className="space-y-6">
      {/* Title & Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-indigo-600" />
              <span>n8n Resume Analyser Architecture</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end data flow from this web client into your n8n workflow canvas
            </p>
          </div>

          <a
            href="https://tejasyam.app.n8n.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors self-start sm:self-auto min-h-[40px]"
          >
            <span>Open in n8n Cloud</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Visual Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
          {/* Step 1: Webhook Ingestion */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-3">
                1
              </div>
              <h4 className="text-xs font-semibold text-slate-900">Form Trigger</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Receives HTTP multipart POST containing name, email, and binary file attachments.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-600">
              field-0, field-1, field-2
            </div>
          </div>

          {/* Step 2: Document Processing */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-3">
                2
              </div>
              <h4 className="text-xs font-semibold text-slate-900">Document Parser</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Converts uploaded PDF, DOCX, or text stream into plain text tokens for AI parsing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-600">
              Read Binary Files / Extract
            </div>
          </div>

          {/* Step 3: LLM & AI Analysis */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-3">
                3
              </div>
              <h4 className="text-xs font-semibold text-slate-900">AI Resume Evaluator</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Analyzes qualifications, calculates job match score, detects gaps, and extracts core skills.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-600">
              Gemini / OpenAI Model Node
            </div>
          </div>

          {/* Step 4: Dispatch & Storage */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-3">
                4
              </div>
              <h4 className="text-xs font-semibold text-slate-900">Actions & Notifications</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Persists record to ATS / Database and delivers recruiter email notifications or alerts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-600">
              Email / Database / Webhook
            </div>
          </div>
        </div>
      </div>

      {/* Field Mapping Reference */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-600" />
          <span>Webhook Parameter Schema</span>
        </h4>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="p-3">Field Key</th>
                <th className="p-3">Data Type</th>
                <th className="p-3">Description</th>
                <th className="p-3">Form Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-mono text-indigo-600 font-medium">field-0</td>
                <td className="p-3 font-mono text-slate-600">string</td>
                <td className="p-3 text-slate-600">Candidate full name</td>
                <td className="p-3 text-slate-800 font-medium">name</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-indigo-600 font-medium">field-1</td>
                <td className="p-3 font-mono text-slate-600">string (email)</td>
                <td className="p-3 text-slate-600">Contact email address</td>
                <td className="p-3 text-slate-800 font-medium">email</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-indigo-600 font-medium">field-2</td>
                <td className="p-3 font-mono text-slate-600">Binary (File)</td>
                <td className="p-3 text-slate-600">Uploaded resume document (PDF, Word, TXT)</td>
                <td className="p-3 text-slate-800 font-medium">uplode resume</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* n8n Configuration & Troubleshooting Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">
          Understanding Test Mode vs. Production Mode in n8n
        </h4>
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            <strong>Production URL:</strong> <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800 font-mono text-[11px]">https://...n8n.cloud/form/...</code> is active 24/7 once your workflow is switched to <strong>Active</strong> in the upper right corner of n8n. Submissions return status 200 immediately.
          </p>
          <p>
            <strong>Test URL:</strong> <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800 font-mono text-[11px]">https://...n8n.cloud/form-test/...</code> is only listening when you click <strong>"Execute step"</strong> or <strong>"Test workflow"</strong> in your n8n workflow canvas. If n8n isn't actively listening, it returns 404 "Form Trigger isn't listening yet".
          </p>
          <p>
            You can toggle between both endpoints at any time using the endpoint button in the top bar.
          </p>
        </div>
      </div>
    </div>
  );
};
