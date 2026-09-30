import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  User, 
  Mail, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { EndpointConfig, SubmissionRecord, PreflightAnalysis } from '../types';
import { SAMPLE_PROFILES, createSampleResumeFile } from '../utils/sampleResumes';
import { analyzeResumeFile, formatBytes } from '../utils/resumeInspector';
import { PreflightCheckCard } from './PreflightCheckCard';

interface ResumeUploadFormProps {
  endpointConfig: EndpointConfig;
  onSubmitSuccess: (record: SubmissionRecord) => void;
  onSwitchToProd: () => void;
}

export const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({
  endpointConfig,
  onSubmitSuccess,
  onSwitchToProd,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<PreflightAnalysis | null>(null);
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{
    message: string;
    isTestTriggerWaiting?: boolean;
  } | null>(null);

  // Field validation touched
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; file?: boolean }>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze file whenever it changes
  useEffect(() => {
    if (file) {
      analyzeResumeFile(file).then(setAnalysis).catch(console.error);
    } else {
      setAnalysis(null);
    }
  }, [file]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setTouched(prev => ({ ...prev, file: true }));
      setSubmitError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setTouched(prev => ({ ...prev, file: true }));
      setSubmitError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSampleProfile = (profileIndex: number) => {
    const profile = SAMPLE_PROFILES[profileIndex];
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
    setTargetRole(profile.role);
    const sampleFile = createSampleResumeFile(profile);
    setFile(sampleFile);
    setTouched({ name: true, email: true, file: true });
    setSubmitError(null);
  };

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, file: true });

    if (!name.trim() || !isEmailValid(email) || !file) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Prepare multipart FormData matching n8n form schema:
    // field-0: name
    // field-1: email
    // field-2: resume file
    const formData = new FormData();
    formData.append('field-0', name.trim());
    formData.append('field-1', email.trim());
    formData.append('field-2', file);

    const activeUrl = endpointConfig.url;

    try {
      const response = await fetch(activeUrl, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch (err) {
        // Response might be plain text or HTML
      }

      // Check if n8n returned "Form Trigger isn't listening yet" (typically in test mode)
      if (
        response.status === 404 && 
        (responseText.includes("Form Trigger isn't listening yet") || activeUrl.includes('/form-test/'))
      ) {
        setSubmitError({
          message: 'The n8n Test Trigger is not actively listening. In your n8n workflow canvas, click "Test step" or toggle the workflow to Active.',
          isTestTriggerWaiting: true,
        });
        setIsSubmitting(false);
        return;
      }

      if (!response.ok && response.status !== 200) {
        throw new Error(
          responseJson?.message || 
          `Workflow returned status ${response.status}: ${responseText.slice(0, 140)}`
        );
      }

      // Record successful submission
      const newRecord: SubmissionRecord = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        candidateName: name.trim(),
        candidateEmail: email.trim(),
        fileName: file.name,
        fileSizeBytes: file.size,
        fileType: file.type || 'application/octet-stream',
        targetRole: targetRole.trim() || undefined,
        endpointUsed: activeUrl,
        submittedAt: new Date().toISOString(),
        status: 'success',
        statusCode: response.status,
        responsePayload: responseText.slice(0, 500),
      };

      onSubmitSuccess(newRecord);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError({
        message: err.message || 'Failed to submit resume to n8n webhook. Please check your network and endpoint.',
        isTestTriggerWaiting: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Test Fillers Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Quick Test Profiles
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Click to auto-populate fields and generate a test resume file
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_PROFILES.map((profile, idx) => (
            <button
              key={profile.email}
              type="button"
              onClick={() => loadSampleProfile(idx)}
              className="text-left p-3 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between group min-h-[64px]"
            >
              <div className="font-medium text-xs text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                <span>{profile.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-1">
                {profile.role}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Form Card */}
      <form onSubmit={handleSubmit} noValidate className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Form header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-b from-slate-50/50 to-white">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Candidate Resume Submission
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Data is delivered directly to your n8n workflow for automated extraction and evaluation
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0">
            <span className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-700">
              POST · multipart/form-data
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidate Name & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="field-0" className="block text-xs font-semibold text-slate-700">
                Candidate Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="field-0"
                  name="field-0"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSubmitError(null);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                  placeholder="e.g. Alex Chen"
                  className={`w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                    touched.name && !name.trim()
                      ? 'border-rose-300 focus:ring-rose-500 text-rose-900'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900'
                  }`}
                />
              </div>
              {touched.name && !name.trim() && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Candidate name is required
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="field-1" className="block text-xs font-semibold text-slate-700">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="field-1"
                  name="field-1"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubmitError(null);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  placeholder="e.g. alex.chen@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                    touched.email && !isEmailValid(email)
                      ? 'border-rose-300 focus:ring-rose-500 text-rose-900'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900'
                  }`}
                />
              </div>
              {touched.email && !isEmailValid(email) && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Please enter a valid email address
                </p>
              )}
            </div>
          </div>

          {/* Target Role (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="target-role" className="block text-xs font-semibold text-slate-700">
                Target Role / Discipline
              </label>
              <span className="text-[11px] text-slate-400">Optional context</span>
            </div>
            <input
              id="target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Machine Learning Engineer, Technical Lead"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 min-h-[44px]"
            />
          </div>

          {/* Resume Upload File Drop Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="field-2" className="block text-xs font-semibold text-slate-700">
                Upload Resume Document (field-2) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Accepts PDF, DOCX, TXT, RTF (Max 25 MB)
              </span>
            </div>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging 
                    ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]' 
                    : touched.file && !file
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="field-2"
                  name="field-2"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Click to browse or drop resume here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports high-resolution PDF, Word documents, and text CVs
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                  <span>PDF</span>
                  <span aria-hidden="true">·</span>
                  <span>DOCX</span>
                  <span aria-hidden="true">·</span>
                  <span>TXT</span>
                  <span aria-hidden="true">·</span>
                  <span>Up to 25 MB</span>
                </div>
              </div>
            ) : (
              /* Selected File Card */
              <div className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatBytes(file.size)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{file.type || 'Plain Document'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors min-h-[36px]"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    aria-label="Remove uploaded file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {touched.file && !file && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> Please upload a resume file to analyze
              </p>
            )}
          </div>

          {/* Preflight Document Analysis */}
          {file && analysis && (
            <PreflightCheckCard
              analysis={analysis}
              fileName={file.name}
              fileSizeBytes={file.size}
            />
          )}

          {/* Error Banner with helpful action if in test mode */}
          {submitError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-rose-900">Submission Issue</h4>
                  <p className="text-xs text-rose-700 mt-0.5">{submitError.message}</p>
                </div>
              </div>

              {submitError.isTestTriggerWaiting && (
                <div className="pt-2 border-t border-rose-200 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onSwitchToProd}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 min-h-[36px]"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Switch to Live Production URL & Retry</span>
                  </button>
                  <span className="text-[11px] text-rose-800">
                    Production mode does not require n8n workflow editor to be actively listening.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Actions Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Target: <code className="font-mono text-slate-700 truncate max-w-[260px] inline-block align-bottom">{endpointConfig.url}</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Transmitting to n8n...</span>
              </>
            ) : (
              <>
                <span>Submit to Resume Analyser</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
