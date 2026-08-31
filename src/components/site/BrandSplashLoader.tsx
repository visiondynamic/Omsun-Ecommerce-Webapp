import { useState, useEffect } from "react";
import omsunLogo from "@/assets/Omsun Nepal logo-WA0006.webp";

export function BrandSplashLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show ONLY the logo for 3 seconds, then fade out smoothly
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2800);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-[#04160f] transition-opacity duration-500 select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(circle at 50% 50%, #06281b 0%, #03140e 65%, #020d09 100%)",
      }}
    >
      {/* Ambient emerald backlight aura */}
      <div className="absolute size-80 sm:size-96 rounded-full bg-[#03C987]/15 blur-[100px] pointer-events-none animate-pulse" />

      {/* Pure centered OMSUN Logo */}
      <div className="relative z-10 flex items-center justify-center p-4">
        <img
          src={omsunLogo}
          alt="OMSUN Nepal"
          className="h-20 sm:h-28 md:h-32 w-auto max-w-[280px] sm:max-w-[360px] object-contain drop-shadow-[0_0_24px_rgba(3,201,135,0.45)] brightness-110 animate-[pulse_2s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );
}
