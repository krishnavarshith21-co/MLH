import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/landing/Hero';
import { ProductPreview } from '../components/landing/ProductPreview';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { TechSection } from '../components/landing/TechSection';
import { FinalCTA } from '../components/landing/FinalCTA';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductPreview />
        <ProblemSection />
        <SolutionSection />
        <WorkflowSection />
        <TechSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

