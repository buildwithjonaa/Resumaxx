import type { PresetProfile } from '../types';

export const PRESET_PROFILES: PresetProfile[] = [
  // TECH
  {
    id: 'staff-eng',
    name: 'Staff Software Engineer',
    industry: 'Tech',
    targetRole: 'Staff Software Engineer, Core Platform',
    company: 'Stripe',
    matchScoreBaseline: 64,
    defaultResume: `SENIOR SOFTWARE ENGINEER
Alex Rivera | alex.rivera@engineering-pro.io | San Francisco, CA

EXPERIENCE
Lead Full-Stack Engineer | Apex Systems (2022 - Present)
- Worked on microservices migration to modern cloud architecture.
- Responsible for API endpoint optimizations and database query tuning.`,

    defaultJobDescription: `STAFF SOFTWARE ENGINEER, CORE PLATFORM ARCHITECTURE - STRIPE

Core Requirements:
- 8+ years of software engineering experience in distributed systems.
- Deep expertise with Kubernetes, Terraform, and Infrastructure-as-Code (IaC).
- System Architecture mastery, event-driven streaming (Kafka), and PostgreSQL clustering.`,

    missingKeywords: [
      { id: 'kw-eng-1', word: 'Kubernetes', category: 'Cloud & Infra', added: false },
      { id: 'kw-eng-2', word: 'GraphQL', category: 'System Architecture', added: false },
      { id: 'kw-eng-3', word: 'System Architecture', category: 'System Architecture', added: false },
      { id: 'kw-eng-4', word: 'CI/CD Pipelines', category: 'Compliance & Strategy', added: false }
    ],

    fluffDictionary: [
      {
        word: 'results-driven',
        category: 'Overused Buzzword',
        impact: 'High',
        explanation: 'Generic claim without quantitative metrics.',
        suggestedMetricSwap: 'Engineered high-throughput payments engine reducing checkout drop-off by 14.2% across 2.4M monthly sessions.'
      }
    ],

    starQuestions: [
      {
        id: 'q-eng-1',
        question: 'Describe a scenario where a core distributed system experienced a cascading failure in production under SLA pressure. How did you isolate root cause?',
        gapContext: 'Target job demands high-availability System Architecture & Chaos Engineering experience.',
        difficulty: 'Staff',
        situationKeywords: ['when', 'during', 'outage', 'production', 'failure', 'stripe'],
        taskKeywords: ['responsible for', 'my role', 'my goal', 'needed to'],
        actionKeywords: ['isolated', 'debugged', 'configured', 'implemented'],
        resultKeywords: ['restored', '%', 'ms', 'uptime', 'reduced']
      }
    ]
  },
  {
    id: 'lead-pm',
    name: 'Lead Product Manager',
    industry: 'Tech',
    targetRole: 'Lead Product Manager, Growth & Core Ops',
    company: 'Linear',
    matchScoreBaseline: 58,
    defaultResume: `LEAD PRODUCT MANAGER
Jordan Taylor | jordan.t@pm-exec.com | San Francisco, CA

EXPERIENCE
Product Manager | TechFlow Inc (2021 - Present)
- Dynamic execution of product roadmaps for enterprise SaaS applications.`,

    defaultJobDescription: `LEAD PRODUCT MANAGER, GROWTH & CORE OPS - LINEAR

Core Requirements:
- 6+ years managing B2B SaaS products with deep quantitative Product Analytics (Amplitude / Mixpanel).
- Mastery of PLG Funnel Optimization, customer retention cohort modeling, and Net Revenue Retention (NRR).`,

    missingKeywords: [
      { id: 'kw-pm-1', word: 'Product Analytics', category: 'Tools & Analytics', added: false },
      { id: 'kw-pm-2', word: 'PLG Funnel Optimization', category: 'Domain Expertise', added: false }
    ],

    fluffDictionary: [
      {
        word: 'dynamic execution',
        category: 'Vague Claim',
        impact: 'Medium',
        explanation: 'Vague descriptor.',
        suggestedMetricSwap: 'Grew product ARR from $4.2M to $9.8M while maintaining 128% Net Revenue Retention (NRR).'
      }
    ],

    starQuestions: [
      {
        id: 'q-pm-1',
        question: 'Walk me through a product decision where quantitative analytics directly conflicted with qualitative user feedback during a PLG funnel rollout.',
        gapContext: 'Linear requires deep product analytics and data-driven PLG decision frameworks.',
        difficulty: 'Staff',
        situationKeywords: ['when', 'during', 'launch', 'funnel', 'plg'],
        taskKeywords: ['needed to', 'my job', 'objective'],
        actionKeywords: ['analyzed', 'interviewed', 'hypothesized'],
        resultKeywords: ['increased', '%', 'nrr', 'retention']
      }
    ]
  },
  {
    id: 'frontend-architect',
    name: 'Senior Principal Engineer',
    industry: 'Tech',
    targetRole: 'Senior Principal Engineer, Web & DX',
    company: 'Vercel',
    matchScoreBaseline: 62,
    defaultResume: `FRONTEND DEVELOPER
Morgan Lee | morgan.l@frontend.dev | Seattle, WA`,

    defaultJobDescription: `SENIOR PRINCIPAL ENGINEER, WEB & DX - VERCEL

Core Requirements:
- Deep expertise in Next.js App Router, React Server Components (RSC), Edge Computing, and Web Vitals.`,

    missingKeywords: [
      { id: 'kw-v1', word: 'Next.js App Router', category: 'Hard Skill', added: false },
      { id: 'kw-v2', word: 'Web Vitals', category: 'Tools & Analytics', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },
  {
    id: 'ai-infra',
    name: 'AI Platform Systems Engineer',
    industry: 'Tech',
    targetRole: 'AI Platform Systems Engineer',
    company: 'OpenAI',
    matchScoreBaseline: 55,
    defaultResume: `SOFTWARE ENGINEER
Sam Chen | sam.chen@ai-dev.net | San Francisco, CA`,

    defaultJobDescription: `AI PLATFORM SYSTEMS ENGINEER - OPENAI

Core Requirements:
- Deep hands-on experience scaling LLM Inference Pipelines, CUDA kernels, and PyTorch model distributed training.`,

    missingKeywords: [
      { id: 'kw-ai-1', word: 'LLM Inference', category: 'System Architecture', added: false },
      { id: 'kw-ai-2', word: 'CUDA', category: 'Cloud & Infra', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },

  // FINANCE & CONSULTING
  {
    id: 'finance-analyst',
    name: 'Senior Investment Analyst',
    industry: 'Finance',
    targetRole: 'Senior Financial & Investment Analyst',
    company: 'Goldman Sachs',
    matchScoreBaseline: 60,
    defaultResume: `FINANCIAL ANALYST
Taylor Vance | taylor.vance@finance-pro.com | New York, NY`,

    defaultJobDescription: `SENIOR INVESTMENT ANALYST - GOLDMAN SACHS

Core Requirements:
- 5+ years in Investment Banking or Private Equity valuation. DCF Modeling, LBO Modeling, and M&A frameworks.`,

    missingKeywords: [
      { id: 'kw-fin-1', word: 'DCF Modeling', category: 'Domain Expertise', added: false },
      { id: 'kw-fin-2', word: 'Bloomberg Terminal', category: 'Tools & Analytics', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },
  {
    id: 'consulting-lead',
    name: 'Engagement Manager',
    industry: 'Finance',
    targetRole: 'Management Consultant & Engagement Manager',
    company: 'McKinsey & Company',
    matchScoreBaseline: 61,
    defaultResume: `BUSINESS ANALYST
Rachel Green | rachel.g@consulting-exec.com | Chicago, IL`,

    defaultJobDescription: `ENGAGEMENT MANAGER - MCKINSEY & COMPANY

Core Requirements:
- Corporate Strategy, Mergers & Acquisitions, Restructuring, Executive Stakeholder Management, and Financial Advisory.`,

    missingKeywords: [
      { id: 'kw-mck-1', word: 'Corporate Strategy', category: 'Compliance & Strategy', added: false },
      { id: 'kw-mck-2', word: 'Executive Stakeholder Management', category: 'Leadership & Ops', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },

  // HEALTHCARE & BIOTECH
  {
    id: 'healthcare-ops',
    name: 'Clinical Operations Director',
    industry: 'Healthcare',
    targetRole: 'Clinical Operations & Quality Director',
    company: 'Pfizer',
    matchScoreBaseline: 58,
    defaultResume: `HEALTHCARE COORDINATOR
Jordan Miller | j.miller@health-exec.org | Boston, MA`,

    defaultJobDescription: `CLINICAL OPERATIONS DIRECTOR - PFIZER

Core Requirements:
- Clinical trial operations, GCP (Good Clinical Practice), FDA Regulatory Compliance, and IRB Approvals.`,

    missingKeywords: [
      { id: 'kw-hc-1', word: 'GCP Guidelines', category: 'Compliance & Strategy', added: false },
      { id: 'kw-hc-2', word: 'FDA Regulatory Compliance', category: 'Compliance & Strategy', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },

  // MARKETING & RETAIL
  {
    id: 'marketing-director',
    name: 'Global Brand Marketing Director',
    industry: 'Marketing',
    targetRole: 'Director of Global Brand Strategy & Growth',
    company: 'Nike',
    matchScoreBaseline: 62,
    defaultResume: `MARKETING MANAGER
Samira Patel | s.patel@brand-growth.io | Los Angeles, CA`,

    defaultJobDescription: `GLOBAL BRAND MARKETING DIRECTOR - NIKE

Core Requirements:
- Integrated brand marketing campaigns, Multi-Channel Attribution, Omnichannel Retail Strategy, CAC & LTV Optimization.`,

    missingKeywords: [
      { id: 'kw-mkt-1', word: 'Multi-Channel Attribution', category: 'Tools & Analytics', added: false },
      { id: 'kw-mkt-2', word: 'CAC & LTV Optimization', category: 'Domain Expertise', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },

  // OPERATIONS & AUTOMOTIVE / LOGISTICS
  {
    id: 'supply-chain-lead',
    name: 'Senior Supply Chain Director',
    industry: 'Operations',
    targetRole: 'Senior Operations & Supply Chain Director',
    company: 'Amazon',
    matchScoreBaseline: 61,
    defaultResume: `OPERATIONS SUPERVISOR
Chris Bennett | c.bennett@ops-logistics.com | Chicago, IL`,

    defaultJobDescription: `SENIOR SUPPLY CHAIN DIRECTOR - AMAZON LOGISTICS

Core Requirements:
- Fulfillment networks, Six Sigma Lean Manufacturing, Last-Mile Delivery Optimization, and SAP ERP.`,

    missingKeywords: [
      { id: 'kw-ops-1', word: 'Six Sigma', category: 'Compliance & Strategy', added: false },
      { id: 'kw-ops-2', word: 'Last-Mile Delivery', category: 'Leadership & Ops', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },
  {
    id: 'automotive-lead',
    name: 'Staff Autopilot Engineering Lead',
    industry: 'Operations',
    targetRole: 'Staff Autopilot & Robotics Systems Lead',
    company: 'Tesla',
    matchScoreBaseline: 63,
    defaultResume: `ROBOTICS ENGINEER
David Kim | d.kim@automotive-eng.com | Austin, TX`,

    defaultJobDescription: `STAFF AUTOPILOT & ROBOTICS SYSTEMS LEAD - TESLA

Core Requirements:
- Autonomous Vehicle Systems, Computer Vision, Embedded C++, Real-Time Operating Systems (RTOS), and Control Theory.`,

    missingKeywords: [
      { id: 'kw-tes-1', word: 'Embedded C++', category: 'Hard Skill', added: false },
      { id: 'kw-tes-2', word: 'Computer Vision', category: 'Domain Expertise', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  },

  // HR & HRBP
  {
    id: 'hrbp-lead',
    name: 'Senior HR Business Partner',
    industry: 'HR',
    targetRole: 'Senior HR Business Partner (HRBP)',
    company: 'Salesforce',
    matchScoreBaseline: 63,
    defaultResume: `HR GENERALIST
Devon Ross | devon.ross@people-ops.net | Austin, TX`,

    defaultJobDescription: `SENIOR HR BUSINESS PARTNER (HRBP) - SALESFORCE

Core Requirements:
- Executive leadership coaching, Organizational Design, Workforce Planning, Change Management, and Talent Analytics.`,

    missingKeywords: [
      { id: 'kw-hr-1', word: 'Organizational Design', category: 'Leadership & Ops', added: false },
      { id: 'kw-hr-2', word: 'Workforce Planning', category: 'Compliance & Strategy', added: false }
    ],

    fluffDictionary: [],
    starQuestions: []
  }
];
