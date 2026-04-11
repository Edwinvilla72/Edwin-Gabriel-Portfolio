import fitgame_login from "../../assets/images/Projects/Fitgame_Login.png";
import wii_menu from "../../assets/images/Nintendo/wii menu.jpg";

export type ProjectCategory = "personal" | "professional";
export type ProjectVisual = "abstract" | "image";

export type ProjectEntry = {
  slug: string;
  name: string;
  category: ProjectCategory;
  visual: ProjectVisual;
  image?: string;
  imageAlt?: string;
  accent: string;
  visualLabel: string;
  type: string;
  timeline: string;
  summary: string;
  overview: string;
  challenge: string;
  outcome: string;
  stack: string[];
};

export const projects: ProjectEntry[] = [
  {
    slug: "shade",
    name: "SHADE",
    category: "professional",
    visual: "abstract",
    accent: "#52dbc2",
    visualLabel: "Synthetic traffic",
    type: "AI / Security",
    timeline: "2025 - 2026",
    summary: "Human-like network traffic for sharper cyber testing.",
    overview:
      "SHADE focused on making cyber-defense evaluation more realistic by generating human-like activity patterns that defenders could test against.",
    challenge:
      "The work had to feel believable enough to be useful, not just technically correct. That meant treating simulation quality and system behavior as product problems, not only engineering tasks.",
    outcome:
      "The result was a stronger testing concept for adversarial simulation, with clearer emphasis on realism, repeatability, and evaluation value.",
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
    summary: "Live audience analytics built for event operators.",
    overview:
      "knw. is an AI-driven platform for analyzing audience attention and emotion data during live events through dashboards and reporting workflows.",
    challenge:
      "The product had to turn complex event data into something operators could understand quickly while still supporting backend processing and cloud integrations.",
    outcome:
      "The work pushed toward clearer dashboards, stronger data flows, and a more useful analytics surface for real event environments.",
    stack: ["TypeScript", "AWS", "Dashboards"]
  },
  {
    slug: "fitgame",
    name: "FitGame",
    category: "personal",
    visual: "image",
    image: fitgame_login,
    imageAlt: "FitGame login screen",
    accent: "#62c3ff",
    visualLabel: "Gamified health",
    type: "Product / Mobile-style concept",
    timeline: "2024",
    summary: "Fitness tracking framed like a progression system.",
    overview:
      "FitGame explored how health tracking could feel more motivating by borrowing progression cues from games instead of relying on dry utility-only patterns.",
    challenge:
      "The main challenge was balancing playful interaction with enough structure that the product still felt credible as a daily-use tool.",
    outcome:
      "The concept became a strong personal design exercise in game loops, UX framing, and visual motivation systems.",
    stack: ["Product Design", "UX", "Game Loops"]
  },
  {
    slug: "wii-portfolio",
    name: "Wii Portfolio",
    category: "personal",
    visual: "image",
    image: wii_menu,
    imageAlt: "Wii-inspired menu interface",
    accent: "#83dbff",
    visualLabel: "Nintendo-inspired UI",
    type: "Frontend / Personal",
    timeline: "2025 - Present",
    summary: "A Nintendo-leaning portfolio with stronger 2D structure.",
    overview:
      "This site started as an experimental Wii-inspired interface and evolved into a more structured portfolio that mixes playful references with cleaner frontend design.",
    challenge:
      "The key constraint was preserving personality without letting nostalgia overpower usability, readability, or the actual portfolio content.",
    outcome:
      "The project now serves as both a portfolio and a frontend design exercise in adapting a recognizable reference into a more modern browsing experience.",
    stack: ["React", "Motion", "UI Systems"]
  }
];

export const projectTabs: Array<{ id: ProjectCategory; label: string }> = [
  { id: "personal", label: "Personal" },
  { id: "professional", label: "Professional" }
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
