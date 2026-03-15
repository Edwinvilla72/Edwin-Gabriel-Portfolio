import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";


// TODO: ADD WORK-RELATED BACKGROUND WITH OPAQUE BLACK HUE TO EXPERIENCE SECTION (change text to white)


/* ===== images ===== */
// my beautiful face (three times)
import meHeadshot from "../../assets/images/Me/Headshot.jpeg";
import meCasual from "../../assets/images/Me/Casual.jpeg"
import meYoung from "../../assets/images/Me/lilMe.jpeg";

// Education
import ucfLogo from "../../assets/images/Education/ucf-logo.png";
import ucfBg from "../../assets/images/Education/UCF_BG.jpg";
import irscLogo from "../../assets/images/Education/IRSL_Logo.jpg";
import irscBg from "../../assets/images/Education/IRSC_BG.jpg";

// Work Experience (in the field)
import cptLogo from "../../assets/images/Experience/CPTLogo.svg";
import cpt_bg from "../../assets/images/Experience/cpt_bg.jpg";
import etpLogo from "../../assets/images/Experience/EtpLogo1.png";
import etp_bg from "../../assets/images/Experience/etp-bg.jpg";

type SectionId = "about" | "education" | "experience";
type SchoolId = "ucf" | "irsc";
type JobId = "cpt" | "etp";

type AboutRow = {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  placeholder: string;
};

type School = {
  id: SchoolId;
  label: string;
  background: string;
  logo: string;
  logoAlt: string;
  degree: string;
  time_spent: string;
  description: string;
  relevant_coursework: string; 
  achievements: string;
};

type Job = {
  id: JobId;
  label: string;
  logo: string;
  logoAlt: string;
  title: string;
  time_spent: string;
  background: string;
  description: string;
  projects_worked_on: string;
  tech_stack: string;
};


const sections: Array<{ id: SectionId; label: string }> = [
  { id: "about", label: "About Me" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" }
];

const aboutRows: AboutRow[] = [
  {
    id: "about-core",
    image: meCasual,
    imageAlt: "Casual photo of Edwin Gabriel Villanueva",
    title: "Hi, I'm Edwin!",
    placeholder: "I'm 22 years old, currently pursuing my bachelors degree in Computer Science at UCF, and a Full-Stack Software Developer with Entertainment Technology Partners! I'm passionate about programming, music, and growing as a developer."
  },
  {
    id: "about-style",
    image: meHeadshot,
    imageAlt: "Headshot portrait of Edwin Gabriel Villanueva",
    title: "By Day...",
    placeholder: "I am either finishing my Computer Science degree at UCF, or developing software at Entertainment Technology Partners! If I'm not working, I'm on a drive, spending time with friends, or solving world hunger (because I'm just so cool and awesome)."
  },
  {
    id: "about-history",
    image: meYoung,
    imageAlt: "Childhood photo of Edwin Gabriel Villanueva",
    title: "And By Night...",
    placeholder: "I'm probably still doing some kind of work to be honest. But when I'm not, I love to read/write poetry, sing, and to learn about technology and how the mind works."
  }
];

const schools: School[] = [
  {
    id: "ucf",
    label: "University of Central Florida",
    background: ucfBg,
    logo: ucfLogo,
    logoAlt: "University of Central Florida logo",

    degree: "Bachelor of Science in Computer Science",
    time_spent: "August 2022 - May 2026",
    description: "UCF provided me experience in programming with regards to data structures, algorithmic thinking, and understanding team dynamics while learning to use tools like Git and Linux. ",
    relevant_coursework: "Software Engineering (MS), Systems Software, Mobile Device Software Development, Object Oriented Programming, Security in Computing, Topics in Cloud Computing and Cybersecurity (AWS), AI Game Programming, Senior Design",
    achievements: "GPA: 3.5, Foundation Exam (94%), Dean's List",

  },
  {
    id: "irsc",
    label: "Indian River State College",
    background: irscBg,
    logo: irscLogo,
    logoAlt: "Indian River State College logo",

    degree: "Associate of Arts - General Studies (Computer Science Track)",
    time_spent: "May 2019 - April 2022",
    description: "My time at IRSC was spent completing GEP requirements and introducing me to programming in an educational context using C++. ",
    relevant_coursework: "Computer Programming in C++, College Computing",
    achievements: "GPA: 3.5, Dean's List",
  }
];

const jobs: Job[] = [
  {
    id: "cpt",
    label: "Command Post Technologies",
    background: cpt_bg,
    logo: cptLogo,
    logoAlt: "Command Post Technologies logo",

    title: "AI Software Engineer (Intern)",
    time_spent: "June, 2025 - February 2026",
    description: "At Command Post Technologies, I developed AI-driven cyber-defense simulation software, building multi-agent systems, reinforcement learning environments, and red-teaming tools to emulate adversarial behavior, automate testing, and strengthen cybersecurity systems used in defense-focused applications.",
    projects_worked_on: "SHADE (simulated human-like agents for defense emulation), CPT Agents (AI-driven in-house Candidate Relationship Management tool), AI Red Team (testing suite for LLM security), Oltre Foundry (Cyber Range tool-suite) ",
    tech_stack: "Python, JavaScript, React, Docker (containerization), Local/Cloud Large Language Model API, FastAPI, Proxmox (virtualization)",
  },
  {
    id: "etp",
    label: "Entertainment Technology Partners",
    background: etp_bg,
    logo: etpLogo,
    logoAlt: "ETP logo",

    title: "Full Stack Software Developer",
    time_spent: "February 2026 - Present",
    description: "At Entertainment Technology Partners, I developed features for the KNW platform, building dashboards, processing engagement analytics, and integrating AWS services to analyze audience emotion and attention data during live events.",
    projects_worked_on: "knw. (AI-driven platform for analyzing audience reactions)",
    tech_stack: "TypeScript, Python, Docker, AWS",
  }
];

const sectionTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.26, ease: "easeOut" }
} as const;

const aboutRowTransition = {
  initial: (direction: number) => ({ opacity: 0, y: direction > 0 ? 36 : -36 }),
  animate: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: direction > 0 ? -36 : 36 }),
  transition: { duration: 0.3, ease: "easeOut" }
} as const;

const tabContentTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.24, ease: "easeOut" }
} as const;

const underlineTransition = {
  duration: 0.24,
  ease: [0.33, 1, 0.68, 1]
} as const;

const AboutMe: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [activeAboutIndex, setActiveAboutIndex] = useState(0);
  const [aboutDirection, setAboutDirection] = useState(1);
  const [aboutIsTransitioning, setAboutIsTransitioning] = useState(false);
  const [activeSchool, setActiveSchool] = useState<SchoolId>("ucf");
  const [activeJob, setActiveJob] = useState<JobId>("cpt");
  const aboutWheelLockRef = useRef(false);
  const aboutWheelDeltaRef = useRef(0);
  const aboutWheelResetTimeoutRef = useRef<number | null>(null);

  const selectedSchool = useMemo(
    () => schools.find((school) => school.id === activeSchool) ?? schools[0],
    [activeSchool]
  );
  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === activeJob) ?? jobs[0],
    [activeJob]
  );
  const activeAboutRow = aboutRows[activeAboutIndex] ?? aboutRows[0];

  useEffect(() => {
    if (activeSection !== "about") {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 10) {
        return;
      }

      event.preventDefault();

      if (aboutWheelLockRef.current || aboutIsTransitioning) {
        return;
      }

      aboutWheelDeltaRef.current += event.deltaY;
      const threshold = 220;
      if (Math.abs(aboutWheelDeltaRef.current) < threshold) {
        if (aboutWheelResetTimeoutRef.current) {
          window.clearTimeout(aboutWheelResetTimeoutRef.current);
        }
        aboutWheelResetTimeoutRef.current = window.setTimeout(() => {
          aboutWheelDeltaRef.current = 0;
          aboutWheelResetTimeoutRef.current = null;
        }, 220);
        return;
      }

      const direction = aboutWheelDeltaRef.current > 0 ? 1 : -1;
      aboutWheelDeltaRef.current = 0;
      if (aboutWheelResetTimeoutRef.current) {
        window.clearTimeout(aboutWheelResetTimeoutRef.current);
        aboutWheelResetTimeoutRef.current = null;
      }
      const next = Math.min(
        aboutRows.length - 1,
        Math.max(0, activeAboutIndex + direction)
      );

      if (next === activeAboutIndex) {
        return;
      }

      aboutWheelLockRef.current = true;
      setAboutIsTransitioning(true);
      setAboutDirection(direction);
      setActiveAboutIndex(next);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (aboutWheelResetTimeoutRef.current) {
        window.clearTimeout(aboutWheelResetTimeoutRef.current);
      }
      aboutWheelResetTimeoutRef.current = null;
      aboutWheelDeltaRef.current = 0;
      aboutWheelLockRef.current = false;
    };
  }, [aboutIsTransitioning, activeAboutIndex, activeSection]);

  const jumpToAboutRow = (index: number) => {
    if (index === activeAboutIndex || aboutIsTransitioning) {
      return;
    }
    setAboutDirection(index > activeAboutIndex ? 1 : -1);
    aboutWheelDeltaRef.current = 0;
    if (aboutWheelResetTimeoutRef.current) {
      window.clearTimeout(aboutWheelResetTimeoutRef.current);
      aboutWheelResetTimeoutRef.current = null;
    }
    aboutWheelLockRef.current = true;
    setAboutIsTransitioning(true);
    setActiveAboutIndex(index);
  };

  return (
    <div className="portfolioPageShell aboutLayoutShell">
      <div
        className={`portfolioPageBackdrop ${
          activeSection === "experience"
            ? "experienceBackdrop"
            : activeSection === "about"
              ? "aboutBackdrop"
              : activeSection === "education"
                ? "educationBaseBackdrop"
                : ""
        }`}
      />
      <AnimatePresence mode="wait">
        {activeSection === "education" ? (
          <motion.div
            key={selectedSchool.id}
            className="aboutEducationBackdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.72)), url(${selectedSchool.background})`
            }}
          />
        ) : null}
      </AnimatePresence>
      <main className="portfolioPage aboutPage">
        <div className="aboutTopBar">
          <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
            Back to dashboard
          </button>

          <div className="aboutTopNavWrap">
            <nav className="aboutTopNav" aria-label="About page sections">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`aboutTopNavItem ${activeSection === section.id ? "active" : ""}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span>{section.label}</span>
                  <AnimatePresence initial={false}>
                    {activeSection === section.id ? (
                      <motion.span
                        className="aboutTopNavUnderline"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={underlineTransition}
                      />
                    ) : null}
                  </AnimatePresence>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeSection === "about" ? (
          <aside className="aboutRowNav" aria-label="About row navigation">
            {aboutRows.map((row, index) => (
              <button
                key={row.id}
                type="button"
                className={`aboutRowNavButton ${index === activeAboutIndex ? "active" : ""}`}
                onClick={() => jumpToAboutRow(index)}
                aria-label={`Go to ${row.title}`}
              >
                <span className="aboutRowNavIndex">{index + 1}</span>
              </button>
            ))}
          </aside>
        ) : null}

        <AnimatePresence mode="wait">
          {activeSection === "about" ? (
            <motion.section key="about" className="aboutSectionStack aboutSectionViewport" {...sectionTransition}>
              <AnimatePresence mode="wait" custom={aboutDirection}>
                <motion.section
                  key={activeAboutRow.id}
                  className={`aboutSplitSection ${activeAboutIndex % 2 === 1 ? "reverse" : ""}`}
                  variants={aboutRowTransition}
                  custom={aboutDirection}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onAnimationStart={() => setAboutIsTransitioning(true)}
                  onAnimationComplete={() => {
                    setAboutIsTransitioning(false);
                    aboutWheelLockRef.current = false;
                  }}
                >
                  <div className="aboutSplitImage">
                    <img src={activeAboutRow.image} alt={activeAboutRow.imageAlt} />
                  </div>
                  <div className="aboutSplitText">
                    <h2>{activeAboutRow.title}</h2>
                    <p>{activeAboutRow.placeholder}</p>
                  </div>
                </motion.section>
              </AnimatePresence>
            </motion.section>
          ) : null}

          {activeSection === "education" ? (
            <motion.section key="education" className="aboutPinnedPage educationPage" {...sectionTransition}>
              <div className="aboutPinnedTabs">
                {schools.map((school) => (
                  <button
                    key={school.id}
                    type="button"
                    className={activeSchool === school.id ? "active" : ""}
                    onClick={() => setActiveSchool(school.id)}
                  >
                    {school.label}
                    <AnimatePresence initial={false}>
                      {activeSchool === school.id ? (
                        <motion.span
                          className="aboutPinnedTabUnderline"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={underlineTransition}
                        />
                      ) : null}
                    </AnimatePresence>
                  </button>
                ))}
              </div>

              <div className="aboutPinnedGrid">
                <AnimatePresence mode="wait">
                  <motion.aside
                    key={`${selectedSchool.id}-logo`}
                    className="aboutPinnedMedia"
                    {...tabContentTransition}
                  >
                    <div className="aboutPinnedSticky">
                      <img
                        src={selectedSchool.logo}
                        alt={selectedSchool.logoAlt}
                        className="aboutPinnedLogo"
                      />
                    </div>
                  </motion.aside>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.section
                    key={`${selectedSchool.id}-content`}
                    className="aboutPinnedContent"
                    {...tabContentTransition}
                  >
                    {/* SCHOOL INFORMATION */}
                    <div className="aboutPlaceholderBlock">
                      <h2 className="education-title">{selectedSchool.label}</h2>
                      <p>{selectedSchool.time_spent}</p>
                      <br/>
                      <p>{selectedSchool.degree}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      {/* <h3>Description</h3> */}
                      <p>{selectedSchool.description}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <h3 className="education-title">Relevant coursework</h3>
                      <p>{selectedSchool.relevant_coursework}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <p>{selectedSchool.achievements}</p>
                    </div>

                  </motion.section>
                </AnimatePresence>
              </div>
            </motion.section>
          ) : null}

          {activeSection === "experience" ? (
            <motion.section 
            key="experience" 
            className="aboutPinnedPage experiencePage" {...sectionTransition}
            // style={{
            //   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.72)), url(${selectedSchool.background})
            // }}
            >
              <div className="aboutPinnedTabs">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className={activeJob === job.id ? "active" : ""}
                    onClick={() => setActiveJob(job.id)}
                  >
                    {job.label}
                    <AnimatePresence initial={false}>
                      {activeJob === job.id ? (
                        <motion.span
                          className="aboutPinnedTabUnderline"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={underlineTransition}
                        />
                      ) : null}
                    </AnimatePresence>
                  </button>
                ))}
              </div>

              <div className="aboutPinnedGrid">
                <AnimatePresence mode="wait">
                  <motion.aside
                    key={`${selectedJob.id}-logo`}
                    className="aboutPinnedMedia experienceLogoPanel"
                    {...tabContentTransition}
                  >
                    <div className="aboutPinnedSticky">
                    <img
                      src={selectedJob.logo}
                      alt={selectedJob.logoAlt}
                      className={`aboutPinnedLogo ${
                        selectedJob.id === "etp" ? "" : ""
                      } ${selectedJob.id === "cpt" ? "cptLogo" : ""}`}
                    />
                  </div>
                </motion.aside>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.section
                    key={`${selectedJob.id}-content`}
                    className="aboutPinnedContent experienceContent"
                    {...tabContentTransition}
                  >
                    <div className="aboutPlaceholderBlock">
                      <h2>{selectedJob.label}</h2>
                      <p>{selectedJob.time_spent}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      {/* <h3>Description</h3> */}
                      <p>{selectedJob.description}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <h3>Projects worked on</h3>
                      <p>{selectedJob.projects_worked_on}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <h3>Tech stack / tools</h3>
                      <p>{selectedJob.tech_stack}</p>
                    </div>
                  </motion.section>
                </AnimatePresence>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AboutMe;
 
