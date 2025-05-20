// components/FullscreenToggleButton.tsx
import React, { useEffect, useState } from "react";

const FullScreenToggleButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen();
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (isFullscreen) return null;

  return (
    <button
      onClick={requestFullscreen}
      className="text-white hover:text-gray-200 transition font-semibold"
    >
      Fullscreen
    </button>
  );
};

export default FullScreenToggleButton;
