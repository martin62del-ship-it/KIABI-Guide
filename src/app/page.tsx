"use client";

import { useEffect } from "react";
import { TopBar } from "@/components/chrome/TopBar";
import { Footer } from "@/components/chrome/Footer";
import { Hero } from "@/components/landing/Hero";
import { ServiceTeasers } from "@/components/landing/ServiceTeasers";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { trackLandingViewed } from "@/lib/analytics/client";

export default function LandingPage() {
  useEffect(() => {
    trackLandingViewed();
  }, []);

  return (
    <main className="relative min-h-dvh">
      <TopBar />
      <Hero />
      <ServiceTeasers />
      <HowItWorks />
      <Footer />
    </main>
  );
}
