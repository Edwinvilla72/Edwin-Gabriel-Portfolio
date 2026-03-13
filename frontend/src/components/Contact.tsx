import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const contactLinks = [
  {
    label: "Email",
    value: "edwin.villa2@icloud.com",
    href: "mailto:edwin.villa2@icloud.com"
  },
  {
    label: "GitHub",
    value: "github.com/Edwinvilla72",
    href: "https://github.com/Edwinvilla72"
  }
];

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        <section className="pageHeroCard">
          <p className="wiiEyebrow">Contact</p>
          <h1>Reach out directly or browse the work in public.</h1>
          <p className="pageLead">
            If you want to talk about projects, internships, software engineering,
            or opportunities aligned with where I am headed, these are the clearest places to start.
          </p>
        </section>

        <section className="contactGrid">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              className="contactCard"
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <p className="wiiEyebrow">{link.label}</p>
              <h2>{link.value}</h2>
            </a>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Contact;
