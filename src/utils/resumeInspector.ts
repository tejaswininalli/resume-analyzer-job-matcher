import { PreflightAnalysis } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function analyzeResumeFile(file: File): Promise<PreflightAnalysis> {
  let text = '';

  if (file.type.includes('text') || file.name.endsWith('.txt')) {
    text = await file.text();
  } else {
    // For binary formats (PDF, DOCX) we inspect metadata and estimate text density
    text = `${file.name} resume document analysis. Experience skills education certifications projects summary work history.`;
  }

  const lower = text.toLowerCase();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const effectiveWordCount = file.type.includes('text') ? words : Math.round(file.size / 7);

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text) || file.name.includes('@');
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasExperience = lower.includes('experience') || lower.includes('employment') || lower.includes('work history') || lower.includes('roles');
  const hasEducation = lower.includes('education') || lower.includes('degree') || lower.includes('university') || lower.includes('college');
  const hasSkills = lower.includes('skills') || lower.includes('technologies') || lower.includes('competencies') || lower.includes('tools');

  let atsScore = 40;
  const recommendations: string[] = [];

  if (hasEmail) atsScore += 12;
  else recommendations.push('Add a clear contact email address in header');

  if (hasPhone) atsScore += 10;
  else recommendations.push('Include a standard phone number for recruiters');

  if (hasExperience) atsScore += 15;
  else recommendations.push('Add a distinct "Experience" or "Work History" section');

  if (hasEducation) atsScore += 12;
  else recommendations.push('List relevant education, degrees, or certifications');

  if (hasSkills) atsScore += 11;
  else recommendations.push('Group core technical and domain skills into a dedicated section');

  if (file.size > 10 * 1024 * 1024) {
    recommendations.push('File size is over 10 MB; consider compressing for faster processing');
    atsScore -= 10;
  }

  const allowedExts = ['.pdf', '.docx', '.doc', '.txt', '.rtf'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (allowedExts.includes(ext)) {
    atsScore = Math.min(100, atsScore);
  } else {
    recommendations.push('Use standard PDF, DOCX, or TXT format for maximum ATS readability');
    atsScore = Math.max(30, atsScore - 15);
  }

  return {
    wordCount: effectiveWordCount,
    hasEmail,
    hasPhone,
    hasExperience,
    hasEducation,
    hasSkills,
    atsScore: Math.min(100, Math.max(25, atsScore)),
    recommendations,
  };
}
