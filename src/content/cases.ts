import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

/**
 * Case studies.
 *
 * `kind: "concept"` — internal / concept projects. They are always labelled
 * "Concept / Internal Project" in the UI and must not contain client names,
 * metrics or results.
 *
 * To publish a real client case: add an entry with `kind: "client"` and a
 * factual `outcome` approved by the client. Order in the array = order on the site.
 */

/**
 * concept — concept / internal project (always labelled as such, no metrics or results);
 * product — the team's own product;
 * client  — client project (only with a factual result approved by the client).
 */
export const caseKinds = ["concept", "product", "client"] as const;
export type CaseKind = (typeof caseKinds)[number];
export const casePreviews = ["board", "chart", "chat"] as const;

export type CaseStudy = {
  slug: string;
  kind: CaseKind;
  name: string;
  type: string;
  summary: string;
  stack: string[];
  /** For concepts: what the concept explores. For client cases: the real, verified result. */
  outcome: string;
  challenge: string;
  solution: string;
  architecture: { name: string; text: string }[];
  scope: string[];
  /** Abstract card illustration, used when there is no cover image. */
  preview: (typeof casePreviews)[number];
  /** Optional uploaded images (absolute URLs). */
  cover?: string;
  gallery?: string[];
  /** Optional link to the live product. */
  link?: string;
};

/** Language-dependent part of a case. */
export type CaseText = Pick<CaseStudy, "name" | "type" | "summary" | "outcome" | "challenge" | "solution" | "architecture" | "scope">;

/** A case as stored in the database / edited in the admin panel (both languages at once). */
export type CaseRecord = Pick<CaseStudy, "slug" | "kind" | "preview" | "stack" | "cover" | "gallery" | "link"> & {
  id: string;
  published: boolean;
  order: number;
  updatedAt?: string;
} & Record<Locale, CaseText>;

export function recordToCase(record: CaseRecord, locale: Locale): CaseStudy {
  const text = record[locale]?.name ? record[locale] : record.en;
  return {
    slug: record.slug,
    kind: record.kind,
    preview: record.preview,
    stack: record.stack,
    cover: record.cover,
    gallery: record.gallery ?? [],
    link: record.link,
    ...text,
  };
}

const stack = {
  fieldline: ["Next.js", "Flutter", "Node.js", "PostgreSQL", "Docker"],
  billing: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Stripe API"],
  knowledge: ["Python", "OpenAI API", "PostgreSQL / pgvector", "Next.js"],
};

const casesEn: CaseStudy[] = [
  {
    slug: "fieldline",
    kind: "concept",
    preview: "board",
    name: "Fieldline",
    type: "Custom Software · Mobile",
    summary:
      "Operations platform for field service companies: job scheduling, dispatch, a technician mobile app and client reporting in one system.",
    stack: stack.fieldline,
    outcome: "Offline-first mobile workflow and a dispatch model that replaces spreadsheets and messenger chats.",
    challenge:
      "Service companies often run dispatch through spreadsheets, calls and group chats. Jobs get lost, technicians lack context on site, and managers can't see status without asking.",
    solution:
      "A web dispatch console for managers, a mobile app for technicians that works without connectivity, and automatic job reports for clients — on one shared data model.",
    architecture: [
      { name: "Dispatch console", text: "Next.js web app: job board, scheduling calendar, technician availability." },
      { name: "Technician app", text: "Flutter app with offline storage, photo capture, checklists and sync on reconnect." },
      { name: "Core API", text: "Node.js service with role-based access and an event log for every job change." },
      { name: "Data", text: "PostgreSQL as the single source of truth for jobs, clients, assets and reports." },
    ],
    scope: [
      "Job creation and assignment",
      "Technician schedule and route list",
      "Offline checklists and photo reports",
      "Client-facing PDF job report",
      "Manager dashboard with job statuses",
    ],
  },
  {
    slug: "billing-console",
    kind: "concept",
    preview: "chart",
    name: "Ledgerline",
    type: "SaaS · Web",
    summary:
      "Billing and subscription console for B2B SaaS teams: plans, invoices, payment status and revenue reporting in one dashboard.",
    stack: stack.billing,
    outcome: "Multi-tenant SaaS architecture with clear separation between billing logic and the payment provider.",
    challenge:
      "Early-stage SaaS teams often handle billing through a payment provider's dashboard and manual exports. Custom plans, invoices and reporting quickly become a mess.",
    solution:
      "A dedicated console on top of the payment provider's API: plan management, invoice history, failed-payment workflows and exports for accounting.",
    architecture: [
      { name: "Web console", text: "Next.js + TypeScript dashboard with role-based access per workspace." },
      { name: "Billing service", text: "Node.js service that owns plans and invoices; the payment provider is an adapter." },
      { name: "Webhooks", text: "Idempotent processing of payment events with retries and an audit log." },
      { name: "Data", text: "PostgreSQL with tenant isolation and reporting views." },
    ],
    scope: [
      "Workspaces, users and roles",
      "Plans and subscription management",
      "Invoice list and PDF export",
      "Failed payment notifications",
      "Revenue overview and CSV export",
    ],
  },
  {
    slug: "knowledge-assistant",
    kind: "concept",
    preview: "chat",
    name: "Docsight",
    type: "AI Solution",
    summary:
      "Internal AI assistant that answers employee questions from company documents, with source references and access control.",
    stack: stack.knowledge,
    outcome: "Retrieval pipeline with source citations, permission-aware search and an evaluation set for answer quality.",
    challenge:
      "Company knowledge is spread across documents, wikis and drives. Employees spend time searching or asking colleagues, and generic chatbots can't see internal data — or see too much.",
    solution:
      "A retrieval-augmented assistant: documents are indexed with their access rules, answers always cite sources, and quality is checked against a test set before each release.",
    architecture: [
      { name: "Ingestion", text: "Python workers that parse documents, split them into chunks and create embeddings." },
      { name: "Retrieval", text: "PostgreSQL with pgvector; results are filtered by the user's permissions." },
      { name: "Answering", text: "LLM API with prompts that require citations and allow \"I don't know\"." },
      { name: "Interface", text: "Next.js chat UI with source previews and feedback on each answer." },
    ],
    scope: [
      "Document upload and indexing",
      "Permission-aware search",
      "Answers with source citations",
      "Feedback on answers",
      "Evaluation set and quality report",
    ],
  },
];

const casesUk: CaseStudy[] = [
  {
    slug: "fieldline",
    kind: "concept",
    preview: "board",
    name: "Fieldline",
    type: "Кастомне ПЗ · Mobile",
    summary:
      "Операційна платформа для компаній виїзного сервісу: планування робіт, диспетчеризація, мобільний застосунок для техніків і звіти для клієнтів в одній системі.",
    stack: stack.fieldline,
    outcome: "Мобільний процес з роботою офлайн і модель диспетчеризації, що замінює таблиці та чати в месенджерах.",
    challenge:
      "Сервісні компанії часто ведуть диспетчеризацію в таблицях, дзвінках і групових чатах. Заявки губляться, техніки не мають контексту на об'єкті, а менеджери не бачать статусу без уточнень.",
    solution:
      "Веб-консоль диспетчера для менеджерів, мобільний застосунок для техніків, що працює без зв'язку, і автоматичні звіти для клієнтів — на одній спільній моделі даних.",
    architecture: [
      { name: "Консоль диспетчера", text: "Вебзастосунок на Next.js: дошка заявок, календар, доступність техніків." },
      { name: "Застосунок техніка", text: "Flutter-застосунок з офлайн-сховищем, фото, чеклистами та синхронізацією." },
      { name: "Core API", text: "Сервіс на Node.js з рольовим доступом і журналом змін кожної заявки." },
      { name: "Дані", text: "PostgreSQL як єдине джерело правди для заявок, клієнтів, обладнання та звітів." },
    ],
    scope: [
      "Створення та призначення заявок",
      "Розклад техніка та список маршрутів",
      "Офлайн-чеклисти та фотозвіти",
      "PDF-звіт для клієнта",
      "Дашборд менеджера зі статусами заявок",
    ],
  },
  {
    slug: "billing-console",
    kind: "concept",
    preview: "chart",
    name: "Ledgerline",
    type: "SaaS · Web",
    summary:
      "Консоль білінгу та підписок для B2B SaaS-команд: тарифи, рахунки, статуси платежів і звітність щодо виручки в одному дашборді.",
    stack: stack.billing,
    outcome: "Мультитенантна SaaS-архітектура з чітким розділенням логіки білінгу та платіжного провайдера.",
    challenge:
      "SaaS-команди на ранньому етапі часто ведуть білінг через кабінет платіжного провайдера та ручні вивантаження. Індивідуальні тарифи, рахунки та звітність швидко перетворюються на хаос.",
    solution:
      "Окрема консоль поверх API платіжного провайдера: керування тарифами, історія рахунків, сценарії неуспішних платежів і вивантаження для бухгалтерії.",
    architecture: [
      { name: "Веб-консоль", text: "Дашборд на Next.js + TypeScript з рольовим доступом у межах робочого простору." },
      { name: "Сервіс білінгу", text: "Сервіс на Node.js, що володіє тарифами й рахунками; платіжний провайдер — адаптер." },
      { name: "Вебхуки", text: "Ідемпотентна обробка платіжних подій з повторами та журналом аудиту." },
      { name: "Дані", text: "PostgreSQL з ізоляцією тенантів і представленнями для звітів." },
    ],
    scope: [
      "Робочі простори, користувачі та ролі",
      "Керування тарифами й підписками",
      "Список рахунків і експорт у PDF",
      "Сповіщення про неуспішні платежі",
      "Огляд виручки та експорт у CSV",
    ],
  },
  {
    slug: "knowledge-assistant",
    kind: "concept",
    preview: "chat",
    name: "Docsight",
    type: "AI-рішення",
    summary:
      "Внутрішній AI-асистент, що відповідає на питання працівників на основі документів компанії — з посиланнями на джерела та контролем доступу.",
    stack: stack.knowledge,
    outcome: "Retrieval-конвеєр з цитуванням джерел, пошуком з урахуванням прав доступу та оцінювальним набором для якості відповідей.",
    challenge:
      "Знання компанії розпорошені по документах, вікі та дисках. Працівники витрачають час на пошук або питають колег, а звичайні чат-боти не бачать внутрішніх даних — або бачать забагато.",
    solution:
      "Асистент з retrieval-augmented generation: документи індексуються разом із правилами доступу, відповіді завжди містять джерела, а якість перевіряється на тестовому наборі перед кожним релізом.",
    architecture: [
      { name: "Індексація", text: "Python-воркери розбирають документи, ділять на фрагменти та створюють embeddings." },
      { name: "Пошук", text: "PostgreSQL з pgvector; результати фільтруються за правами користувача." },
      { name: "Відповіді", text: "LLM API з промптами, що вимагають цитувань і дозволяють відповідь «не знаю»." },
      { name: "Інтерфейс", text: "Чат на Next.js з переглядом джерел і фідбеком до кожної відповіді." },
    ],
    scope: [
      "Завантаження та індексація документів",
      "Пошук з урахуванням прав доступу",
      "Відповіді з цитуванням джерел",
      "Фідбек до відповідей",
      "Оцінювальний набір і звіт про якість",
    ],
  },
];

const byLocale: Record<Locale, CaseStudy[]> = { en: casesEn, uk: casesUk };

/** Built-in concept cases — shown until real cases are added in the admin panel. */
export function staticCaseRecords(): CaseRecord[] {
  return casesEn.map((en, index) => {
    const pick = (c: CaseStudy): CaseText => ({
      name: c.name,
      type: c.type,
      summary: c.summary,
      outcome: c.outcome,
      challenge: c.challenge,
      solution: c.solution,
      architecture: c.architecture,
      scope: c.scope,
    });
    const record = {
      id: en.slug,
      slug: en.slug,
      kind: en.kind,
      preview: en.preview,
      stack: en.stack,
      gallery: [],
      published: true,
      order: index,
    } as Omit<CaseRecord, Locale>;
    const texts = Object.fromEntries(
      locales.map((l) => [l, pick(byLocale[l].find((c) => c.slug === en.slug) ?? en)]),
    ) as Record<Locale, CaseText>;
    return { ...record, ...texts };
  });
}
