import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  Search,
  Sparkles,
  Binary,
  ShieldCheck,
  UserCheck,
  History,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Dependency Intelligence',
    description: 'Detects breaking API changes across your codebase.',
  },
  {
    icon: Sparkles,
    title: 'AI Migration Engine',
    description: 'Generates targeted code patches using Qwen2.5-Coder.',
  },
  {
    icon: Binary,
    title: 'Compatibility Analysis',
    description: 'Python AST analysis to find exact affected locations.',
  },
  {
    icon: ShieldCheck,
    title: 'Automated Verification',
    description: 'Runs pytest in isolated sandbox environments.',
  },
  {
    icon: UserCheck,
    title: 'Developer Approval',
    description: 'Human-in-the-loop review before applying changes.',
  },
  {
    icon: History,
    title: 'Full Migration History',
    description: 'Track, compare and review detailed reports.',
  },
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#090D14] text-[#F2F0EA] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-28">
        <div className="container-enterprise">
          {/* Centered Header: View 2 in reference sheet */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151D2A] border border-[#2B3544] text-[10px] sm:text-[11px] font-body tracking-widest text-[#54C7BE] uppercase mb-4 shadow-sm">
              <span>• KEY CAPABILITIES •</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F2F0EA] tracking-tight">
              Powerful Features for Safer Software Evolution
            </h1>
            <p className="text-base sm:text-lg text-[#9AA7B5] mt-4 leading-relaxed font-body">
              Everything you need to analyze, migrate, and verify dependency upgrades with confidence.
            </p>
          </div>

          {/* 3x2 Grid of 6 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-8 flex flex-col justify-between hover:border-[#54C7BE]/50 hover:bg-[#151D2A]/90 transition-all duration-300 shadow-md h-full group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#1D2735] border border-[#2B3544] flex items-center justify-center text-[#54C7BE] mb-6 group-hover:scale-105 transition-transform duration-200">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-[#F2F0EA] mb-3">
                      {feat.title}
                    </h3>
                    <p className="text-[15px] text-[#9AA7B5] leading-relaxed font-body">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
