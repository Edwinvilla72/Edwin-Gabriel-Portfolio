import React from "react";
import { useNavigate } from "react-router-dom";
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

const partADetails: DetailRow[] = [
  { label: "Student", value: "Edwin Gabriel Villanueva" },
  {
    label: "Employers",
    value: "Command Post Technologies and Entertainment Technology Partners"
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
  {
    title: "SHADE",
    employer: "Command Post Technologies",
    role: "AI Software Engineer Intern",
    timeline: "Project 1",
    summary: "Simulation-focused work around realistic network behavior and adversarial traffic patterns.",
    rationale:
      "I chose this project because it best showed how my coursework in AI, systems, and software engineering translated into a real defense-oriented build problem.",
    background:
      "SHADE focused on making simulated activity more believable and more useful for testing. The challenge was not simply creating traffic, but creating behavior that felt credible enough to improve the value of defensive evaluation.",
    work: [
      "Built and adjusted agent behavior patterns used to emulate realistic network activity.",
      "Worked on repeatability and control so system output was more useful for testing workflows.",
      "Helped shape how the simulation could be tuned and evaluated rather than treated as a one-off experiment."
    ],
    academics: [
      "Applied algorithmic thinking to behavior design and state transitions.",
      "Used software engineering principles to structure maintainable logic and clearer system boundaries.",
      "Extended AI coursework into practical agent coordination and systems evaluation."
    ],
    results: [
      "Contributed to more realistic and repeatable cyber testing scenarios.",
      "Improved my understanding of how quality in systems behavior affects downstream usefulness.",
      "Strengthened my ability to build software where realism and control matter at the same time."
    ],
    visualNote:
      "Insert a supervisor-approved screenshot, redacted system diagram, or workflow capture showing the simulation environment without exposing sensitive details.",
    learning:
      "I learned that believable synthetic behavior is much harder than simply generating output. The technical work had to be judged by usefulness, not just by whether it ran.",
    doDifferently:
      "If I repeated the work, I would define evaluation criteria earlier so realism and system usefulness could be measured more consistently throughout development.",
    futureValue:
      "This project directly supports my long-term interest in AI systems, simulation, and security-focused engineering."
  },
  {
    title: "Oltre Foundry",
    employer: "Command Post Technologies",
    role: "AI Software Engineer Intern",
    timeline: "Project 2",
    summary: "Frontend-facing tool-suite work centered on presenting CPT software clearly and making project navigation easier for users.",
    rationale:
      "I included this project because it showed a different side of my work: not just underlying systems, but the frontend experience used to present complex tools in a way people can actually move through.",
    background:
      "Oltre Foundry was aimed at making CPT software easier to understand and navigate from the user side. The work mattered because even strong technical tools lose value if the presentation layer is confusing, inconsistent, or hard to move through.",
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
      "Insert a supervisor-approved interface crop, navigation mockup, or redacted frontend screenshot showing how users move through the tool-suite.",
    learning:
      "I learned that frontend presentation is not separate from engineering quality. If the structure is unclear, the product feels harder to trust no matter how capable the underlying tool is.",
    doDifferently:
      "If I revisited the project, I would prototype more possible navigation patterns earlier so usability tradeoffs could be compared before implementation settled in.",
    futureValue:
      "This project supports my long-term interest in building software that is both technically strong and intentionally presented."
  },
  {
    title: "knw.",
    employer: "Entertainment Technology Partners",
    role: "Full Stack Software Developer",
    timeline: "Project 3",
    summary: "Audience analytics platform work focused on dashboards, data processing, and event-facing insight delivery.",
    rationale:
      "I chose this project because it reflects the approved CPT-to-ETP transition during the same course period and shows how my work expanded into a full stack product environment.",
    background:
      "My original proposal listed the ETP work as to-be-determined because I had not started there yet. Once I joined ETP, knw. became the clearest project to include because it centered on audience attention and emotion analytics for live events and let me contribute in a real product setting.",
    work: [
      "Built and refined dashboard-facing features for the platform.",
      "Worked on data processing flow tied to audience analytics and event feedback.",
      "Contributed to product behavior that made technical signals clearer and more useful for operators."
    ],
    academics: [
      "Applied software engineering principles to feature delivery in a production-style environment.",
      "Used data-oriented reasoning to think about signal handling, dashboards, and output clarity.",
      "Connected classroom knowledge in full stack development to a live product context."
    ],
    results: [
      "Contributed to a real product with direct operational value.",
      "Strengthened my confidence working across frontend and backend responsibilities.",
      "Showed clear professional growth from internship-style experimentation into product execution."
    ],
    visualNote:
      "Insert a supervisor-approved dashboard screenshot, cropped interface state, or redacted product view that demonstrates the work without exposing protected customer or company information.",
    learning:
      "I learned how much stronger software becomes when technical output is translated into something a user can interpret quickly and act on confidently.",
    doDifferently:
      "If I revisited the work, I would push even earlier on aligning technical implementation with the exact decisions operators needed to make from the dashboard.",
    futureValue:
      "This project supports my future work as a full stack engineer by tying interface design, data handling, and product execution together in one system."
  }
];

const finalChecklist = [
  "Keep the final project count aligned with your enrolled credit hours.",
  "Only include visuals that both CPT and ETP approve for external presentation.",
  "Have both supervisors review the page for factual accuracy where needed.",
  "Redact or remove any confidential company information before final upload."
];

const InternshipPortfolio: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="portfolioPageShell internshipPortfolioShell">
      <div className="portfolioPageBackdrop internshipPortfolioBackdrop" />
      <main className="portfolioPage internshipPortfolioPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        {/* title */}
        <section className="internshipMasthead">
            <div className="internshipCaseHeader">
              <h3>Internship Portfolio Project</h3>
            </div>
        </section>

        <section className="internshipBand">
          <div>
            <p className="wiiEyebrow">Part A</p>
            <h2>Internship details</h2>
          </div>

          <div className="internshipFacts">
            {partADetails.map((detail) => (
              <div key={detail.label} className="internshipFactRow">
                <span>{detail.label}</span>
                <div>
                  <strong>{detail.value}</strong>
                  {detail.note ? <p>{detail.note}</p> : null}
                </div>
              </div>
            ))}
          </div>

          <div className="internshipEmployerFlow">
            {employerTimeline.map((item) => (
              <article key={item.company} className="internshipEmployerStop">
                <p>{item.dates}</p>
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <span>{item.summary}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="internshipBand">
          <div >
            <p className="wiiEyebrow">Part B</p>
            <h2>Projects and applied academic knowledge</h2>
          </div>

          <div className="internshipCaseStudyStack">
            {portfolioProjects.map((project, index) => (
              <article
                key={project.title}
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
                  <p>{project.visualNote}</p>
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
        </section>

        <section className="internshipBand">
          <div className="internshipBandLabel">
            <p className="wiiEyebrow">Part C</p>
            <h2>Reflection and learnings</h2>
          </div>

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
        </section>

        <section className="internshipBand internshipBandLast">
          <div className="internshipBandLabel">
            <p className="wiiEyebrow">Submission Notes</p>
            <h2>Final checklist</h2>
          </div>

          <ul className="pageList internshipChecklist">
            {finalChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default InternshipPortfolio;
