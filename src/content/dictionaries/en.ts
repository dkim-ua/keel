/**
 * English dictionary — the source of truth for UI copy.
 * The Ukrainian dictionary is typed against this shape, so a missing key is a type error.
 */

import type { RoleId } from "../roles";

export type { RoleId };

export const en = {
  meta: {
    home: {
      title: "Keel — Software Development Agency",
      description:
        "We design, build and launch custom software, web, mobile, AI and digital products for startups and businesses.",
    },
    about: {
      title: "About",
      description:
        "Keel is a software development agency that takes products from idea to production with one accountable team assembled around each project.",
    },
    contact: {
      title: "Discuss your project",
      description:
        "Tell us what you're building. Share your idea, stage and budget — we'll come back with questions, a plan and an estimate.",
    },
    work: {
      title: "Selected work",
      description: "Concept and internal projects that show how Keel approaches architecture, scope and delivery.",
    },
    thankYou: { title: "Request received", description: "Thank you. We'll get back to you shortly." },
    error: { title: "Request not sent", description: "Something went wrong while sending your request." },
    notFound: { title: "Page not found", description: "The page you're looking for doesn't exist." },
  },

  nav: {
    services: "Services",
    process: "Process",
    cases: "Cases",
    about: "About",
    contact: "Contact",
    cta: "Discuss your project",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    home: "Keel home",
    language: "Language",
  },

  hero: {
    eyebrow: "Software development agency",
    titleLine1: "Your project.",
    titleLine2: "Our responsibility.",
    subtitle: "We design, build and launch custom digital products — from MVPs to full-scale software solutions.",
    primaryCta: "Discuss your project",
    secondaryCta: "See how we work",
    capabilities: ["Web", "Mobile", "SaaS", "AI", "Automation", "Custom Software"],
    tagline: "From idea to production. One partner. One responsibility.",
    visualLabel: "Abstract diagram of a product system: client apps, API, services, data, AI and integrations.",
  },

  value: {
    eyebrow: "The model",
    title: "You bring the problem. We build the solution.",
    text: "Keel takes ownership of the development process — from technical discovery and team formation to development, QA and launch.",
    model: "Flexible distributed team assembled around your project.",
    flow: ["Your idea", "Strategy", "Team", "Development", "QA", "Launch", "Product"],
    items: [
      { title: "One partner", text: "One team coordinates the entire development process." },
      { title: "Project ownership", text: "We manage execution, communication, deadlines and technical delivery." },
      { title: "Flexible expertise", text: "We assemble the right specialists around the requirements of each project." },
      { title: "Built to scale", text: "Start with an MVP and evolve it into a complete product." },
    ],
  },

  services: {
    eyebrow: "Services",
    title: "What we build",
    intro: "Six directions, one delivery model. Whatever the product, you work with one team that owns the result.",
    more: "Learn more",
  },

  process: {
    eyebrow: "Process",
    title: "From idea to production",
    intro: "A clear sequence with visible checkpoints. You always know what's happening, what's next and what it costs.",
    steps: [
      { title: "Discovery", text: "We understand the business, users, goals and technical requirements." },
      { title: "Strategy & Estimate", text: "We define scope, architecture, timeline and estimated budget." },
      { title: "Team", text: "We assemble the right specialists for the project." },
      { title: "Development", text: "The product is built in structured development cycles." },
      { title: "QA", text: "Testing, bug fixing, performance and quality control." },
      { title: "Launch", text: "Deployment, release and transition to ongoing development." },
    ],
    estimateTitle: "Not sure about scope or budget yet?",
    estimateText: "Describe the idea in a few sentences. We'll come back with questions and a first estimate.",
    estimateCta: "Get a project estimate",
  },

  team: {
    eyebrow: "How we work",
    title: "A team built around your project.",
    text: "We don't force every project into the same team structure. We select the expertise required for your specific product.",
    note: "Not every project needs every role.",
    noteText: "The team is formed around the task — and can change as the product moves from MVP to growth.",
    lead: "One project lead stays accountable for scope, timeline and delivery.",
    examplesLabel: "Example team compositions",
    roles: {
      pm: "Project Manager",
      design: "UI/UX Designer",
      frontend: "Frontend Developer",
      backend: "Backend Developer",
      mobile: "Mobile Developer",
      qa: "QA Engineer",
      devops: "DevOps / AI Specialist",
    } satisfies Record<RoleId, string>,
    presets: [
      { id: "web-mvp", label: "Web MVP", roles: ["pm", "design", "frontend", "backend", "qa"] },
      { id: "mobile", label: "Mobile app", roles: ["pm", "design", "mobile", "backend", "qa"] },
      { id: "ai", label: "AI automation", roles: ["pm", "backend", "devops", "qa"] },
      { id: "platform", label: "Full platform", roles: ["pm", "design", "frontend", "backend", "mobile", "qa", "devops"] },
    ] as { id: string; label: string; roles: RoleId[] }[],
    inTeam: "In this team",
    notNeeded: "Not needed here",
    illustrative: "Illustrative examples. The actual team is defined after discovery.",
  },

  why: {
    eyebrow: "Why Keel",
    title: "Why work with us",
    items: [
      { title: "Business-first approach", text: "We build software around business goals, not technology for technology's sake." },
      { title: "One point of responsibility", text: "You don't have to coordinate multiple freelancers and vendors." },
      { title: "Flexible expertise", text: "The team adapts to the project instead of forcing the project into a fixed structure." },
      { title: "Transparent execution", text: "Clear scope, milestones, communication and delivery." },
      { title: "Long-term partnership", text: "We can stay involved after launch and continue developing the product." },
    ],
  },

  cases: {
    eyebrow: "Work",
    title: "Selected work",
    intro: "Concept and internal projects that show how we approach architecture, scope and delivery. Client case studies will be published here with permission.",
    conceptBadge: "Concept / Internal Project",
    productBadge: "Own product",
    clientBadge: "Client project",
    type: "Type",
    stack: "Technologies",
    conceptOutcome: "Concept focus",
    clientOutcome: "Result",
    view: "View concept",
    viewClient: "Read case study",
    all: "All work",
  },

  tech: {
    eyebrow: "Technology",
    title: "Technology that fits the product.",
    subtitle: "We choose technology around the product — not the other way around.",
    note: "The stack depends on the project.",
    noteText: "Requirements, team, budget and long-term maintenance decide the stack — not habit or trends.",
    categories: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript"] },
      { name: "Backend", items: ["Node.js", "Python", "Java", "PHP"] },
      { name: "Mobile", items: ["Flutter", "React Native", "Swift", "Kotlin"] },
      { name: "AI", items: ["OpenAI", "LLM APIs", "Python", "AI integrations"] },
      { name: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
      { name: "Cloud", items: ["AWS", "Google Cloud", "Azure", "Docker"] },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions we hear often",
    items: [
      {
        question: "How much does software development cost?",
        answer:
          "It depends on scope, complexity, team composition and timeline. After a short discovery conversation we prepare an estimate with a breakdown, so you can see where the budget goes before work starts.",
      },
      {
        question: "How long does development take?",
        answer:
          "A focused MVP can take a few weeks; larger products usually take several months. We commit to a timeline once the scope is defined — not before.",
      },
      {
        question: "Do you work with startups?",
        answer:
          "Yes. We help founders define the smallest version worth building, launch it, and plan how it grows.",
      },
      {
        question: "Can you develop an MVP?",
        answer:
          "Yes. We separate must-haves from nice-to-haves, build the core and keep the architecture ready for the next stage.",
      },
      {
        question: "Can you work with an existing development team?",
        answer:
          "Yes. We can take ownership of a defined part of the product — a module, an integration, a mobile app — and align with your team on architecture, code review and releases.",
      },
      {
        question: "Do you provide ongoing support?",
        answer: "Yes. After launch we can continue with maintenance, fixes, improvements and new features in an agreed format.",
      },
      { question: "Do you sign NDAs?", answer: "Yes, when required. We're happy to sign one before you share project details." },
      {
        question: "Can you work with clients internationally?",
        answer: "Yes. We work remotely and take on projects from Ukraine, Europe, the US and other regions. Communication is in English or Ukrainian.",
      },
    ],
  },

  cta: {
    eyebrow: "Start here",
    title: "Have a project in mind?",
    text: "Tell us what you're building. We'll help you understand what it takes to bring it to production.",
    primary: "Discuss your project",
    nextTitle: "What happens next",
    next: [
      { title: "We review your request", text: "And come back with clarifying questions." },
      { title: "Intro call", text: "We discuss goals, users, constraints and timing." },
      { title: "Scope & estimate", text: "You get a proposed scope, team, timeline and budget." },
    ],
    emailLabel: "Prefer email?",
  },

  form: {
    title: "Project request",
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    phoneCountry: "Country code",
    projectType: "What do you need?",
    stage: "Project stage",
    budget: "Estimated budget",
    description: "Project description",
    optional: "optional",
    placeholders: {
      name: "Your name",
      company: "Company name",
      email: "you@company.com",
      phone: "Phone number",
      description: "What are you building, for whom, and what should the first version do?",
    },
    projectTypes: {
      web: "Web Development",
      mobile: "Mobile App",
      saas: "SaaS",
      custom: "Custom Software",
      ai: "AI Solution",
      automation: "Automation",
      mvp: "MVP",
      other: "Other",
    },
    stages: {
      idea: "Idea",
      planning: "Planning",
      mvp: "Existing MVP",
      product: "Existing Product",
      rebuild: "Need to rebuild",
    },
    budgets: {
      lt1k: "Under $1,000",
      "1k-3k": "$1,000–3,000",
      "3k-5k": "$3,000–5,000",
      "5k-10k": "$5,000–10,000",
      "10k-25k": "$10,000–25,000",
      "25k+": "$25,000+",
      unsure: "Not sure",
    },
    submit: "Send project request",
    sending: "Sending…",
    privacy: "We use your details only to respond to this request. NDA available on request.",
    successTitle: "Thank you.",
    successText: "We'll get back to you shortly.",
    successAgain: "Send another request",
    errors: {
      required: "This field is required.",
      invalid: "Please check this value.",
      tooLong: "This is too long.",
      summary: "Please check the highlighted fields.",
      rate_limited: "Too many requests. Please try again in a few minutes.",
      delivery_failed: "We couldn't deliver your request. Please try again in a moment.",
      not_configured: "The form is temporarily unavailable. Please try again later.",
      network: "Network error. Check your connection and try again.",
      generic: "Something went wrong. Please try again.",
    },
    honeypot: "Leave this field empty",
  },

  footer: {
    tagline: "Software development agency",
    description: "From idea to production. One partner. One responsibility.",
    navigation: "Navigation",
    servicesTitle: "Services",
    connect: "Connect",
    rights: "All rights reserved.",
    startProject: "Start a project",
  },

  about: {
    eyebrow: "About Keel",
    title: "A delivery partner for software products.",
    intro:
      "Keel is a software development agency. Clients come to us with an idea, a business problem or an existing product — we take it to production and take responsibility for getting it there.",
    sections: {
      who: {
        title: "Who we are",
        text: [
          "We are a product-focused engineering team that works end to end: discovery, architecture, design, development, QA, launch and further development.",
          "We are not a recruitment agency and we don't rent out developers. You come to us for an outcome — a working product — and we own the path to it.",
        ],
      },
      how: {
        title: "How we work",
        steps: [
          { title: "Understand", text: "Business goals, users, constraints and what success means for you." },
          { title: "Plan", text: "Scope, architecture, milestones, budget — agreed in writing." },
          { title: "Assemble", text: "The specialists the project actually needs, coordinated by one lead." },
          { title: "Deliver", text: "Iterative development, regular demos, QA, release and support." },
        ],
      },
      distributed: {
        title: "Why flexible distributed teams",
        text: "A fixed in-house roster pushes every project into the same shape. We build each team around the product instead.",
        points: [
          { title: "The right expertise", text: "Specialists are chosen for the stack and domain of your project." },
          { title: "Right-sized at every stage", text: "The team grows or shrinks as the product moves from MVP to scale." },
          { title: "You pay for what the project needs", text: "No idle roles that exist only because they're on the payroll." },
          { title: "One coordinated process", text: "Shared standards for code, reviews, QA and communication." },
        ],
      },
      partner: {
        title: "One accountable partner",
        text: "You don't manage developers, vendors or freelancers. You have one point of contact who is accountable for scope, timeline, quality and communication — and one team that answers for the result.",
      },
      projects: {
        title: "Projects we take on",
        items: [
          "MVPs for new products and startups",
          "Web applications, SaaS platforms and dashboards",
          "Mobile apps for iOS and Android",
          "Internal business systems and CRM/ERP integrations",
          "AI features, LLM integrations and assistants",
          "Process automation and third-party integrations",
          "Further development of existing products",
        ],
      },
      notDo: {
        title: "What we don't do",
        text: "We don't provide developers on demand, staff augmentation or hourly body leasing without ownership of the outcome. If we work on your project, we're responsible for it.",
      },
    },
  },

  servicePage: {
    breadcrumbHome: "Home",
    breadcrumbServices: "Services",
    whatWeBuild: "What we build",
    useCases: "Typical use cases",
    approach: "Our approach",
    technology: "Technology",
    technologyNote: "Typical choices — the final stack is defined during discovery.",
    process: "Process",
    faq: "FAQ",
    otherServices: "Other services",
  },

  casePage: {
    back: "All work",
    disclaimerTitle: "Concept / Internal Project",
    disclaimer:
      "This is a concept project created to show how we approach this type of product. It is not a client engagement, and it contains no client data, metrics or results.",
    challenge: "The problem",
    solution: "Proposed solution",
    architecture: "Architecture",
    scope: "First version scope",
    stack: "Technologies",
    visit: "Visit product",
    gallery: "Screenshots",
    focus: "Concept focus",
    cta: "Building something similar?",
    ctaText: "Tell us about your product and we'll outline how we'd approach it.",
  },

  contactPage: {
    eyebrow: "Contact",
    title: "Discuss your project",
    text: "Share as much as you know. If something is unclear yet — that's normal, it's what discovery is for.",
  },

  thankYou: {
    title: "Thank you. We'll get back to you shortly.",
    text: "Your request has been received. We'll review it and reply with next steps.",
    back: "Back to home",
  },

  errorPage: {
    title: "Your request wasn't sent.",
    text: "Something went wrong on our side. Please go back and try again in a moment.",
    retry: "Try again",
  },

  notFound: {
    title: "Page not found",
    text: "The page you're looking for doesn't exist or has moved.",
    back: "Back to home",
  },
};

export type Dictionary = typeof en;
