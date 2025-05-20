// Banner.tsx
import React from "react";
import '@fontsource/comfortaa/700.css'; // You can also do this in index.tsx

const Banner: React.FC = () => {
  return (
    <div className="px-6 py-1 text-center bg-[var(--color-primary)]">
      <span
        className="text:xl md:text-xl lg:text-xl"
        style={{
          fontFamily: "'Comfortaa', sans-serif",
          fontWeight: 700,
          color: "var(--color-background)",
          letterSpacing: "0.06em",
        }}
      >
        izvini
      </span>
    </div>
  );
};

export default Banner;