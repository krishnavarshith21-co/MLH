import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  FolderInput,
  ScanEye,
  Wand2,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Import',
    icon: FolderInput,
    description:
      'Import your local Python project. We analyze dependencies and structure.',
  },
  {
    number: '02',
    title: 'Analyze',
    icon: ScanEye,
    description:
      'Python AST finds incompatible APIs and pinpoints exact files and line numbers.',
  },
  {
    number: '03',
    title: 'Generate',
    icon: Wand2,
    description:
      'Qwen2.5-Coder creates targeted replacement patches with explanations.',
  },
  {
    number: '04',
    title: 'Verify',
    icon: ShieldCheck,
    description:
      'Runs pytest in an isolated sandbox. Captures real test results and logs.',
  },
  {
    number: '05',
    title: 'Approve',
    icon: CheckCircle,
    description:
      'Review side-by-side diffs and approve the proposed changes.',
  },
];

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#090D14] text-[#F2F0EA] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-28">
        <div className="container-enterprise">
          {/* Header matching Image 1 */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151D2A] border border-[#2B3544] text-[10px] sm:text-[11px] font-body tracking-widest text-[#54C7BE] uppercase mb-4 shadow-sm">
              <span>• THE PROCESS •</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F2F0EA] tracking-tight">
              How VERYNTH Operates
            </h1>
            <p className="text-base sm:text-lg text-[#9AA7B5] mt-4 leading-relaxed font-body">
              From repository import to verified, developer-approved migration in five stages.
            </p>
          </div>

          {/* 5-Stage Connected Progression Flow matching Image 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 items-stretch max-w-6xl mx-auto">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.number} className="relative flex items-center">
                  <div className="w-full rounded-2xl bg-[#151D2A] border border-[#2B3544] p-6 sm:p-7 flex flex-col justify-between hover:border-[#54C7BE]/50 hover:bg-[#151D2A]/90 transition-all duration-300 shadow-md h-full group">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-xl bg-[#090D14] border border-[#2B3544] flex items-center justify-center text-[#54C7BE] group-hover:scale-105 transition-transform duration-200">
                          <Icon size={20} />
                        </div>
                        <span className="text-xs font-body font-bold text-[#C6B99A]/60 group-hover:text-[#C6B99A] transition-colors">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-heading text-[#F2F0EA] mb-2.5">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#9AA7B5] leading-relaxed font-body">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector Arrow on Desktop */}
                  {!isLast && (
                    <div className="hidden xl:flex absolute -right-7 z-20 w-6 h-6 rounded-full bg-[#090D14] border border-[#54C7BE]/40 text-[#54C7BE] items-center justify-center shadow-md">
                      <ArrowRight size={12} />
                    </div>
                  )}
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
