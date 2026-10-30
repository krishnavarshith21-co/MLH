import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FolderInput, ScanEye, Wand2, ShieldCheck, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FolderInput,
    title: 'Import',
    description: 'Provide a local directory or Git repository. Metadata and dependency manifests are indexed securely.',
  },
  {
    number: '02',
    icon: ScanEye,
    title: 'Analyze',
    description: 'Python AST engine identifies removed APIs and pinpoint exact files and line numbers affected.',
  },
  {
    number: '03',
    icon: Wand2,
    title: 'Generate',
    description: 'Qwen2.5-Coder writes targeted replacement patches adhering strictly to new framework APIs.',
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'Verify',
    description: 'Pytest runs in an isolated subprocess. If tests fail, an AI self-correction loop attempts up to 3 fixes.',
  },
  {
    number: '05',
    icon: CheckCircle,
    title: 'Approve',
    description: 'Review side-by-side Monaco diffs and verification reports before applying code to your codebase.',
  },
];

export function WorkflowSection() {
  return (
    <section className="py-24 bg-obsidian border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-xs font-mono text-champagne uppercase mb-3">
            Workflow Protocol
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-ivory tracking-tight">
            How VERYNTH Operates
          </h2>
          <p className="mt-3 text-secondary-text text-sm sm:text-base">
            From raw repository import to verified, developer-signed patch in five structured phases.
          </p>
        </div>

        {/* Workflow Steps: Horizontal on Desktop, Vertical on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-midnight-slate border border-border p-6 flex flex-col justify-between hover:border-teal/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold font-heading text-champagne/40 group-hover:text-champagne transition-colors">
                      {step.number}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center text-teal">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold font-heading text-ivory mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-secondary-text leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector between steps on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-border">
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
