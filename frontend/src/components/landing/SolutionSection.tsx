import React from 'react';
import { motion } from 'framer-motion';
import { Search, Binary, Sparkles, CheckCheck, UserCheck, Layers, GitPullRequest } from 'lucide-react';

export function SolutionSection() {
  return (
    <section className="py-24 bg-midnight-slate/50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-xs font-mono text-teal uppercase mb-3">
            Architectural Precision
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-ivory tracking-tight">
            The Five Pillars of Safe Evolution
          </h2>
          <p className="mt-4 text-base sm:text-lg text-secondary-text">
            VERYNTH replaces guesswork with deterministic static analysis, open-weight reasoning, and sandboxed test validation.
          </p>
        </div>

        {/* Varied Grid Layout for the 5 Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* 1. Dependency Intelligence (Large 7-col) */}
          <div className="md:col-span-7 rounded-2xl bg-midnight-slate border border-border p-8 flex flex-col justify-between hover:border-teal/40 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal mb-6">
                <Search size={20} />
              </div>
              <h3 className="text-xl font-bold font-heading text-ivory group-hover:text-teal transition-colors">
                1. Dependency Intelligence
              </h3>
              <p className="mt-2 text-sm text-secondary-text leading-relaxed">
                Automatically scans <code className="text-champagne font-mono">requirements.txt</code> and project lockfiles, cross-referencing package registries to evaluate breaking API changelogs and version gaps.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border/60 flex items-center gap-4 text-xs font-mono text-secondary-text">
              <span className="flex items-center gap-1.5 text-teal">
                <Layers size={14} /> PyPI Metadata Sync
              </span>
              <span>•</span>
              <span>Semantic Version Audit</span>
            </div>
          </div>

          {/* 2. Compatibility Analysis (5-col) */}
          <div className="md:col-span-5 rounded-2xl bg-midnight-slate border border-border p-8 flex flex-col justify-between hover:border-champagne/40 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-champagne/10 border border-champagne/30 flex items-center justify-center text-champagne mb-6">
                <Binary size={20} />
              </div>
              <h3 className="text-xl font-bold font-heading text-ivory group-hover:text-champagne transition-colors">
                2. Compatibility Analysis
              </h3>
              <p className="mt-2 text-sm text-secondary-text leading-relaxed">
                Uses Python Abstract Syntax Tree (AST) parsing to locate precise callers, methods, and syntax incompatible with target versions.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border/60 text-xs font-mono text-champagne">
              Exact AST Node Pinpointing
            </div>
          </div>

          {/* 3. AI Migration Engine (4-col) */}
          <div className="md:col-span-4 rounded-2xl bg-elevated/80 border border-border p-8 flex flex-col justify-between hover:border-teal/40 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal mb-6">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-bold font-heading text-ivory group-hover:text-teal transition-colors">
                3. AI Migration Engine
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-secondary-text leading-relaxed">
                Leverages Qwen2.5-Coder-7B-Instruct to generate targeted, semantically identical code refactorings and explainable unified diffs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-mono text-secondary-text">
              Apache 2.0 Open-Weight Model
            </div>
          </div>

          {/* 4. Automated Verification (4-col) */}
          <div className="md:col-span-4 rounded-2xl bg-midnight-slate border border-border p-8 flex flex-col justify-between hover:border-success/40 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success mb-6">
                <CheckCheck size={20} />
              </div>
              <h3 className="text-lg font-bold font-heading text-ivory group-hover:text-success transition-colors">
                4. Automated Verification
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-secondary-text leading-relaxed">
                Runs relevant unit tests in an isolated, sandboxed subprocess environment. Captures real output and logs actual test results.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-mono text-success">
              Sandboxed Pytest Execution
            </div>
          </div>

          {/* 5. Human-Controlled Approval (4-col) */}
          <div className="md:col-span-4 rounded-2xl bg-midnight-slate border border-border p-8 flex flex-col justify-between hover:border-champagne/40 transition-colors group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-champagne/10 border border-champagne/30 flex items-center justify-center text-champagne mb-6">
                <UserCheck size={20} />
              </div>
              <h3 className="text-lg font-bold font-heading text-ivory group-hover:text-champagne transition-colors">
                5. Developer Approval
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-secondary-text leading-relaxed">
                Explicit developer sign-off required. Inspect changes in an interactive code diff before committing to project files.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-mono text-champagne">
              Zero Unattended Merges
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
