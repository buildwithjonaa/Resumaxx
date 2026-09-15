import type { PresetProfile } from '../types';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildPrompt(role: string, company: string): string {
  return `You are an expert ATS resume analyst and job requirements specialist.
Generate a realistic, detailed job profile for the following position:
Role: "${role}"
Company: "${company}"

Return ONLY a single valid JSON object with NO markdown, NO code fences, NO explanation. Just raw JSON.

The JSON must match this exact structure:
{
  "targetRole": "normalized professional job title",
  "company": "company name",
  "industry": "primary industry (e.g. Technology, Finance, Healthcare, Marketing, Operations, HR, Consulting, Beauty & Care, Arts & Culture, Hospitality, Education, Services)",
  "matchScoreBaseline": 58,
  "defaultJobDescription": "A 350-450 word realistic job posting. Include: role overview, 5-7 key responsibilities, required qualifications (years of experience, specific skills/tools/certifications), preferred qualifications, and a brief description. Make it specific to the actual role and company.",
  "missingKeywords": [
    {"id": "kw1", "word": "specific skill, tool, certification, or domain concept", "category": "Technical Skills", "added": false}
  ],
  "fluffDictionary": [
    {"word": "weak phrase found in typical resumes for this role", "category": "Corporate Jargon", "impact": "High", "explanation": "brief explanation of why this weakens ATS authority scoring", "suggestedMetricSwap": "a specific quantified replacement phrase with numbers/percentages/timelines"}
  ],
  "starQuestions": [
    {
      "id": "q1",
      "question": "Tell me about a time when... (full behavioral interview question targeting a common skill gap for this role)",
      "gapContext": "This was flagged because... (1-2 sentences explaining why this gap matters for the role)",
      "difficulty": "Lead",
      "situationKeywords": ["contextual", "words", "that", "signal", "situation"],
      "taskKeywords": ["objective", "goal", "responsible", "tasked"],
      "actionKeywords": ["implemented", "designed", "built", "led"],
      "resultKeywords": ["reduced", "increased", "improved", "percent", "million"]
    }
  ]
}

STRICT REQUIREMENTS:
- missingKeywords: generate exactly 12-15 items. Each "category" MUST be one of: "Technical Skills", "Tools & Platforms", "Leadership & Strategy", "Domain Knowledge", "Safety & Compliance", "Client & Customer Care", "Product & Design"
- matchScoreBaseline: integer between 50 and 70.
- fluffDictionary: generate exactly 4-6 items. Each "category" MUST be one of: "Vague Claim", "Corporate Jargon", "Overused Buzzword", "Passive Voice". Each "impact" MUST be one of: "High", "Medium", "Low".
- starQuestions: generate exactly 2-3 items. Each "difficulty" MUST be one of: "Staff", "Lead", "Executive".
- defaultJobDescription MUST be realistic and specific to the actual role/company combination. Do NOT use generic placeholder text.
- Return ONLY the JSON. No other text whatsoever.`;
}

/**
 * Smart Fallback Profile Generator
 * Generates tailored domain requirements for ANY role title (Hairdresser, Curator, Architect, Barista, etc.)
 * when Gemini API key is missing or offline.
 */
export function createFallbackJobProfile(role: string, company: string): PresetProfile {
  const r = role.trim();
  const c = company.trim() || 'General Employer';
  const roleLower = r.toLowerCase();
  

  let industry = 'General Services';
  let keywords: { id: string; word: string; category: string; added: boolean }[] = [];
  

  // Domain categorization & dynamic keyword extraction
  if (roleLower.includes('hair') || roleLower.includes('barber') || roleLower.includes('stylist') || roleLower.includes('salon') || roleLower.includes('beauty') || roleLower.includes('cosmetolog')) {
    industry = 'Beauty & Care';
    keywords = [
      { id: 'kw-h1', word: 'Hair Coloring & Highlight Techniques', category: 'Technical Skills', added: false },
      { id: 'kw-h2', word: 'Client Consultation & Hair Analysis', category: 'Client & Customer Care', added: false },
      { id: 'kw-h3', word: 'Sanitation & Safety Standards (State Board)', category: 'Safety & Compliance', added: false },
      { id: 'kw-h4', word: 'Precision Shears & Razor Cutting', category: 'Technical Skills', added: false },
      { id: 'kw-h5', word: 'Salon Management & Appointment Scheduling', category: 'Domain Knowledge', added: false },
      { id: 'kw-h6', word: 'Retail Product Upselling (Shampoo/Treatments)', category: 'Client & Customer Care', added: false },
      { id: 'kw-h7', word: 'Chemical Treatment & Keratin Processing', category: 'Technical Skills', added: false },
      { id: 'kw-h8', word: 'Balayage & Ombre Color Design', category: 'Product & Design', added: false },
      { id: 'kw-h9', word: 'Scalp Treatment & Conditioning Protocols', category: 'Technical Skills', added: false },
      { id: 'kw-h10', word: 'Client Retention & Relationship Building', category: 'Leadership & Strategy', added: false }
    ];
  } else if (roleLower.includes('curator') || roleLower.includes('museum') || roleLower.includes('gallery') || roleLower.includes('art') || roleLower.includes('archivist')) {
    industry = 'Arts & Culture';
    keywords = [
      { id: 'kw-c1', word: 'Exhibition Design & Curation', category: 'Product & Design', added: false },
      { id: 'kw-c2', word: 'Artifact Conservation & Preservation', category: 'Domain Knowledge', added: false },
      { id: 'kw-c3', word: 'Provenance Research & Cataloging', category: 'Domain Knowledge', added: false },
      { id: 'kw-c4', word: 'Grant Writing & Donor Relations', category: 'Leadership & Strategy', added: false },
      { id: 'kw-c5', word: 'Archival Management Systems', category: 'Tools & Platforms', added: false },
      { id: 'kw-c6', word: 'Educational Programming & Public Outreach', category: 'Client & Customer Care', added: false },
      { id: 'kw-c7', word: 'Collection Acquisition Strategy', category: 'Leadership & Strategy', added: false },
      { id: 'kw-c8', word: 'Museum Ethics & Cultural Property Law', category: 'Safety & Compliance', added: false }
    ];
  } else if (roleLower.includes('architect') || roleLower.includes('interior') || roleLower.includes('urban') || roleLower.includes('cad') || roleLower.includes('building')) {
    industry = 'Architecture & Construction';
    keywords = [
      { id: 'kw-a1', word: 'AutoCAD & Revit BIM Modeling', category: 'Tools & Platforms', added: false },
      { id: 'kw-a2', word: 'Building Code & Zoning Compliance', category: 'Safety & Compliance', added: false },
      { id: 'kw-a3', word: 'Schematic Design & Drafting', category: 'Product & Design', added: false },
      { id: 'kw-a4', word: 'Structural Feasibility & Engineering Drafts', category: 'Technical Skills', added: false },
      { id: 'kw-a5', word: 'Sustainable Design (LEED Certification)', category: 'Domain Knowledge', added: false },
      { id: 'kw-a6', word: 'Client Site Inspection & Permitting', category: 'Leadership & Strategy', added: false },
      { id: 'kw-a7', word: 'Construction Document Administration', category: 'Domain Knowledge', added: false }
    ];
  } else if (roleLower.includes('wedding') || roleLower.includes('event') || roleLower.includes('planner') || roleLower.includes('coordinator')) {
    industry = 'Event Planning & Hospitality';
    keywords = [
      { id: 'kw-w1', word: 'Vendor Sourcing & Contract Negotiation', category: 'Leadership & Strategy', added: false },
      { id: 'kw-w2', word: 'Day-of Event Execution & Timeline Management', category: 'Domain Knowledge', added: false },
      { id: 'kw-w3', word: 'Budget Tracking & Expense Control', category: 'Domain Knowledge', added: false },
      { id: 'kw-w4', word: 'Spatial Layout & Floral/Decor Design', category: 'Product & Design', added: false },
      { id: 'kw-w5', word: 'Client Consultation & Vision Alignment', category: 'Client & Customer Care', added: false },
      { id: 'kw-w6', word: 'Contingency Planning & Crisis Management', category: 'Safety & Compliance', added: false }
    ];
  } else if (roleLower.includes('marine') || roleLower.includes('bio') || roleLower.includes('scientist') || roleLower.includes('researcher') || roleLower.includes('ecologist')) {
    industry = 'Scientific Research & Ecology';
    keywords = [
      { id: 'kw-m1', word: 'Field Data Collection & Sampling', category: 'Technical Skills', added: false },
      { id: 'kw-m2', word: 'Statistical Analysis (R / Python)', category: 'Tools & Platforms', added: false },
      { id: 'kw-m3', word: 'Environmental Impact Assessment', category: 'Safety & Compliance', added: false },
      { id: 'kw-m4', word: 'Peer-Reviewed Scientific Publication', category: 'Domain Knowledge', added: false },
      { id: 'kw-m5', word: 'Oceanographic Survey Equipment', category: 'Tools & Platforms', added: false },
      { id: 'kw-m6', word: 'Biodiversity Monitoring & Conservation', category: 'Domain Knowledge', added: false }
    ];
  } else if (roleLower.includes('barista') || roleLower.includes('coffee') || roleLower.includes('cafe') || roleLower.includes('bartender')) {
    industry = 'Food & Beverage';
    keywords = [
      { id: 'kw-b1', word: 'Espresso Extraction & Grinder Calibration', category: 'Technical Skills', added: false },
      { id: 'kw-b2', word: 'Latte Art & Milk Microfoaming', category: 'Product & Design', added: false },
      { id: 'kw-b3', word: 'Food Safety & Hygiene Regulations (HACCP)', category: 'Safety & Compliance', added: false },
      { id: 'kw-b4', word: 'POS Cashier Operation & Order Accuracy', category: 'Tools & Platforms', added: false },
      { id: 'kw-b5', word: 'Customer Relationship & Hospitality', category: 'Client & Customer Care', added: false },
      { id: 'kw-b6', word: 'Coffee Bean Origin & Flavor Profiling', category: 'Domain Knowledge', added: false }
    ];
  } else if (roleLower.includes('ux') || roleLower.includes('product designer') || roleLower.includes('user research')) {
    industry = 'Design & Tech';
    keywords = [
      { id: 'kw-ux1', word: 'Usability Testing & User Interviews', category: 'Domain Knowledge', added: false },
      { id: 'kw-ux2', word: 'Figma Wireframing & Prototyping', category: 'Tools & Platforms', added: false },
      { id: 'kw-ux3', word: 'Information Architecture & Journey Mapping', category: 'Product & Design', added: false },
      { id: 'kw-ux4', word: 'Design Systems & UI Component Libraries', category: 'Technical Skills', added: false },
      { id: 'kw-ux5', word: 'Accessibility (WCAG) Compliance', category: 'Safety & Compliance', added: false },
      { id: 'kw-ux6', word: 'Quantitative Analytics (Amplitude / Heap)', category: 'Tools & Platforms', added: false }
    ];
  } else {
    // General universal role generator
    industry = roleLower.includes('tech') || roleLower.includes('engineer') || roleLower.includes('developer') ? 'Technology' :
               roleLower.includes('finance') || roleLower.includes('accountant') ? 'Finance' :
               roleLower.includes('health') || roleLower.includes('doctor') || roleLower.includes('nurse') ? 'Healthcare' : 'Professional Services';

    keywords = [
      { id: 'kw-gen1', word: `Core ${r} Practice Standards`, category: 'Domain Knowledge', added: false },
      { id: 'kw-gen2', word: 'Client & Stakeholder Communication', category: 'Client & Customer Care', added: false },
      { id: 'kw-gen3', word: 'Quality Control & Standards Compliance', category: 'Safety & Compliance', added: false },
      { id: 'kw-gen4', word: 'Time Management & Project Prioritization', category: 'Leadership & Strategy', added: false },
      { id: 'kw-gen5', word: 'Problem Solving & Troubleshooting', category: 'Technical Skills', added: false },
      { id: 'kw-gen6', word: 'Workflow Efficiency Optimization', category: 'Domain Knowledge', added: false },
      { id: 'kw-gen7', word: 'Tool & Equipment Proficiency', category: 'Tools & Platforms', added: false },
      { id: 'kw-gen8', word: 'Service Operations & Reporting', category: 'Leadership & Strategy', added: false }
    ];
  }

  const defaultJobDescription = `${r.toUpperCase()} - ${c.toUpperCase()}

Position Summary:
We are seeking a dedicated, skilled ${r} to join our team at ${c}. In this role, you will be responsible for executing high-quality ${r} services, maintaining professional standards, and ensuring outstanding satisfaction for our clients and stakeholders.

Key Responsibilities:
- Execute core ${r} duties with high attention to detail and professional excellence.
- Consult with clients/partners to understand specific requirements and deliver tailored solutions.
- Maintain workspace safety, cleanliness, equipment calibration, and industry compliance.
- Track key performance metrics, manage inventory/resources, and streamline operational workflows.
- Stay updated with latest industry trends, techniques, and best practices.

Requirements & Qualifications:
- Proven experience working as a ${r} or in a directly related role.
- Relevant trade certification, license, degree, or professional training.
- Excellent interpersonal skills and dedication to customer/client satisfaction.
- Strong problem-solving skills, reliability, and work ethic.`;

  const fluffDictionary = [
    {
      word: 'hardworking',
      category: 'Overused Buzzword' as const,
      impact: 'High' as const,
      explanation: 'Generic descriptor that lacks quantifiable metrics.',
      suggestedMetricSwap: `Maintained a 98.4% client satisfaction rating across 450+ completed ${r} sessions.`
    },
    {
      word: 'great communicator',
      category: 'Vague Claim' as const,
      impact: 'Medium' as const,
      explanation: 'Vague claim without demonstrating stakeholder outcome.',
      suggestedMetricSwap: 'Managed daily consultation workflow, resulting in a 25% increase in repeat client retention.'
    },
    {
      word: 'detail-oriented',
      category: 'Corporate Jargon' as const,
      impact: 'High' as const,
      explanation: 'Weak qualifier; replace with specific quality assurance metrics.',
      suggestedMetricSwap: 'Achieved zero compliance infractions over 2+ years of high-volume service delivery.'
    }
  ];

  const starQuestions = [
    {
      id: 'q-star-1',
      question: `Describe a situation where a client or project presented unexpected challenges or specific demands. How did you adapt your ${r} approach to deliver a successful result?`,
      gapContext: `Measures problem-solving and client adaptability essential for a ${r} at ${c}.`,
      difficulty: 'Lead' as const,
      situationKeywords: ['when', 'during', 'client', 'challenge', 'request'],
      taskKeywords: ['my goal', 'responsible for', 'needed to'],
      actionKeywords: ['adapted', 'applied', 'performed', 'resolved'],
      resultKeywords: ['achieved', 'satisfied', 'improved', '%', 'delivered']
    },
    {
      id: 'q-star-2',
      question: `Walk me through a time when you had to manage multiple competing priorities or tight schedules. How did you maintain high service quality?`,
      gapContext: `Evaluates time management and standard enforcement under pressure.`,
      difficulty: 'Staff' as const,
      situationKeywords: ['busy', 'schedule', 'multiple', 'deadline'],
      taskKeywords: ['needed to', 'my job', 'prioritized'],
      actionKeywords: ['organized', 'executed', 'handled', 'streamlined'],
      resultKeywords: ['completed', 'on time', 'retained', 'rating']
    }
  ];

  return {
    id: `dynamic-${Date.now()}`,
    name: `${r} at ${c}`,
    isAiGenerated: true,
    targetRole: r,
    company: c,
    industry: industry,
    matchScoreBaseline: 58,
    defaultResume: '',
    defaultJobDescription: defaultJobDescription,
    missingKeywords: keywords,
    fluffDictionary: fluffDictionary,
    starQuestions: starQuestions
  };
}

export async function generateJobProfile(
  role: string,
  company: string
): Promise<PresetProfile> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return createFallbackJobProfile(role, company);
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(role, company) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      return createFallbackJobProfile(role, company);
    }

    const data = await response.json();
    const rawText: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return createFallbackJobProfile(role, company);
    }

    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return createFallbackJobProfile(role, company);
    }

    const keywords = ((parsed.missingKeywords as any[]) || []).map(
      (k: any, i: number) => ({
        id: String(k.id || `ai-kw-${i}`),
        word: String(k.word || ''),
        category: String(k.category || 'Technical Skills'),
        added: false,
        isNewFlash: false,
      })
    );

    const fluff = ((parsed.fluffDictionary as any[]) || []).map((f: any) => ({
      word: String(f.word || ''),
      category: String(f.category || 'Corporate Jargon') as any,
      impact: (['High', 'Medium', 'Low'].includes(f.impact) ? f.impact : 'Medium') as 'High' | 'Medium' | 'Low',
      explanation: String(f.explanation || ''),
      suggestedMetricSwap: String(f.suggestedMetricSwap || ''),
    }));

    const starQuestions = ((parsed.starQuestions as any[]) || []).map(
      (q: any, i: number) => ({
        id: String(q.id || `ai-q-${i}`),
        question: String(q.question || ''),
        gapContext: String(q.gapContext || ''),
        difficulty: (['Staff', 'Lead', 'Executive'].includes(q.difficulty)
          ? q.difficulty
          : 'Lead') as 'Staff' | 'Lead' | 'Executive',
        situationKeywords: Array.isArray(q.situationKeywords)
          ? q.situationKeywords.map(String)
          : [],
        taskKeywords: Array.isArray(q.taskKeywords)
          ? q.taskKeywords.map(String)
          : [],
        actionKeywords: Array.isArray(q.actionKeywords)
          ? q.actionKeywords.map(String)
          : [],
        resultKeywords: Array.isArray(q.resultKeywords)
          ? q.resultKeywords.map(String)
          : [],
      })
    );

    const baseline = Number(parsed.matchScoreBaseline);

    return {
      id: `ai-${Date.now()}`,
      name: `${role} at ${company}`,
      isAiGenerated: true,
      targetRole: String(parsed.targetRole || role),
      company: String(parsed.company || company),
      industry: String(parsed.industry || 'General Services') as any,
      matchScoreBaseline: Number.isFinite(baseline) ? Math.min(70, Math.max(50, baseline)) : 58,
      defaultResume: '',
      defaultJobDescription: String(parsed.defaultJobDescription || ''),
      missingKeywords: keywords,
      fluffDictionary: fluff,
      starQuestions,
    };
  } catch {
    return createFallbackJobProfile(role, company);
  }
}
