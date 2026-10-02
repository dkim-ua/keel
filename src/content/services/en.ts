import type { ServiceContent, ServiceSlug } from "./types";

export const servicesEn: Record<ServiceSlug, ServiceContent> = {
  "web-development": {
    name: "Web Development",
    summary: "Corporate websites, web applications, SaaS platforms, dashboards and marketplaces.",
    seo: {
      title: "Web Development Services",
      description:
        "Custom web applications, SaaS platforms, dashboards, marketplaces and corporate websites — designed, built and launched by one accountable team.",
    },
    hero: {
      title: "Web Development for ambitious products",
      description:
        "From a fast corporate website to a multi-tenant SaaS platform — we design the architecture, build the product and take it to production.",
    },
    build: [
      { title: "Web applications", text: "Product-grade apps with authentication, roles, billing and complex business logic." },
      { title: "SaaS platforms", text: "Multi-tenant architecture, subscriptions, admin panels and analytics." },
      { title: "Dashboards & portals", text: "Data-heavy interfaces for operations, customers and partners." },
      { title: "Corporate websites", text: "Fast, SEO-ready marketing sites with a CMS your team can manage." },
    ],
    useCases: ["SaaS", "Marketplaces", "Dashboards", "Corporate platforms", "Customer portals", "Internal business systems"],
    approach: [
      { title: "Architecture first", text: "We agree on data model, integrations and hosting before writing features." },
      { title: "Design as part of delivery", text: "UX flows and UI are built together with engineering, not handed over the wall." },
      { title: "Performance & SEO by default", text: "Server rendering, Core Web Vitals and semantic markup from day one." },
      { title: "Ready to grow", text: "Modular code, tests and CI/CD so new features don't slow the product down." },
    ],
    technology: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
      { name: "Backend", items: ["Node.js", "Python", "PHP", "Java"] },
      { name: "Data", items: ["PostgreSQL", "MySQL", "Redis"] },
      { name: "Infrastructure", items: ["AWS", "Google Cloud", "Vercel", "Docker"] },
    ],
    faq: [
      {
        question: "Can you redesign and rebuild an existing website or web app?",
        answer: "Yes. We audit what exists, keep what works, and plan a migration that doesn't break SEO or existing users.",
      },
      {
        question: "Will we be able to edit content ourselves?",
        answer: "Yes. For content-driven sites we connect a CMS so your team can update pages without developers.",
      },
      {
        question: "Do you handle hosting and deployment?",
        answer: "Yes. We set up hosting, CI/CD, environments and monitoring, or deploy to your existing infrastructure.",
      },
    ],
    cta: {
      title: "Planning a web product?",
      text: "Tell us what it should do and who it's for. We'll come back with questions and a first estimate.",
      button: "Discuss your web project",
    },
  },

  "mobile-development": {
    name: "Mobile Development",
    summary: "iOS and Android applications, cross-platform apps and mobile products.",
    seo: {
      title: "Mobile App Development — iOS & Android",
      description:
        "iOS, Android and cross-platform mobile apps — from product design and backend to App Store and Google Play release.",
    },
    hero: {
      title: "Mobile apps your users will keep",
      description:
        "We build iOS, Android and cross-platform apps together with the backend, admin tools and release process behind them.",
    },
    build: [
      { title: "Cross-platform apps", text: "One codebase for iOS and Android with Flutter or React Native." },
      { title: "Native apps", text: "Swift and Kotlin when performance or platform features require it." },
      { title: "Backend & admin", text: "APIs, push notifications, payments and the admin panel to run it all." },
      { title: "Release & updates", text: "Store submission, versioning, crash monitoring and ongoing updates." },
    ],
    useCases: [
      "Customer-facing apps",
      "Booking and scheduling",
      "Field service and logistics",
      "Marketplaces",
      "Companion apps for SaaS",
      "Internal team tools",
    ],
    approach: [
      { title: "Choose the right platform approach", text: "Cross-platform or native — decided by requirements and budget, not preference." },
      { title: "Mobile-first UX", text: "Offline states, gestures, notifications and accessibility designed in from the start." },
      { title: "Backend included", text: "The app, its API and admin tools are planned and delivered as one system." },
      { title: "Store-ready releases", text: "We prepare builds, store listings and review requirements for both platforms." },
    ],
    technology: [
      { name: "Cross-platform", items: ["Flutter", "React Native"] },
      { name: "Native", items: ["Swift", "Kotlin"] },
      { name: "Backend", items: ["Node.js", "Python", "Firebase"] },
      { name: "Release", items: ["App Store", "Google Play", "CI/CD"] },
    ],
    faq: [
      {
        question: "Cross-platform or native — which do we need?",
        answer: "For most products cross-platform is faster and more cost-effective. Native makes sense for heavy device features or performance-critical apps. We recommend after discovery.",
      },
      {
        question: "Do you publish the app to the stores?",
        answer: "Yes. We prepare builds, listings and compliance details and publish under your developer accounts.",
      },
      {
        question: "Can you take over an existing app?",
        answer: "Yes. We start with a code and architecture review, then agree on a plan to stabilize and continue development.",
      },
    ],
    cta: {
      title: "Have an app idea?",
      text: "Describe the users and the core flow. We'll help define the first version and the platform approach.",
      button: "Discuss your mobile app",
    },
  },

  "custom-software": {
    name: "Custom Software",
    summary: "Business platforms, internal systems, CRM/ERP integrations and specialized software.",
    seo: {
      title: "Custom Software Development",
      description:
        "Custom business platforms, internal systems, CRM/ERP integrations and specialized software built around how your company actually works.",
    },
    hero: {
      title: "Software built around how your business works",
      description:
        "When off-the-shelf tools don't fit, we design and build systems that match your processes, data and integrations.",
    },
    build: [
      { title: "Business platforms", text: "Core systems that run orders, operations, finance or service delivery." },
      { title: "Internal tools", text: "Admin panels, back-office apps and dashboards that replace spreadsheets." },
      { title: "CRM / ERP integrations", text: "Connecting your systems so data moves without manual copying." },
      { title: "Specialized software", text: "Domain-specific tools with complex rules, calculations or workflows." },
    ],
    useCases: [
      "Operations management",
      "Order and inventory systems",
      "Back-office automation",
      "Partner and supplier portals",
      "Reporting and analytics",
      "Legacy system replacement",
    ],
    approach: [
      { title: "Process before code", text: "We map how work actually happens before designing the system." },
      { title: "Integrate, don't isolate", text: "New software connects to the tools you already use." },
      { title: "Roles and permissions", text: "Access, audit trails and data security designed for real teams." },
      { title: "Incremental rollout", text: "We replace manual steps gradually, so the business keeps running." },
    ],
    technology: [
      { name: "Backend", items: ["Node.js", "Python", "Java", "PHP"] },
      { name: "Frontend", items: ["React", "Next.js", "TypeScript"] },
      { name: "Data", items: ["PostgreSQL", "MySQL", "MongoDB"] },
      { name: "Integrations", items: ["REST", "GraphQL", "Webhooks", "Message queues"] },
    ],
    faq: [
      {
        question: "Why build custom software instead of buying a ready tool?",
        answer: "When a ready tool forces you to change how you work, or you pay for many tools stitched together. We'll tell you honestly if an existing product fits better.",
      },
      {
        question: "Can you integrate with our existing CRM or ERP?",
        answer: "Yes, as long as the system provides an API or another reliable way to exchange data. We check this during discovery.",
      },
      {
        question: "How do you migrate data from old systems?",
        answer: "We plan migration as a separate workstream: mapping, test runs, validation and a rollback plan.",
      },
    ],
    cta: {
      title: "Outgrown spreadsheets and disconnected tools?",
      text: "Tell us about the process you want to improve. We'll suggest what to build and what to integrate.",
      button: "Discuss your system",
    },
  },

  "ai-development": {
    name: "AI Solutions",
    summary: "AI-powered products, LLM integrations, intelligent automation, AI assistants and data-driven systems.",
    seo: {
      title: "AI Development & LLM Integration",
      description:
        "AI-powered features, LLM integrations, assistants and intelligent automation — built into real products with attention to data, cost and reliability.",
    },
    hero: {
      title: "AI that does real work inside your product",
      description:
        "We integrate LLMs and AI services where they create measurable value — with clear data boundaries, evaluation and cost control.",
    },
    build: [
      { title: "LLM integrations", text: "Language models connected to your product, data and workflows." },
      { title: "AI assistants", text: "Assistants that answer from your documents and knowledge base." },
      { title: "Intelligent automation", text: "Classification, extraction and routing of documents, emails and requests." },
      { title: "Data-driven features", text: "Search, recommendations and summaries built on your own data." },
    ],
    useCases: [
      "Support and knowledge assistants",
      "Document processing",
      "Lead and request qualification",
      "Internal search",
      "Content generation workflows",
      "Reporting and summaries",
    ],
    approach: [
      { title: "Start with the use case", text: "We define where AI saves time or money before choosing a model." },
      { title: "Your data, your boundaries", text: "Clear rules for what data is sent where, and how it's stored." },
      { title: "Evaluate, then ship", text: "Test sets and quality checks so behavior is predictable, not a demo." },
      { title: "Cost under control", text: "Model choice, caching and limits planned for production usage." },
    ],
    technology: [
      { name: "Models", items: ["OpenAI", "LLM APIs", "Open-source models"] },
      { name: "Engineering", items: ["Python", "Node.js", "TypeScript"] },
      { name: "Retrieval", items: ["Vector search", "PostgreSQL / pgvector", "Embeddings"] },
      { name: "Infrastructure", items: ["AWS", "Google Cloud", "Azure", "Docker"] },
    ],
    faq: [
      {
        question: "Is our data safe if we use LLMs?",
        answer: "We design data flows explicitly: what is sent to a model, which provider is used, and whether data is retained. Sensitive data can be masked or kept on your infrastructure.",
      },
      {
        question: "Can AI be added to our existing product?",
        answer: "Yes. Most AI features are integrations into an existing product through its backend and data.",
      },
      {
        question: "How do you know the AI works correctly?",
        answer: "We build evaluation sets from real examples and check quality before and after each change.",
      },
    ],
    cta: {
      title: "Exploring AI for your product?",
      text: "Describe the task you want to automate or improve. We'll assess where AI fits and where it doesn't.",
      button: "Discuss your AI project",
    },
  },

  automation: {
    name: "Automation & Integrations",
    summary: "API integrations, workflow automation, third-party services and business process automation.",
    seo: {
      title: "Business Process Automation & API Integrations",
      description:
        "API integrations, workflow automation and connections between your business tools — reducing manual work and data errors.",
    },
    hero: {
      title: "Less manual work. Connected systems.",
      description:
        "We connect your tools and automate repetitive processes, so data moves on its own and your team focuses on work that matters.",
    },
    build: [
      { title: "API integrations", text: "Reliable connections between your product and third-party services." },
      { title: "Workflow automation", text: "Multi-step processes triggered by events, schedules or forms." },
      { title: "Data synchronization", text: "Keeping CRM, accounting, e-commerce and internal systems in sync." },
      { title: "Notifications & reporting", text: "Alerts, digests and reports delivered to email, Slack or Telegram." },
    ],
    useCases: [
      "Lead routing to CRM",
      "Order and payment processing",
      "Invoice and document flows",
      "Messenger bots",
      "Inventory and catalog sync",
      "Scheduled reporting",
    ],
    approach: [
      { title: "Map the process", text: "We find where time is lost and which steps are worth automating first." },
      { title: "Right tool for the job", text: "Custom code, n8n, Make or Zapier — chosen by reliability and cost." },
      { title: "Failure-aware", text: "Retries, logging and alerts so broken integrations don't go unnoticed." },
      { title: "Documented", text: "Every flow is documented so your team understands what runs and why." },
    ],
    technology: [
      { name: "Engineering", items: ["Node.js", "Python", "TypeScript"] },
      { name: "Platforms", items: ["n8n", "Make", "Zapier"] },
      { name: "Protocols", items: ["REST", "GraphQL", "Webhooks"] },
      { name: "Infrastructure", items: ["Docker", "AWS", "Google Cloud"] },
    ],
    faq: [
      {
        question: "Should we use no-code tools or custom code?",
        answer: "No-code platforms are great for simple flows. Complex logic, high volume or sensitive data usually need custom code. Often the answer is a mix.",
      },
      {
        question: "What happens if a connected service changes its API?",
        answer: "We add monitoring and alerts, and can maintain integrations after launch so changes are handled quickly.",
      },
      {
        question: "Can you automate processes in tools we already use?",
        answer: "In most cases, yes — if the tool has an API or webhook support. We confirm this during discovery.",
      },
    ],
    cta: {
      title: "Which process takes too much manual work?",
      text: "Describe it step by step. We'll suggest what can be automated and how.",
      button: "Discuss your automation",
    },
  },

  "mvp-development": {
    name: "MVP & Product Development",
    summary: "From an early concept to a working MVP and further product development.",
    seo: {
      title: "MVP Development for Startups & New Products",
      description:
        "From concept to a working MVP: scope definition, design, development and launch — with architecture ready for the next stage.",
    },
    hero: {
      title: "From concept to a working MVP",
      description:
        "We help you decide what the first version must do, build it properly, launch it and keep developing it as you learn from users.",
    },
    build: [
      { title: "Scope definition", text: "Turning an idea into a focused feature set and a clear first release." },
      { title: "Product design", text: "User flows, prototypes and UI ready for real users." },
      { title: "MVP development", text: "Web or mobile product with the backend, admin and analytics it needs." },
      { title: "Post-launch development", text: "Iterations based on feedback, data and business priorities." },
    ],
    useCases: [
      "Startup MVPs",
      "New product lines",
      "Investor demos that are real products",
      "Pilot projects",
      "Internal product experiments",
      "Rebuilding a prototype for production",
    ],
    approach: [
      { title: "Smallest version worth building", text: "We cut scope to what proves the idea — and nothing it can't live without." },
      { title: "Real, not throwaway", text: "MVP code is built to evolve, not to be rewritten in three months." },
      { title: "Measure from day one", text: "Analytics and feedback loops are part of the first release." },
      { title: "Plan the next stage", text: "A roadmap for what comes after launch, before launch." },
    ],
    technology: [
      { name: "Web", items: ["Next.js", "React", "TypeScript"] },
      { name: "Mobile", items: ["Flutter", "React Native"] },
      { name: "Backend", items: ["Node.js", "Python", "PostgreSQL"] },
      { name: "Launch", items: ["Vercel", "AWS", "Analytics"] },
    ],
    faq: [
      {
        question: "What's the difference between an MVP and a prototype?",
        answer: "A prototype shows the idea. An MVP is a working product that real users can use — the smallest version that delivers value.",
      },
      {
        question: "We only have an idea. Is that enough to start?",
        answer: "Yes. Discovery exists for this: we help define users, core features, scope and budget.",
      },
      {
        question: "What happens after the MVP is launched?",
        answer: "We can continue development based on user feedback, or hand over the product with documentation to your team.",
      },
    ],
    cta: {
      title: "Ready to turn the idea into a product?",
      text: "Describe the problem you're solving and who it's for. We'll help define the first version.",
      button: "Discuss your MVP",
    },
  },
};
