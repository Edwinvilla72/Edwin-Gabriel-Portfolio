import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import "../styles/styles.css";

const emailAddress = "edwin.villa2@icloud.com";
const githubUrl = "https://github.com/Edwinvilla72";

type ContactFormState = {
  name: string;
  subject: string;
  message: string;
};

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    subject: "",
    message: ""
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = formData.subject.trim() || "Portfolio inquiry";
    const body = [
      formData.name.trim() ? `Name: ${formData.name.trim()}` : null,
      "",
      formData.message.trim() || "Hi Edwin,"
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href =
      `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="portfolioPageShell contactMinimalShell">
      <div className="portfolioPageBackdrop contactMinimalBackdrop" />
      <main className="portfolioPage contactMinimalPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        <section className="contactMinimalLayout">
          <div className="contactMinimalIntro">
            <p className="wiiEyebrow">Contact</p>
            <h1>Intrigued? Let me know!</h1>
            <p className="contactMinimalLead">
              Send me a message - I'd love to hear from you! :D
            </p>
            <a
              className="contactInlineLink"
              href={`mailto:${emailAddress}`}
            >
              {emailAddress}
            </a>
          </div>

          <form className="contactMinimalForm" onSubmit={handleSubmit}>
            <label className="contactField">
              <span>Name</span>
              <input
                type="text"
                name="name"
                // placeholder="Please enter your name here..."
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>

            <label className="contactField">
              <span>Subject</span>
              <input
                type="text"
                name="subject"
                // placeholder="Enter subject here..."
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </label>

            <label className="contactField contactFieldMessage">
              <span>Message</span>
              <textarea
                name="message"
                // placeholder="Enter message here..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
              />
            </label>

            <div className="contactMinimalActions">

              {/* <FontAwesomeIcon icon={faGithub} /> */}
              <button type="submit" className="contactPrimaryButton">
                Send message
              </button>
              <a
                className="contactSecondaryButton"
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} />
                <span>GitHub</span>
              </a>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Contact;
