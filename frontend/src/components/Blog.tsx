import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Blog() {
  const navigate = useNavigate();

  // Create refs for each button sound if you want a separate instance per button.
   const hoverSoundRef = useRef<HTMLAudioElement>(null);

  // Function to play sound from the ref
  const playHoverSound = () => {
    // Reset audio in case it's already playing
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "30%",
        width: "100%",
        textAlign: "center",
        zIndex: 2,
      }}
    >
      <h1 style={{ fontWeight: 700, fontSize: "2.5rem", margin: "0 0 0.5rem 0" }}>
        Blog
      </h1>
      <p style={{ fontSize: "1.3rem", margin: 0 }}>
        Please select the blog you would like to explore...
      </p>

      {/* Hidden audio element */}
      <audio ref={hoverSoundRef} src="../../public/sounds/hover1.wav" preload="auto" />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          marginTop: "2.5rem",
          height: "95px",
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
