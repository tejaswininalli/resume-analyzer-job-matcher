export type EndpointMode = 'production' | 'test' | 'custom';

export interface EndpointConfig {
  mode: EndpointMode;
  url: string;
  customUrl: string;
  defaultProdUrl: string;
  defaultTestUrl: string;
}

export interface SubmissionRecord {
  id: string;
  candidateName: string;
  candidateEmail: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: string;
  targetRole?: string;
  endpointUsed: string;
  submittedAt: string;
  status: 'success' | 'warning' | 'error';
  statusCode: number;
  responsePayload?: string;
}

export interface PreflightAnalysis {
  wordCount: number;
  hasEmail: boolean;
  hasPhone: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  atsScore: number;
  recommendations: string[];
}
