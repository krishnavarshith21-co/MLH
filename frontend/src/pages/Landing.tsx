import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/landing/Hero';
import { SolutionSection } from '../components/landing/SolutionSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { TechSection } from '../components/landing/TechSection';
import { FinalCTA } from '../components/landing/FinalCTA';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090D14] text-[#F2F0EA] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* View 1: Landing Page (Hero + 3D Dependency Network) */}
        <Hero />

        {/* View 2: Features Section */}
        <SolutionSection />

        {/* View 3: How It Works Section */}
        <WorkflowSection />

        {/* View 4: Open Source Section */}
        <TechSection />

        {/* View 14: Final CTA Section */}
        <FinalCTA />
      </main>
      {/* View 15: Footer */}
      <Footer />
    </div>
  );
}
