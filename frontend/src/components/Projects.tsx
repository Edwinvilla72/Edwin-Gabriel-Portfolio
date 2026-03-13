import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const projects = [
  {
    name: "SHADE",
    type: "AI / Security",
    summary:
      "A project centered on realistic, human-like network traffic generation for more useful testing and simulation."
  },
  {
    name: "FitGame",
    type: "Product / Mobile-style concept",
    summary:
      "A gamified fitness tracker with quests, XP, and leaderboards designed to make consistency more engaging."
  },
  {
    name: "Wii Portfolio",
    type: "Frontend / Personal",
    summary:
      "An experimental portfolio combining a stylized Wii-inspired 3D layer with a stronger 2D dashboard foundation."
  }
];

const Projects: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        <section className="pageHeroCard">
          <p className="wiiEyebrow">Projects</p>
          <h1>Selected work that best shows how I like to build.</h1>
          <p className="pageLead">
            These are the projects that currently define the portfolio: a mix of
            technical depth, product thinking, and a willingness to experiment with presentation.
          </p>
        </section>

        <section className="projectGrid">
          {projects.map((project) => (
            <article key={project.name} className="projectCard">
              <p className="wiiEyebrow">{project.type}</p>
              <h2>{project.name}</h2>
              <p>{project.summary}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Projects;
