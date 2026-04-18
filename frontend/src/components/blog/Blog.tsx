import React from "react";
import { useNavigate } from "react-router-dom";

function Blog() {
  const navigate = useNavigate();

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage blogMenuPage">
        <button
          type="button"
          className="pageBackButton"
          onClick={() => navigate("/")}
        >
            Back to dashboard
        </button>

        <section className="blogMenuLegacy">
          <h1>Blog</h1>
          <p>Please select the blog you would like to explore...</p>

          <div className="blogMenuButtons">
            <button
              type="button"
              className="wii-btn"
              onClick={() => navigate("/blog/professional")}
            >
              <img
                src="/Images/Buttons/MenuButton1.png"
                alt="Professional"
                className="wii-btn-bg"
              />
              <span>Professional</span>
            </button>

            <button
              type="button"
              className="wii-btn"
              onClick={() => navigate("/blog/personal")}
            >
              <img
                src="/Images/Buttons/MenuButton1.png"
                alt="Personal"
                className="wii-btn-bg"
              />
              <span>Personal</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Blog;
