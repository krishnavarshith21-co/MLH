import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { TechSection } from '../components/landing/TechSection';
import { Github, Award, Shield, Cpu, BookOpen, ExternalLink } from 'lucide-react';

export function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-xs font-mono text-teal uppercase">
              Hackathon Track 1 Compliance
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-ivory mt-4">
              Open-Source & Open-Weight Foundations
            </h1>
            <p className="text-lg text-secondary-text mt-4">
              VERYNTH is built for <strong>SMRU Hack Day Hyderabad 2026</strong> under the <strong>Best Open-Source / Open-Weight AI Product</strong> track.
            </p>
          </div>

          {/* Hackathon Credentials Card */}
          <div className="rounded-2xl bg-midnight-slate border border-champagne/30 p-8 mb-16 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-4 rounded-xl bg-elevated/60 border border-border">
                <span className="text-secondary-text block mb-1 uppercase tracking-wider">Event & Track</span>
                <p className="text-base font-bold font-heading text-champagne">SMRU Hack Day 2026</p>
                <p className="text-ivory mt-1">Track 1: Open-Weight AI Product</p>
              </div>

              <div className="p-4 rounded-xl bg-elevated/60 border border-border">
                <span className="text-secondary-text block mb-1 uppercase tracking-wider">AI Foundation Model</span>
                <p className="text-base font-bold font-heading text-teal">Qwen2.5-Coder-7B</p>
                <p className="text-ivory mt-1">License: Apache 2.0 (Open-Weight)</p>
              </div>

              <div className="p-4 rounded-xl bg-elevated/60 border border-border">
                <span className="text-secondary-text block mb-1 uppercase tracking-wider">Application License</span>
                <p className="text-base font-bold font-heading text-success">MIT License</p>
                <p className="text-ivory mt-1">Full Source Freedom</p>
              </div>
            </div>
          </div>

          <TechSection />

          {/* Transparent Model Disclosures */}
          <div className="mt-16 rounded-2xl bg-midnight-slate border border-border p-8">
            <h3 className="text-xl font-bold font-heading text-ivory mb-4">
              AI Model Specifications & Verifiability
            </h3>
            <div className="space-y-4 text-sm text-secondary-text leading-relaxed">
              <p>
                <strong className="text-ivory">Model Name:</strong> Qwen2.5-Coder-7B-Instruct (Alibaba Cloud / Qwen Team).
              </p>
              <p>
                <strong className="text-ivory">License:</strong> Apache 2.0 license allowing commercial and non-commercial development, modification, and self-hosting.
              </p>
              <p>
                <strong className="text-ivory">No Fabricated Outputs:</strong> VERYNTH uses real subprocess executions for verification. If the local Ollama inference service is offline during demonstration, the platform transparently falls back to deterministic AST rewrite rules with clear labels rather than pretending a model generated the response.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
