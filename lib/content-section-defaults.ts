import type { SiteConfig } from "@/lib/config"

export type ContentSectionPageConfig = NonNullable<SiteConfig["contentSectionPages"]>[number]

type Defaults = Partial<
  Pick<ContentSectionPageConfig, "eyebrow" | "title" | "description" | "therapyApproach" | "sessionFormats" | "nextStepsLinks" | "faqs" | "seo">
>

export const CONTENT_SECTION_PAGE_DEFAULTS: Record<string, Defaults> = {
  "why-money-triggers-anxiety": {
    eyebrow: "Money + nervous system",
    title: "Why money triggers anxiety",
    description:
      "Money can activate threat responses because it’s tied to safety, belonging, independence, and past experiences. This page explains common patterns (avoidance, hyper‑control, shame spirals) and how counselling can help you build steadier choices.",
    therapyApproach: [
      "Identify the emotional pattern underneath financial stress (fear, shame, scarcity, grief).",
      "Track triggers (messages, bills, family pressure, comparison) and the body signals that follow.",
      "Build calming skills that work in real moments (breath, grounding, paced decision-making).",
      "Strengthen boundaries and scripts for hard money conversations.",
      "Replace all‑or‑nothing thinking with a sustainable plan you can maintain.",
    ],
    sessionFormats: ["Telehealth or in‑person sessions.", "Structured sessions with practical takeaways you can practice between visits."],
    nextStepsLinks: [
      { label: "Book a session", href: "/#book" },
      { label: "What is financial abuse?", href: "/content-sections/what-is-financial-abuse" },
      { label: "Monetary psychotherapy", href: "/content-sections/monetary-psychotherapy" },
    ],
    faqs: [
      {
        question: "Is money anxiety just about budgeting?",
        answer:
          "Often it’s not. Budgeting can help, but anxiety usually involves safety, control, identity, and past experiences. Counselling focuses on the emotional pattern and the practical skills that keep you steady.",
      },
      {
        question: "Why do I freeze or avoid looking at my bank balance?",
        answer:
          "Avoidance can be a protective response when the body expects danger or shame. We work gently with the trigger so you can approach money decisions without overwhelm.",
      },
      {
        question: "Can sessions help with the practical side too?",
        answer:
          "Yes. We can build decision frameworks, boundaries, and communication scripts, alongside emotional support, so the plan holds under pressure.",
      },
    ],
    seo: {
      metaTitle: "Why money triggers anxiety | Financial Abuse Therapist",
      metaDescription: "Understand common money-anxiety patterns and how counselling supports steadier, safer financial decisions.",
    },
  },
  "what-is-financial-abuse": {
    eyebrow: "Understanding financial control",
    title: "What is Financial Abuse",
    description:
      "Financial abuse (also called economic abuse) is a pattern of controlling a person’s access to money and resources. It can include monitoring, restricting, sabotaging work, forcing debt, and using money to punish or coerce.",
    therapyApproach: [
      "Name the pattern clearly (what happened, how often, what impact).",
      "Rebuild safety and agency — without pressure to disclose more than feels safe.",
      "Plan boundaries, documentation, and next steps that fit your situation.",
      "Support decision-making when fear, guilt, or confusion are high.",
    ],
    sessionFormats: ["Trauma‑informed counselling sessions in person or via telehealth.", "Paced work focused on safety, clarity, and practical steps."],
    nextStepsLinks: [
      { label: "Book a session", href: "/#book" },
      { label: "Financial trauma", href: "/content-sections/financial-trauma" },
      { label: "Elderly/Disabled financial abuse", href: "/content-sections/elderly-disabled-financial-abuse" },
    ],
    faqs: [
      {
        question: "Does financial abuse require physical violence?",
        answer:
          "No. Financial control can occur on its own or alongside other forms of abuse. The core feature is coercive control over money, resources, and choices.",
      },
      {
        question: "What are common signs?",
        answer:
          "Monitoring spending, restricting access to accounts, forcing debt, withholding basic needs, sabotaging work, or making support conditional on compliance.",
      },
      {
        question: "What can therapy do here?",
        answer:
          "Therapy helps you clarify what’s happening, rebuild agency, and make safer decisions with support — including boundaries, scripts, and practical planning.",
      },
    ],
    seo: {
      metaTitle: "What is financial abuse? | Financial Abuse Therapist",
      metaDescription: "A clear explanation of financial (economic) abuse, common signs, and how counselling supports recovery and agency.",
    },
  },
  "elderly-disabled-financial-abuse": {
    eyebrow: "Safety + safeguarding",
    title: "Elderly/Disabled Financial Abuse",
    description:
      "Financial abuse can target older people and people with disability through pressure, manipulation, isolation, and misuse of caregiving roles. This page covers common tactics and supportive next steps.",
    therapyApproach: [
      "Clarify the pattern without blame (what’s happening and what you want to change).",
      "Support boundaries with family, carers, or others in positions of power.",
      "Reduce isolation by strengthening safe supports and communication.",
      "Plan for steady, realistic steps (documentation, advocacy, support services).",
    ],
    sessionFormats: ["Telehealth is available for accessibility.", "Sessions can include planning, scripts, and support for difficult family dynamics."],
    nextStepsLinks: [{ label: "Book a session", href: "/#book" }, { label: "What is financial abuse?", href: "/content-sections/what-is-financial-abuse" }],
    faqs: [
      {
        question: "What makes this type of abuse hard to spot?",
        answer:
          "It can be disguised as ‘help’ or ‘care’, especially when someone depends on another person for transport, support, or decision-making.",
      },
      {
        question: "I feel guilty questioning a family member—what do I do?",
        answer:
          "Guilt is common in family systems. Therapy can help you separate gratitude from obligation and set boundaries that protect dignity and safety.",
      },
    ],
    seo: {
      metaTitle: "Elderly and disability financial abuse | Financial Abuse Therapist",
      metaDescription: "Common tactics and supportive next steps when financial abuse affects older people or people with disability.",
    },
  },
  "monetary-psychotherapy": {
    eyebrow: "Your relationship with money",
    title: "Monetary Psychotherapy",
    description:
      "Monetary psychotherapy explores the emotional and relational side of money — how beliefs, shame, trauma, family dynamics, and identity shape financial decisions. It’s practical, compassionate work that strengthens agency and steadiness.",
    therapyApproach: [
      "Map money beliefs learned in childhood and relationships (scarcity, worth, obligation).",
      "Work with shame, avoidance, and compulsive patterns without judgment.",
      "Build tolerable, repeatable decision habits (pace, clarity, boundaries).",
      "Strengthen communication around money (requests, refusals, agreements).",
    ],
    sessionFormats: ["Telehealth and in‑person sessions.", "A balance of insight + practical tools you can apply immediately."],
    nextStepsLinks: [{ label: "Book a session", href: "/#book" }, { label: "Why money triggers anxiety", href: "/content-sections/why-money-triggers-anxiety" }],
    faqs: [
      {
        question: "Is this the same as financial coaching?",
        answer:
          "No. Coaching focuses on goals and actions. Monetary psychotherapy focuses on the emotional patterns that block change and supports safer decisions alongside practical steps.",
      },
      {
        question: "Do I need to share numbers and statements?",
        answer:
          "Only if it helps you. We can work with emotions and patterns without detailed financial disclosure.",
      },
    ],
    seo: {
      metaTitle: "Monetary psychotherapy | Financial Abuse Therapist",
      metaDescription: "Understand how emotions, shame, trauma and relationships shape money decisions — and how therapy supports steadier change.",
    },
  },
  "financial-trauma": {
    eyebrow: "Recovery + stability",
    title: "Financial Trauma",
    description:
      "Financial trauma can develop after prolonged instability, coercion, sudden loss, or repeated money-related stress. It often shows up as hypervigilance, avoidance, shame, or a sense that money decisions are never safe.",
    therapyApproach: [
      "Stabilise the nervous system so decisions feel more tolerable.",
      "Process the story with care — at your pace, with consent.",
      "Build practical boundaries and recovery steps that reduce re‑exposure to harm.",
      "Shift from survival strategies to sustainable choices.",
    ],
    sessionFormats: ["Telehealth or in‑person sessions.", "Structured support for both emotions and practical decision-making."],
    nextStepsLinks: [{ label: "Book a session", href: "/#book" }, { label: "What is financial abuse?", href: "/content-sections/what-is-financial-abuse" }],
    faqs: [
      {
        question: "Is financial trauma a real thing?",
        answer:
          "People can experience trauma-like responses around money after coercion, instability, or repeated stress. Therapy focuses on how it affects your life and how to rebuild safety and choice.",
      },
      {
        question: "Why do I panic when I have to deal with money tasks?",
        answer:
          "When the body associates money with threat, even small tasks can trigger big reactions. We work on regulation first, then build a paced approach to decisions.",
      },
    ],
    seo: {
      metaTitle: "Financial trauma | Financial Abuse Therapist",
      metaDescription: "Support for trauma-like responses around money: panic, avoidance, hypervigilance, shame — and a path toward steadier decisions.",
    },
  },
  "family-financial-assistance-inheritance": {
    eyebrow: "Boundaries + family dynamics",
    title: "Family Financial Assistance. Inheritance.",
    description:
      "Family support and inheritances can become complicated when money carries pressure, control, strings attached, or loyalty tests. This page covers common patterns and a boundary-led way forward.",
    therapyApproach: [
      "Clarify what’s being asked and what it costs you emotionally.",
      "Separate gratitude from obligation and define your bottom lines.",
      "Build scripts and boundaries for predictable conflict points.",
      "Plan steps that reduce leverage and increase independence over time.",
    ],
    sessionFormats: ["Telehealth or in‑person sessions.", "Practical boundary and communication work alongside emotional support."],
    nextStepsLinks: [{ label: "Book a session", href: "/#book" }, { label: "Estrangement", href: "/content-sections/estrangement" }],
    faqs: [
      {
        question: "Is it wrong to accept help if I need it?",
        answer:
          "Not necessarily. We can work on taking support safely: clarifying terms, documenting agreements, and reducing exposure to control over time.",
      },
      {
        question: "What if I’m blamed for being ‘ungrateful’?",
        answer:
          "That’s common when money is used for leverage. Therapy helps you respond without getting pulled into shame or compliance.",
      },
    ],
    seo: {
      metaTitle: "Family financial assistance & inheritance | Financial Abuse Therapist",
      metaDescription: "Support with boundaries and family dynamics when money help or inheritances come with pressure, control, or strings attached.",
    },
  },
  estrangement: {
    eyebrow: "Relationship safety",
    title: "Estrangement",
    description:
      "Estrangement can be a protective choice when relationships are unsafe, coercive, or repeatedly harmful. This page supports clarity, grief work, boundaries, and practical next steps.",
    therapyApproach: [
      "Clarify your reasons and your values (without pressure either way).",
      "Work with grief, anger, guilt, and the fear of backlash.",
      "Strengthen boundaries and communication (low contact, no contact, or structured contact).",
      "Plan for predictable triggers (holidays, family events, money requests).",
    ],
    sessionFormats: ["Telehealth or in‑person sessions.", "Consent-led pacing and clear, practical tools."],
    nextStepsLinks: [{ label: "Book a session", href: "/#book" }, { label: "Family financial assistance", href: "/content-sections/family-financial-assistance-inheritance" }],
    faqs: [
      {
        question: "Is estrangement always permanent?",
        answer:
          "Not always. Some people choose it temporarily, others long-term. Therapy supports clarity and a plan aligned with your safety and values.",
      },
      {
        question: "How do I handle the guilt?",
        answer:
          "Guilt can be a learned alarm system. We work on the emotional pattern and build boundaries so guilt doesn’t force unsafe choices.",
      },
    ],
    seo: {
      metaTitle: "Estrangement support | Financial Abuse Therapist",
      metaDescription: "Support for estrangement decisions: boundaries, grief, guilt, and practical next steps aligned with safety and values.",
    },
  },
  "financial-abuse-therapy": {
    eyebrow: "Therapy that restores agency",
    title: "Financial Abuse Therapy",
    description:
      "Financial abuse therapy supports recovery from coercive control around money — rebuilding safety, boundaries, confidence, and decision-making. Sessions are paced, consent-led, and practical.",
    therapyApproach: [
      "Stabilise: reduce overwhelm and increase safety in the present.",
      "Clarify: name the pattern and the impact without self-blame.",
      "Rebuild: agency, boundaries, and practical next steps.",
      "Integrate: strengthen trust in your decisions and relationships.",
    ],
    sessionFormats: ["Telehealth or in‑person sessions.", "A mix of emotional processing and practical planning."],
    nextStepsLinks: [{ label: "Book a session", href: "/#book" }, { label: "What is financial abuse?", href: "/content-sections/what-is-financial-abuse" }],
    faqs: [
      {
        question: "Do I need to leave the relationship first?",
        answer:
          "No. Therapy can support you regardless of your current situation. We focus on safety, clarity, and practical next steps at your pace.",
      },
      {
        question: "What if I feel ashamed?",
        answer:
          "Shame is common after coercive control. Therapy supports self-compassion and a grounded plan to rebuild confidence and agency.",
      },
    ],
    seo: {
      metaTitle: "Financial abuse therapy | Financial Abuse Therapist",
      metaDescription: "Trauma‑informed counselling for recovery from financial abuse: safety, boundaries, confidence, and steadier decision‑making.",
    },
  },
  "about-dan": {
    eyebrow: "Practitioner",
    title: "About Dan",
    description:
      "Dan Lobel offers trauma‑informed counselling focused on financial abuse recovery, financial trauma, and the emotional side of money. Sessions are paced, consent‑led, and grounded in practical support.",
    therapyApproach: [
      "A calm, steady pace with consent and clarity.",
      "Trauma‑informed, relational counselling with practical tools.",
      "A focus on autonomy, boundaries, and nervous-system safety.",
    ],
    sessionFormats: ["Telehealth and in‑person options depending on availability.", "Clear session structure with next steps you can actually use."],
    nextStepsLinks: [{ label: "Book a session", href: "/#book" }, { label: "Read the About page", href: "/about" }],
    faqs: [
      {
        question: "What can I bring to the first session?",
        answer:
          "You can bring a situation you want clarity on, a pattern you keep repeating, or simply the feeling that money doesn’t feel safe. We’ll set a pace that works for you.",
      },
    ],
    seo: {
      metaTitle: "About Dan Lobel | Financial Abuse Therapist",
      metaDescription: "Learn about Dan’s trauma‑informed counselling approach for financial abuse recovery and financial trauma.",
    },
  },
}

export function applyContentSectionDefaults(page: ContentSectionPageConfig, defaults: Defaults | null | undefined): ContentSectionPageConfig {
  if (!defaults) return page
  const pickString = (value: string | undefined, fallback: string | undefined) => (String(value ?? "").trim() ? value : fallback ?? value ?? "")
  return {
    ...page,
    eyebrow: pickString(page.eyebrow, defaults.eyebrow as string | undefined),
    title: pickString(page.title, defaults.title as string | undefined),
    description: pickString(page.description, defaults.description as string | undefined),
    therapyApproach:
      Array.isArray(page.therapyApproach) && page.therapyApproach.length
        ? page.therapyApproach
        : (defaults.therapyApproach as string[] | undefined) ?? page.therapyApproach,
    sessionFormats:
      Array.isArray(page.sessionFormats) && page.sessionFormats.length
        ? page.sessionFormats
        : (defaults.sessionFormats as string[] | undefined) ?? page.sessionFormats,
    nextStepsLinks:
      Array.isArray(page.nextStepsLinks) && page.nextStepsLinks.length
        ? page.nextStepsLinks
        : (defaults.nextStepsLinks as ContentSectionPageConfig["nextStepsLinks"] | undefined) ?? page.nextStepsLinks,
    faqs:
      Array.isArray(page.faqs) && page.faqs.length ? page.faqs : (defaults.faqs as ContentSectionPageConfig["faqs"] | undefined) ?? page.faqs,
    seo: {
      ...(page.seo ?? {}),
      ...(defaults.seo ?? {}),
      metaTitle: pickString(page.seo?.metaTitle, defaults.seo?.metaTitle),
      metaDescription: pickString(page.seo?.metaDescription, defaults.seo?.metaDescription),
    },
  }
}


