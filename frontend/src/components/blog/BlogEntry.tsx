import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogSection, getEntryBySlug } from "./blogEntries";

type BlogEntryProps = {
  section: BlogSection;
};

const BlogEntry: React.FC<BlogEntryProps> = ({ section }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getEntryBySlug(section, slug) : undefined;

  if (!entry) {
    return (
      <div className="portfolioPageShell">
        <div className="portfolioPageBackdrop" />
        <main className="portfolioPage">
          <button
            type="button"
            className="pageBackButton"
            onClick={() => navigate(section === "personal" ? "/blog/personal" : "/blog/professional")}
          >
            Back
          </button>
          <section className="pageHeroCard">
            <h1>Entry not found</h1>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage">
        <button
          type="button"
          className="pageBackButton"
          onClick={() => navigate(section === "personal" ? "/blog/personal" : "/blog/professional")}
        >
          Back to entries
        </button>

        <article className="blogEntryArticle">
          <p className="blogEntryDate">{entry.date}</p>
          <h1>{entry.title}</h1>
          {entry.content.map((paragraph, index) => (
            <p key={`${entry.slug}-p-${index}`}>{paragraph}</p>
          ))}
        </article>
      </main>
    </div>
  );
};

export default BlogEntry;
