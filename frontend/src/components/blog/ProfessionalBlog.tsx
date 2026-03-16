import React from "react";
import { useNavigate } from "react-router-dom";
import { professionalEntries } from "./blogEntries";

const ProfessionalBlog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage blogListPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/blog")}>
          Back to blog
        </button>

        <section className="blogListShell">
          <div className="blogListHeader">Professional Entries</div>
          <div className="blogListScroller">
            {professionalEntries.map((entry, index) => (
              <button
                key={entry.slug}
                type="button"
                className="blogListCard"
                onClick={() => navigate(`/blog/professional/${entry.slug}`)}
              >
                <span className="blogListIndex">{index + 1}</span>
                <div className="blogListText">
                  <p className="blogEntryDate">{entry.date}</p>
                  <h2>{entry.title}</h2>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfessionalBlog;
