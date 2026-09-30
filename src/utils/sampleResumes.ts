export interface SampleProfile {
  name: string;
  email: string;
  role: string;
  filename: string;
  content: string;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    name: 'Tejaswini Nalli',
    email: 'tejaswininalli@gmail.com',
    role: 'Senior Automation & AI Solutions Engineer',
    filename: 'Tejaswini_Nalli_Resume.txt',
    content: `TEJASWINI NALLI
Email: tejaswininalli@gmail.com | Phone: +1 (555) 382-9104 | Location: San Francisco, CA
LinkedIn: linkedin.com/in/tejaswininalli | GitHub: github.com/tejaswini-nalli

SUMMARY
Dynamic Software Engineer and Automation Architect with 6+ years of expertise in workflow automation, n8n orchestration, AI agent pipelines, and full-stack cloud applications. Proven track record designing scalable integrations, LLM document parsing engines, and mission-critical webhook services.

TECHNICAL SKILLS
- Workflow & Automation: n8n Cloud / Self-hosted, Zapier, Webhooks, REST APIs, JSON schema, Cron triggers
- Programming & Languages: TypeScript, JavaScript (ES6+), Python, Node.js, SQL, HTML5/CSS3
- AI & LLM Systems: Gemini API, LangChain, Vector Embeddings, Structured Data Extraction, Prompt Engineering
- Cloud & DevOps: Docker, Google Cloud Run, AWS (Lambda, S3), Git, CI/CD pipelines, Express

EXPERIENCE
Lead Automation Engineer | CloudScale Tech (2022 - Present)
- Designed and maintained 40+ production n8n workflows processing over 250,000 document events monthly with 99.98% uptime.
- Built automated AI resume parsing pipeline reducing candidate screening time by 72% for engineering recruitment.
- Engineered resilient webhook error-handling topologies with dead-letter queue recovery and automated Slack/Email alerts.

Senior Full Stack Engineer | Apex Systems (2019 - 2022)
- Built responsive customer portals using React, TypeScript, Tailwind CSS, and RESTful microservices.
- Integrated third-party OAuth, CRM webhooks, and secure multipart file processing pipelines.
- Mentored junior engineers in defensive API design and clean code standards.

EDUCATION
B.S. in Computer Science & Engineering | University of Technology (2015 - 2019)
- Honors in Distributed Systems and Cloud Computing

CERTIFICATIONS
- Certified n8n Workflow Automation Expert (2024)
- Google Cloud Certified Associate Cloud Engineer (2023)`
  },
  {
    name: 'Alex Chen',
    email: 'alex.chen@innovateai.io',
    role: 'Staff Full-Stack Software Architect',
    filename: 'Alex_Chen_Staff_Architect_Resume.txt',
    content: `ALEX CHEN
Email: alex.chen@innovateai.io | Phone: +1 (415) 890-1234 | San Jose, CA
Portfolio: https://alexchen.dev | GitHub: https://github.com/alexchen-dev

PROFESSIONAL SUMMARY
Senior Full Stack Architect with 9+ years building distributed cloud applications, responsive web applications, and event-driven architectures. Expert in React 19, TypeScript, Node.js, micro-frontends, and automated cloud pipelines.

CORE COMPETENCIES
- Frontend: React, Next.js, TypeScript, Tailwind CSS, HTML5, Web Components, Accessibility (WCAG AA)
- Backend & Cloud: Node.js, Express, Go, PostgreSQL, Redis, n8n, Google Cloud, AWS
- Architecture: Serverless, Event-Driven Webhooks, REST, GraphQL, Microservices

PROFESSIONAL EXPERIENCE
Staff Software Architect | DataMatrix Labs (2021 - Present)
- Architected enterprise document intelligence platform processing 1M+ PDF uploads per month.
- Reduced p99 API response latencies by 45% through Redis caching and non-blocking asynchronous workers.
- Led migration of legacy monolithic frontends to modern, mobile-first responsive architecture.

Senior Software Engineer | CloudVenture Systems (2017 - 2021)
- Developed responsive dashboards used by 50,000+ daily active enterprise users.
- Implemented file processing pipelines with client-side hashing, chunked uploads, and automated format validation.

EDUCATION
Master of Science in Computer Science | Stanford University (2015 - 2017)
Bachelor of Science in Software Engineering | UC Berkeley (2011 - 2015)`
  },
  {
    name: 'Sarah Miller',
    email: 'sarah.miller@productpulse.org',
    role: 'Principal Technical Product Manager',
    filename: 'Sarah_Miller_Product_Lead.txt',
    content: `SARAH MILLER
Email: sarah.miller@productpulse.org | Phone: +1 (206) 450-8912 | Seattle, WA
LinkedIn: linkedin.com/in/sarah-miller-pm

EXECUTIVE SUMMARY
Strategic Product Leader with 8+ years driving AI/ML automation tools, enterprise SaaS platforms, and developer API ecosystems. Passionate about converting complex workflow tools into seamless, intuitive user experiences.

EXPERIENCE
Principal Product Manager | WorkflowHQ (2022 - Present)
- Spearheaded product vision for automated workflow triggers and form webhooks, resulting in 140% YoY user expansion.
- Partnered with enterprise engineering to design real-time data ingestion pipelines and resume classification models.
- Increased mobile portal submission conversion rate from 54% to 88% through responsive UX redesign.

Senior Technical Product Manager | DevCore Technologies (2018 - 2022)
- Directed cross-functional team of 14 engineers delivering candidate evaluation and ATS integration tools.
- Defined product requirements for document extraction APIs, reducing candidate drop-off by 35%.

EDUCATION & CREDENTIALS
MBA, Technology & Innovation | University of Washington Foster School of Business (2016 - 2018)
B.A. in Cognitive Science & Information Systems | UC San Diego (2012 - 2016)
Scrum Alliance Certified Product Owner (CSPO)`
  }
];

export function createSampleResumeFile(profile: SampleProfile): File {
  const blob = new Blob([profile.content], { type: 'text/plain;charset=utf-8' });
  return new File([blob], profile.filename, { type: 'text/plain' });
}
