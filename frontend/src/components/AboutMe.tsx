import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

/* ===== images ===== */
// my beautiful face (three times)
import meHeadshot from "../../../assets/images/Me/Headshot.jpeg";
import meCasual from "../../../assets/images/Me/Casual.jpeg"
import meYoung from "../../../assets/images/Me/lilMe.jpeg";

// Education
import ucfLogo from "../../../assets/images/Education/ucf-logo.png";
import ucfBg from "../../../assets/images/Education/UCF_BG.jpg";
import irscLogo from "../../../assets/images/Education/IRSL_Logo.jpg";
import irscBg from "../../../assets/images/Education/IRSC_BG.jpg";

// Work Experience (in the field)
import cptLogo from "../../../assets/images/Experience/CPTLogo.svg";
import etpLogo from "../../../assets/images/Experience/EtpLogo.webp";


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
};

type Job = {
  id: JobId;
  label: string;
  logo: string;
  logoAlt: string;
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
    logo: cptLogo,
    logoAlt: "Command Post Technologies logo",

    title: "AI Software Engineer (Intern)",
    time_spent: "June, 2025 - February 2026",

    tech_stack: "Python, JavaScript, React, Docker (containerization), Local/Cloud Large Language Model API, FastAPI, Proxmox (virtualization)",
  },
  {
    id: "etp",
    label: "Entertainment Technology Partners",
    logo: etpLogo,
    logoAlt: "ETP logo",

    title: "Full Stack Software Developer",
    time_spent: "February 2026 - Present",

    tech_stack: "TypeScript, Python, Docker, AWS",
  }
];

const sectionTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.26, ease: "easeOut" }
} as const;

const AboutMe: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [activeSchool, setActiveSchool] = useState<SchoolId>("ucf");
  const [activeJob, setActiveJob] = useState<JobId>("cpt");

  const selectedSchool = useMemo(
    () => schools.find((school) => school.id === activeSchool) ?? schools[0],
    [activeSchool]
  );
  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === activeJob) ?? jobs[0],
    [activeJob]
  );

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
                  {activeSection === section.id ? (
                    <motion.span
                      layoutId="about-nav-underline"
                      className="aboutTopNavUnderline"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSection === "about" ? (
            <motion.section key="about" className="aboutSectionStack" {...sectionTransition}>
              {aboutRows.map((row, index) => (
                <section
                  key={row.id}
                  className={`aboutSplitSection ${index % 2 === 1 ? "reverse" : ""}`}
                >
                  <div className="aboutSplitImage">
                    <img src={row.image} alt={row.imageAlt} />
                  </div>
                  <div className="aboutSplitText">
                    <h2>{row.title}</h2>
                    <p>{row.placeholder}</p>
                  </div>
                </section>
              ))}
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
                  </button>
                ))}
              </div>

              <div className="aboutPinnedGrid">
                <AnimatePresence mode="wait">
                  <motion.aside
                    key={`${selectedSchool.id}-logo`}
                    className="aboutPinnedMedia"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {/* SCHOOL INFORMATION */}
                    <div className="aboutPlaceholderBlock">
                      <h2 className="education-title">{selectedSchool.label}</h2>
                      <p>{selectedSchool.time_spent}</p>
                      <br/>
                      <p>{selectedSchool.degree}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <p>{selectedSchool.description}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <h2 className="education-title">Relevant coursework</h2>
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
            <motion.section key="experience" className="aboutPinnedPage experiencePage" {...sectionTransition}>
              <div className="aboutPinnedTabs">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className={activeJob === job.id ? "active" : ""}
                    onClick={() => setActiveJob(job.id)}
                  >
                    {job.label}
                  </button>
                ))}
              </div>

              <div className="aboutPinnedGrid">
                <AnimatePresence mode="wait">
                  <motion.aside
                    key={`${selectedJob.id}-logo`}
                    className="aboutPinnedMedia experienceLogoPanel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div className="aboutPinnedSticky">
                    <img
                      src={selectedJob.logo}
                      alt={selectedJob.logoAlt}
                      className={`aboutPinnedLogo ${
                        selectedJob.id === "etp" ? "invertLogo" : ""
                      } ${selectedJob.id === "cpt" ? "cptLogo" : ""}`}
                    />
                  </div>
                </motion.aside>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.section
                    key={`${selectedJob.id}-content`}
                    className="aboutPinnedContent experienceContent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div className="aboutPlaceholderBlock">
                      <h2>{selectedJob.label}</h2>
                      <p>{selectedJob.time_spent}</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <h2>Description</h2>
                      <p>[Write here about what you did at {selectedJob.label}.]</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <h2>Projects worked on</h2>
                      <p>[List the relevant projects, responsibilities, or accomplishments here.]</p>
                    </div>

                    <div className="aboutPlaceholderBlock">
                      <h2>Tech stack / tools</h2>
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
