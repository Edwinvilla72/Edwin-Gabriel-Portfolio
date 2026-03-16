export type BlogSection = "personal" | "professional";

export type BlogEntry = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string[];
};

export const personalEntries: BlogEntry[] = [
  {
    slug: "nintendo-goal-origin",
    date: "August 20, 2025",
    title: "Why Nintendo Became My Long-Term Goal",
    excerpt:
      "Where my motivation started, why Nintendo stayed central to my goals, and how that direction still shapes my decisions.",
    content: [
      "Since this is the first entry, I'll introduce myself informally.",
      "I'm Edwin Gabriel Villanueva. I grew up in Port Saint Lucie and I've always wanted to work with computers. From early on, Nintendo had a big influence on me.",
      "I stayed away from that goal for years because it felt impossible at the time.",
      "That changed after the April 1, 2015 Nintendo Direct. I started digging into careers and that path has stayed in my mind since then.",
      "Week 1 of my last year at UCF just started, and it's strange knowing graduation is close."
    ]
  },
  {
    slug: "end-of-semester-reflection",
    date: "December 20, 2025",
    title: "End of Semester Reflection",
    excerpt:
      "Looking back on a packed semester and internship cycle, and processing how quickly things are moving while still feeling meaningful.",
    content: [
      "This semester was extremely eventful and went by quickly.",
      "I also wrapped my last day at CPT for the semester.",
      "It feels like time is moving faster, but somehow still giving me room to learn a lot in each phase."
    ]
  }
];

export const professionalEntries: BlogEntry[] = [
  {
    slug: "shipping-dashboard-improvements",
    date: "February 11, 2026",
    title: "Shipping Dashboard Improvements in Production",
    excerpt:
      "Implementing feature updates, validating behavior, and improving UX around analytics-heavy screens.",
    content: [
      "This sprint focused on cleaning up a dashboard flow with dense data and frequent state changes.",
      "The goal was to reduce friction while preserving quick access to deeper metrics.",
      "The final pass centered on predictable interactions and cleaner visual hierarchy."
    ]
  },
  {
    slug: "internship-to-full-time",
    date: "January 8, 2026",
    title: "From Internship Pace to Full-Time Execution",
    excerpt:
      "Workflow changes, ownership expectations, and engineering habits that mattered most during the transition.",
    content: [
      "Transitioning from internship work to full-time expectations changed the rhythm of delivery.",
      "The largest shift was ownership: making decisions earlier and carrying them through with less hand-holding.",
      "The biggest gains came from stronger planning, clearer communication, and tighter iteration loops."
    ]
  }
];

export const getEntriesBySection = (section: BlogSection): BlogEntry[] =>
  section === "personal" ? personalEntries : professionalEntries;

export const getEntryBySlug = (section: BlogSection, slug: string): BlogEntry | undefined =>
  getEntriesBySection(section).find((entry) => entry.slug === slug);
