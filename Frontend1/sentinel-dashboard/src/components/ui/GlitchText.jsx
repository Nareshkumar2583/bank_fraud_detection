import React from "react";

export default function GlitchText({ text }) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span className="glitch-red" style={{
        position: "absolute", top: 0, left: 0,
        color: "#ff3b3b", clipPath: "inset(30% 0 50% 0)",
        animation: "glitch1 4s infinite", opacity: 0.7,
      }}>{text}</span>
      <span className="glitch-blue" style={{
        position: "absolute", top: 0, left: 0,
        color: "#00d4ff", clipPath: "inset(60% 0 10% 0)",
        animation: "glitch2 4s infinite", opacity: 0.7,
      }}>{text}</span>
      {text}
    </span>
  );
}