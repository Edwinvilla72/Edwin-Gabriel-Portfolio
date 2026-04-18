import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import knwEventReportImage from "../../assets/images/Projects/knw_event-report.png";
import oltreFoundryImage from "../../assets/images/Projects/Oltre-Foundry.jpg";
import shadeDashboardImage from "../../assets/images/Projects/SHADE_Dashboard.jpg";
import "../styles/styles.css";

type DetailRow = {
  label: string;
  value: string;
  note?: string;
};

type EmployerSpan = {
  company: string;
  role: string;
  dates: string;
  summary: string;
};

type PortfolioProject = {
  title: string;
  employer: string;
  role: string;
  timeline: string;
  imageSrc?: string;
  imageAlt?: string;
  summary: string;
  rationale: string;
  background: string;
  work: string[];
  academics: string[];
  results: string[];
  visualNote: string;
  learning: string;
  doDifferently: string;
  futureValue: string;
};

type PortfolioSectionId = "part-a" | "part-b" | "part-c";

type PortfolioSection = {
  id: PortfolioSectionId;
  label: string;
  title: string;
  lead: string;
  cardTitle: string;
  cardSummary: string;
};

const modalTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1]
} as const;

const getProjectAnchorId = (index: number) => `internship-project-${index + 1}`;

const partADetails: DetailRow[] = [
  { label: "Student", value: "Edwin Gabriel Villanueva" },
  {
    label: "Employers",
    value: "Command Post Technologies / Entertainment Technology Partners"
  },
  {
    label: "Supervisors",
    value: "Joseph Pizzoferrato / Michael J Clauss",
    note: "CPT internship supervision transitioned into ETP supervision during the same course window."
  },
  {
    label: "Internship course period",
    value: "June 3, 2025 through the ETP transition beginning February 9, 2026"
  },
  {
    label: "Credit hours",
    value: "3 credit hours",
    note: "This page is structured around three featured projects to match the course requirement."
  }
];

const employerTimeline: EmployerSpan[] = [
  {
    company: "Command Post Technologies",
    role: "AI Software Engineer Intern",
    dates: "June 3, 2025 - February 6, 2026",
    summary: "Defense-oriented AI, simulation, internal tools, and model security work."
  },
  {
    company: "Entertainment Technology Partners",
    role: "Full Stack Software Developer",
    dates: "Started February 9, 2026",
    summary: "Audience analytics, dashboards, and event-facing product engineering."
  }
];

const portfolioProjects: PortfolioProject[] = [
  // SHADE
  {
    title: "SHADE",
    employer: "Command Post Technologies",
    role: "AI Software Engineer Intern",
    timeline: "Project 1",
    imageSrc: shadeDashboardImage,
    imageAlt: "SHADE dashboard view",
    summary: "Simulated Human Agents for Defense Emulation (SHADE). Simulation-focused work around realistic network behavior and adversarial traffic patterns.",
    rationale:
      "I chose this project because it best showed how my coursework in full-stack software development, software engineering, and AI integration translated into real-world development work.",
    background:
      "SHADE focuses on making simulated activity more believable and more useful for testing. The challenge was not simply creating traffic, but creating behavior that felt credible enough to improve the value of defensive training in the cyber domain.",
    work: [
      "Built and adjusted agent behavior patterns used to emulate realistic network activity.",
      "Worked on repeatability and control so system output was more useful for testing workflows.",
      "Helped shape how the simulation could be tuned and reviewed rather than treated as a one-off experiment."
    ],
    academics: [
      "Applied algorithmic thinking to behavior design and simulation of reasoning.",
      "Used software engineering principles to write scalable code and work effectively on a development team.",
      "Applied AI computer/browser usage automation I learned through my Senior Design 1/2 project to assist with agentic processes."
    ],
    results: [
      "Contributed to more realistic and repeatable cyber testing scenarios.",
      "Improved my understanding of how to build projects using unique technology stacks (as opposed to established stacks like MERN or LAMP).",
      "Strengthened my ability to build software that utilizes libraries and large language model APIs."
    ],
    visualNote:
      "Insert a supervisor-approved screenshot, redacted system diagram, or workflow capture showing the simulation environment without exposing sensitive details.",
    learning:
      "I learned that believable synthetic behavior is much harder than simply generating output. The project forced me to think about realism, repeatability, and usefulness at the same time, which is different from building a feature that only needs to function once in a controlled environment. It also showed me how AI-related work in industry is usually judged by whether it improves a larger system, not by whether the underlying idea sounds interesting on its own. That perspective strengthened the way I think about engineering quality, because the standard became practical value rather than novelty.",
    doDifferently:
      "If I repeated the work, I would define evaluation criteria earlier and make those criteria visible throughout development. Doing that sooner would have made it easier to compare iterations, explain decisions, and measure whether the system was becoming more useful instead of only becoming more complex. I would also document tuning decisions more aggressively so future adjustments could be made with less guesswork. That change would make the project easier to maintain and easier for other contributors to build on.",
    futureValue:
      "This project directly supports my long-term interest in AI systems, simulation, and security-focused engineering. It connected academic concepts like algorithms, automation, and system design to a real environment where the software had to support a broader operational purpose. Professionally, it gave me stronger judgment about how to build tools that are evaluated by reliability and usefulness rather than by surface-level output. That is the kind of engineering mindset I want to carry into future AI and full-stack roles."
  },
  // OLTRE FOUNDRY
  {
    title: "Oltre Foundry",
    employer: "Command Post Technologies",
    role: "AI Software Engineer Intern",
    timeline: "Project 2",
    imageSrc: oltreFoundryImage,
    imageAlt: "Oltre Foundry interface view",
    summary: "Frontend-facing tool-suite work centered on presenting CPT software clearly and making project navigation easier for users.",
    rationale:
      "I included this project because it showed a different side of my work, including the frontend experience used to present complex systems clearly.",
    background:
      "Oltre Foundry aimed at making CPT software easier to understand and navigate from the user's perspective. The work mattered because even strong technical tools lose value if the presentation layer is confusing, inconsistent, or hard to move through.",
    work: [
      "Contributed to frontend presentation decisions for how CPT tools were surfaced to users.",
      "Worked on the structure and flow used to move between projects in a more coherent way.",
      "Focused on making the interface feel clearer and more intentional instead of purely functional."
    ],
    academics: [
      "Applied interface design and software engineering concepts to information flow and usability.",
      "Used human-computer interaction ideas when thinking about clarity, navigation, and cognitive load.",
      "Connected classroom frontend knowledge with a real product context where presentation quality affected usability."
    ],
    results: [
      "Helped shape a cleaner path through multiple CPT tools and projects.",
      "Improved my eye for how frontend structure changes the way users perceive technical products.",
      "Showed that presentation and navigation are part of the software quality, not decoration added later."
    ],
    visualNote:
      "Insert a supervisor-approved interface crop, navigation mockup, or redacted frontend screenshot showing how users move through the tool suite.",
    learning:
      "I learned that frontend presentation is not separate from engineering quality. If the structure is unclear, the product feels harder to trust no matter how capable the underlying tool is. This project made me think more carefully about navigation, pacing, and how much context a user needs before they can use a tool with confidence. It also reinforced that interface work is not decoration added at the end of development. It is part of how a system communicates reliability, clarity, and intent.",
    doDifferently:
      "If I revisited the project, I would prototype more navigation patterns earlier so usability tradeoffs could be compared before implementation settled in. I would also test those patterns against more realistic user flows rather than only thinking about the interface from the builder's perspective. That would help surface confusion points sooner and reduce the risk of polishing a structure that is still not the clearest one. A more deliberate prototype phase would likely make later design decisions faster and more defensible.",
    futureValue:
      "This project supports my long-term interest in building software that is both technically strong and intentionally presented. Academically, it connected software engineering and human-computer interaction ideas to a real product context where clarity affected usability in a direct way. Professionally, it sharpened my ability to think beyond the underlying system and pay attention to how the user actually experiences the product. That balance between capability and presentation is something I want to keep developing in future frontend and full-stack work."
  },
  {
    title: "knw.",
    employer: "Entertainment Technology Partners",
    role: "Full-Stack Software Developer",
    timeline: "Project 3",
    imageSrc: knwEventReportImage,
    imageAlt: "knw. event report dashboard",
    summary: "Audience analytics platform work focused on dashboards, data processing, and event-facing insight delivery.",
    rationale:
      "I chose this project because it aligns with my desired career path as a full-stack software engineer. I learned a lot about development from an entertainment perspective (as opposed to defense), and we used different practices, which I thought would be important to highlight.",
    background:
      "knw. centers on audience attention and emotion analytics for live events. Audience reactions are measured and displayed in a digestible manner so clients can understand what worked well in their events, including shows, keynotes, and concerts.",
    work: [
      "Built and refined features which the user directly interacts with (including representations of data like charts and percentages).",
      "Worked on data processing flow tied to audience analytics and event feedback.",
      "Contributed to product behavior that made technical signals clearer and more useful for operators."
    ],
    academics: [
      "Applied software engineering principles to feature delivery in a production-style environment.",
      "Used data-oriented reasoning to think about signal handling, dashboards, and output clarity.",
      "Utilized continuous integration and continuous deployment (CI/CD) for ease of development.",
      "Connected classroom knowledge in algorithms, AWS, and accessibility to a live full-stack product context."
    ],
    results: [
      "Contributed to a real product with direct operational value.",
      "Strengthened my confidence working across frontend and backend responsibilities.",
      "Showed clear professional growth from internship-style experimentation into product execution."
    ],
    visualNote:
      "Insert a supervisor-approved dashboard screenshot, cropped interface state, or redacted product view that demonstrates the work without exposing protected customer or company information.",
    learning:
      "I learned how much stronger software becomes when technical output is translated into something a user can interpret quickly and act on confidently. This project pushed me to think about the full path from raw information to user-facing decision-making, not just the individual features in between. It also strengthened my understanding of production-minded development, because the software had to feel useful in a real product setting rather than only being technically correct. That experience made me more confident working across frontend and backend concerns in the same project.",
    doDifferently:
      "If I revisited the work, I would push even earlier on aligning technical implementation with the exact decisions operators needed to make from the dashboard. I would also spend more time identifying which signals mattered most to end users before committing to specific interface or data-flow choices. That would make it easier to prioritize the highest-value outputs and reduce time spent on details that do not change user decisions in a meaningful way. A tighter link between implementation and operator needs would make the product stronger from the beginning.",
    futureValue:
      "This project supports my future work as a full-stack engineer by tying interface design, data handling, and product execution together in one system. It showed me how academic knowledge in software engineering, cloud tools, accessibility, and data-driven thinking becomes more valuable when it is applied in a live product context. Professionally, it gave me a clearer picture of the kind of product work I want to keep doing: software that combines technical depth with direct user value. It also confirmed that I want to keep building systems where the frontend and backend both matter to the overall quality of the result."
  }
];

const finalChecklist = [
  "Keep the final project count aligned with your enrolled credit hours.",
  "Only include visuals that both CPT and ETP approve for external presentation.",
  "Have both supervisors review the page for factual accuracy where needed.",
  "Redact or remove any confidential company information before final upload."
];

const portfolioSections: PortfolioSection[] = [
  {
    id: "part-a",
    label: "Part A",
    title: "Course context",
    lead: "Course setup, employer timeline, and the approved CPT-to-ETP transition.",
    cardTitle: "Context",
    cardSummary: "Course setup and employer path."
  },
  {
    id: "part-b",
    label: "Part B",
    title: "Projects and applied academic knowledge",
    lead: "Three representative projects showing how coursework translated into simulation work, product decisions, and full-stack delivery.",
    cardTitle: "Projects",
    cardSummary: "Featured work and applied coursework."
  },
  {
    id: "part-c",
    label: "Part C",
    title: "Reflection and learnings",
    lead: "A fuller reflection on why I selected each project, what I learned from it, what I would change, and how the work connects to my academic and professional development.",
    cardTitle: "Reflection",
    cardSummary: "Key learnings and next-step thinking."
  }
];

const renderPortfolioSection = (sectionId: PortfolioSectionId) => {
  if (sectionId === "part-a") {
    const internshipWindow = employerTimeline.map((item) => item.dates).join(" -> ");
    const compactDetails = [
      {
        label: "Student / course",
        value: "Edwin Gabriel Villanueva / 3 credit hours",
        note: "Three featured projects."
      },
      {
        label: "Employers",
        value: "Command Post Technologies -> Entertainment Technology Partners"
      },
      {
        label: "Supervision",
        value: "Joseph Pizzoferrato -> Michael J Clauss",
        note: "Transitioned with the employer change."
      }
    ];

    return (
      <div className="internshipContextLayout">
        <div className="internshipAtAGlance">
          <article className="internshipHighlightCard">
            <span>Course window</span>
            <strong>{internshipWindow}</strong>
            <p>One continuous internship sequence.</p>
          </article>

          <article className="internshipHighlightCard">
            <span>Course structure</span>
            <strong>3 credit hours / 3 featured projects</strong>
            <p>Built to match the course requirement directly.</p>
          </article>

          <article className="internshipHighlightCard">
            <span>Supervision</span>
            <strong>Joseph Pizzoferrato and Michael J Clauss</strong>
            <p>Oversight shifted with the role change.</p>
          </article>
        </div>

        <div className="internshipFacts internshipFactsCompact">
          {compactDetails.map((detail) => (
            <article key={detail.label} className="internshipFactRow">
              <span>{detail.label}</span>
              <div>
                <strong>{detail.value}</strong>
                {detail.note ? <p>{detail.note}</p> : null}
              </div>
            </article>
          ))}
        </div>

        <div className="internshipContextTimelineShell">
          <div className="internshipEmployerFlowHeader">
            <span>Employer transition</span>
          </div>

          <div className="internshipEmployerFlow internshipEmployerFlowContext">
          {employerTimeline.map((item) => (
            <article key={item.company} className="internshipEmployerStop">
              <p>{item.dates}</p>
              <h3>{item.company}</h3>
              <strong>{item.role}</strong>
              <span>{item.summary}</span>
            </article>
          ))}
          </div>
        </div>
      </div>
    );
  }

  if (sectionId === "part-b") {
    return (
      <div className="internshipCaseStudyStack">
        {portfolioProjects.map((project, index) => (
          <article
            key={project.title}
            id={getProjectAnchorId(index)}
            className={`internshipCaseStudy ${index % 2 === 1 ? "reverse" : ""}`}
          >
            <div className="internshipCaseHeader">
              <p className="wiiEyebrow">{project.timeline}</p>
              <h3>{project.title}</h3>
              <div className="internshipCaseMeta">
                <span>{project.employer}</span>
                <span>{project.role}</span>
              </div>
              <p className="internshipCaseSummary">{project.summary}</p>
            </div>

            <div className="internshipVisualStrip">
              <span>Visual Documentation</span>
              {project.imageSrc ? (
                <div className="internshipVisualMedia">
                  <img src={project.imageSrc} alt={project.imageAlt ?? `${project.title} project visual`} />
                </div>
              ) : null}
            </div>

            <div className="internshipCaseBody">
              <section>
                <h4>Why this project</h4>
                <p>{project.rationale}</p>
              </section>
              <section>
                <h4>Background / purpose</h4>
                <p>{project.background}</p>
              </section>
              <section>
                <h4>What I worked on</h4>
                <ul className="pageList">
                  {project.work.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h4>Academic knowledge applied</h4>
                <ul className="pageList">
                  {project.academics.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h4>Results</h4>
                <ul className="pageList">
                  {project.results.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="internshipReflectionStream">
      {portfolioProjects.map((project) => (
        <article key={`${project.title}-reflection`} className="internshipReflectionEntry">
          <p className="wiiEyebrow">{project.title}</p>
          <div className="internshipReflectionColumns">
            <section>
              <h4>What I learned</h4>
              <p>{project.learning}</p>
            </section>
            <section>
              <h4>If I did it again</h4>
              <p>{project.doDifferently}</p>
            </section>
            <section>
              <h4>How it helps me going forward</h4>
              <p>{project.futureValue}</p>
            </section>
          </div>
        </article>
      ))}
    </div>
  );
};

// const internshipHighlights = ["CPT -> ETP", "3 featured projects", "AI to full stack"];

const InternshipPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [activeSectionId, setActiveSectionId] = useState<PortfolioSectionId | null>(null);
  const modalBodyRef = useRef<HTMLDivElement | null>(null);

  const activeSection = useMemo(
    () => portfolioSections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId]
  );

  useEffect(() => {
    if (!activeSection) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSectionId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSection]);

  const scrollToProject = (projectIndex: number) => {
    const container = modalBodyRef.current;

    if (!container) {
      return;
    }

    const target = container.querySelector<HTMLElement>(`#${getProjectAnchorId(projectIndex)}`);

    if (!target) {
      return;
    }

    const jumpBar = container.querySelector<HTMLElement>(".internshipProjectJumpBar");
    const jumpBarOffset = jumpBar ? jumpBar.getBoundingClientRect().height + 20 : 20;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const nextScrollTop =
      container.scrollTop + (targetRect.top - containerRect.top) - jumpBarOffset;

    container.scrollTo({
      top: Math.max(0, nextScrollTop),
      behavior: "smooth"
    });
  };

  return (
    <div className="portfolioPageShell internshipPortfolioShell">
      <div className="portfolioPageBackdrop internshipPortfolioBackdrop" />
      <main className="portfolioPage internshipPortfolioPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        <section className="internshipMasthead">
          <div className="internshipMastheadCopy">
            <p className="wiiEyebrow">Spring 2026 - ISD4947</p>
            <h1>Portfolio Project</h1>
          </div>
          <p className="internshipMastheadLead">
            A record of my internship work across Command Post Technologies and Entertainment
            Technology Partners, covering AI systems, product design decisions, and full stack
            engineering work completed during the course period.
          </p>
        </section>

        <section className="internshipChannelSection">
          <div className="internshipBandLabel">
            <p className="wiiEyebrow">Portfolio Project Sections</p>
            <h2>Portfolio Project Sections</h2>

          </div>

          <div className="channelGrid internshipChannelGrid" aria-label="Internship portfolio sections">
            {portfolioSections.map((section) => (
              <motion.button
                key={section.id}
                type="button"
                className="channelCard internshipChannelButton"
                onClick={() => setActiveSectionId(section.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.985 }}
              >
                <p>{section.label}</p>
                <h3>{section.cardTitle}</h3>
                <span>{section.cardSummary}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="internshipExitCallout">
          <div className="internshipExitCalloutCopy">
            <p>
              For more information about me, my professional experiences, or my projects,
              please take a look at the rest of my website!
            </p>
          </div>

          <motion.button
            type="button"
            className="pageBackButton internshipExitCalloutButton"
            onClick={() => navigate("/")}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
          >
            Go to Main Menu
          </motion.button>
        </section>


        <AnimatePresence>
          {activeSection ? (
            <>
              <motion.button
                type="button"
                className="projectModalBackdrop"
                aria-label="Close section details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={modalTransition}
                onClick={() => setActiveSectionId(null)}
              />

              <motion.section
                className="projectModalShell internshipSectionModalShell"
                role="dialog"
                aria-modal="true"
                aria-labelledby="internship-section-modal-title"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.985 }}
                transition={modalTransition}
              >
                <div className="internshipSectionModal">
                  <header className="internshipSectionModalHeader">
                    <div className="internshipSectionModalTitleGroup">
                      <p className="wiiEyebrow">{activeSection.label}</p>
                      <h2 id="internship-section-modal-title">{activeSection.title}</h2>
                      <p className="internshipSectionModalLead">{activeSection.lead}</p>
                    </div>
                    <button
                      type="button"
                      className="projectModalCloseButton"
                      onClick={() => setActiveSectionId(null)}
                    >
                      Close
                    </button>
                  </header>

                  <div className="internshipSectionModalBody" ref={modalBodyRef}>
                    {activeSection.id === "part-b" ? (
                      <div className="internshipProjectJumpBar" aria-label="Jump to project">
                        {portfolioProjects.map((project, index) => (
                          <button
                            key={`${project.title}-jump`}
                            type="button"
                            className="internshipProjectJumpButton"
                            onClick={() => scrollToProject(index)}
                          >
                            {project.title}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {renderPortfolioSection(activeSection.id)}
                  </div>
                </div>
              </motion.section>
            </>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default InternshipPortfolio;
