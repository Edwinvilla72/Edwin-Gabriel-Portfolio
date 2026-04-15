import fitgame_dashboard from "../../assets/images/Projects/Fitgame_Dashboard.png";
import fitgame_login from "../../assets/images/Projects/Fitgame_Login.png";
import fitgame_weekly from "../../assets/images/Projects/Fitgame_Weekly.png";
import wii_menu from "../../assets/images/Nintendo/wii menu.jpg";

export type ProjectCategory = "academic" | "personal" | "professional";
export type ProjectVisual = "abstract" | "image";

export type ProjectMedia = {
  src: string;
  alt: string;
};

export type ProjectLink = {
  href: string;
  label: string;
};

export type ProjectEntry = {
  slug: string;
  name: string;
  category: ProjectCategory;
  visual: ProjectVisual;
  accent: string;
  visualLabel: string;
  type: string;
  timeline: string;
  role?: string;
  responsibilities?: string[];
  description: string;
  stack: string[];
  gallery?: ProjectMedia[];
  projectLinks?: ProjectLink[];
};

export const categoryLabels: Record<ProjectCategory, string> = {
  academic: "Academic",
  personal: "Personal",
  professional: "Professional"
};

export const projects: ProjectEntry[] = [
  {
    slug: "intelligent-browser-agents",
    name: "Intelligent Browser Agents",
    category: "academic",
    visual: "abstract",
    accent: "#6fd0ff",
    visualLabel: "Browser automation",
    type: "Senior Design / Full Stack",
    timeline: "2025 - 2026",
    role: "Project Manager",
    responsibilities: [
      "Project Manager",
      "Full Stack Developer",
      "UI/UX Designer",
      "Execution Agent Developer"
    ],
    description:
      "Multi-agent browser automation platform that turns natural-language requests into guided web execution.",
    stack: ["React", "FastAPI", "Playwright", "LangGraph"],
    projectLinks: [
      {
        href: "https://browseragents.net",
        label: "browseragents.net"
      },
      {
        href: "https://github.com/Intelligent-Browser-Agents/Intelligent-Browser-Agents",
        label: "GitHub"
      }
    ]
  },
  {
    slug: "shade",
    name: "SHADE",
    category: "professional",
    visual: "abstract",
    accent: "#52dbc2",
    visualLabel: "Synthetic traffic",
    type: "AI / Security",
    timeline: "2025 - 2026",
    description:
      "Cyber-defense simulation platform focused on generating more realistic human-like activity for security testing.",
    stack: ["Python", "Agents", "Simulation"]
  },
  {
    slug: "knw",
    name: "knw.",
    category: "professional",
    visual: "abstract",
    accent: "#ffb087",
    visualLabel: "Audience signals",
    type: "Analytics / Full Stack",
    timeline: "2026 - Present",
    description:
      "Live-event analytics platform that turns audience attention and emotion signals into usable operator dashboards.",
    stack: ["TypeScript", "AWS", "Dashboards"],
    projectLinks: [
      {
        href: "https://knw.net/en",
        label: "Website"
      }
    ]
  },
  {
    slug: "fitgame",
    name: "FitGame",
    category: "personal",
    visual: "image",
    accent: "#62c3ff",
    visualLabel: "Gamified health",
    type: "Product / Mobile-style concept",
    timeline: "2024",
    description:
      "Fitness tracking concept that uses game-inspired progress loops to make consistency easier to maintain.",
    stack: ["Product Design", "UX", "Game Loops"],
    gallery: [
      { src: fitgame_login, alt: "FitGame login screen" },
      { src: fitgame_dashboard, alt: "FitGame dashboard screen" },
      { src: fitgame_weekly, alt: "FitGame weekly progress screen" }
    ]
  },
  {
    slug: "icloud-file-downloader",
    name: "iCloud File Downloader",
    category: "personal",
    visual: "abstract",
    accent: "#8ea8ff",
    visualLabel: "File transfer",
    type: "Utility / Personal",
    timeline: "Recent build",
    description:
      "Utility for downloading iCloud files directly to a chosen local directory through a simplified workflow.",
    stack: ["Automation", "File Management", "iCloud"],
    projectLinks: [
      {
        href: "https://github.com/Edwinvilla72/iCloud-File-Downloader",
        label: "GitHub"
      }
    ]
  },
  {
    slug: "finance-tracker",
    name: "Personal Finance Tracker",
    category: "personal",
    visual: "abstract",
    accent: "#78d59b",
    visualLabel: "Financial planning",
    type: "Full Stack / Personal",
    timeline: "Recent build",
    description:
      "Personal finance planning app for tracking balances, scheduled transactions, debts, paychecks, and savings goals.",
    stack: ["React", "TypeScript", "Supabase", "Postgres"],
    projectLinks: [
      {
        href: "https://famfinapp.vercel.app",
        label: "Website"
      },
      {
        href: "https://github.com/Edwinvilla72/Finance-Tracker",
        label: "GitHub"
      }
    ]
  },
  {
    slug: "first-portfolio-website",
    name: "My First Portfolio Website",
    category: "personal",
    visual: "abstract",
    accent: "#ff9a87",
    visualLabel: "Early portfolio",
    type: "Frontend / Personal",
    timeline: "Earlier build",
    description:
      "My first portfolio site, built as an earlier version of how I presented my work online.",
    stack: ["HTML", "CSS", "JavaScript"],
    projectLinks: [
      {
        href: "https://edwinvilla72.github.io",
        label: "Website"
      }
    ]
  },
  {
    slug: "wii-portfolio",
    name: "My Portfolio Website",
    category: "personal",
    visual: "image",
    accent: "#83dbff",
    visualLabel: "Nintendo-inspired UI",
    type: "Frontend / Personal",
    timeline: "2025 - Present",
    description:
      "Wii-inspired portfolio experience that balances playful interaction with a cleaner, more structured frontend.",
    stack: ["React", "Motion", "UI Systems"],
    gallery: [{ src: wii_menu, alt: "Wii-inspired menu interface" }],
    projectLinks: [
      {
        href: "https://edwingabriel.com",
        label: "Website"
      }
    ]
  }
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
