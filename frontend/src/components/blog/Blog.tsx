import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Blog() {
  const navigate = useNavigate();

  const hoverSoundRef = useRef<HTMLAudioElement>(null);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  return (


    <div
      className="blogMenuLegacy"
      style={{
        position: "absolute",
        top: "30%",
        width: "100%",
        textAlign: "center",
        zIndex: 2
      }}
    >

                <button
                  type="button"
                  className="pageBackButton"
                  onClick={() => navigate("/")}
                  style={{ position: "fixed", top: "1.5rem", left: "1.5rem", zIndex: 4 }}
                >
            Back to dashboard
          </button>
      <h1 style={{ fontWeight: 700, fontSize: "2.5rem", margin: "0 0 0.5rem 0" }}>
        Blog
      </h1>
      <p style={{ fontSize: "1.3rem", margin: 0 }}>
        Please select the blog you would like to explore...
      </p>

      <audio ref={hoverSoundRef} src="/assets/sounds/hover.wav" preload="auto" />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          marginTop: "2.5rem",
          height: "95px"
        }}
      >
        <button
          className="wii-btn"
          onClick={() => navigate("/blog/professional")}
          onMouseEnter={playHoverSound}
        >
          <img
            src="/Images/Buttons/MenuButton1.png"
            alt="Professional"
            className="wii-btn-bg"
          />
          <span>Professional</span>
        </button>

        <button
          className="wii-btn"
          onClick={() => navigate("/blog/personal")}
          onMouseEnter={playHoverSound}
        >
          <img
            src="/Images/Buttons/MenuButton1.png"
            alt="Personal"
            className="wii-btn-bg"
          />
          <span>Personal</span>
        </button>
      </div>
    </div>
  );
}

export default Blog;
