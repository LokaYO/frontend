import React, { useState } from "react";
import {
  LandingNavbar,
  LandingHero,
  LandingFeatures,
  LandingTemplates,
  LandingHowItWorks,
  LandingCtaBanner,
  LandingFooter,
} from "../components/landing";

interface Props {
  onTryNow: () => void;
  onLogin: () => void;
  onAdminLogin?: () => void;
}

export const LandingPage: React.FC<Props> = ({
  onTryNow,
  onLogin,
  onAdminLogin,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleTryNow = () => {
    setIsNavigating(true);
    setTimeout(() => {
      onTryNow();
    }, 200);
  };

  const handleLogin = () => {
    setIsNavigating(true);
    setTimeout(() => {
      onLogin();
    }, 200);
  };

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={`min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#425B9A]/20 selection:text-[#425B9A] scroll-smooth transition-all duration-200 ${
        isNavigating
          ? "opacity-60 scale-[0.995] pointer-events-none"
          : "opacity-100"
      }`}
    >
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#425B9A] via-[#76C0EC] to-[#425B9A] animate-pulse z-50" />
      )}

      <LandingNavbar
        onLogin={handleLogin}
        onTryNow={handleTryNow}
        onScrollTo={scrollToSection}
      />

      <main>
        <LandingHero
          onTryNow={handleTryNow}
          onScrollTo={scrollToSection}
        />
        <LandingFeatures />
        <LandingTemplates onTryNow={handleTryNow} />
        <LandingHowItWorks />
        <LandingCtaBanner onTryNow={handleTryNow} />
      </main>

      <LandingFooter
        onTryNow={handleTryNow}
        onLogin={handleLogin}
        onScrollTo={scrollToSection}
        onAdminLogin={onAdminLogin}
      />
    </div>
  );
};
