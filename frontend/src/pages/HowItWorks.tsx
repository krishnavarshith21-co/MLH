import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { ArrowRight, FileCode, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-xs font-mono text-champagne uppercase">
              Operational Architecture
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-ivory mt-4">
              How VERYNTH Executes Safe Migrations
            </h1>
            <p className="text-lg text-secondary-text mt-4">
              Our 5-stage deterministic pipeline balances speed, open-weight generative intelligence, and strict verification gates.
            </p>
          </div>

          <WorkflowSection />

          {/* Detailed step breakdown */}
          <div className="mt-20 space-y-8">
            <div className="rounded-2xl bg-midnight-slate border border-border p-8">
              <div className="flex items-center gap-3 text-teal font-mono text-sm mb-2">
                <span>PHASE 1 & 2</span>
                <span>•</span>
                <span>INGESTION & SYNTAX PARSING</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-ivory">
                Static Dependency & AST Analysis
              </h3>
              <p className="mt-3 text-sm text-secondary-text leading-relaxed">
                When a project is imported, VERYNTH reads <code className="text-champagne font-mono">requirements.txt</code>, compares current versions against PyPI, and flags breaking changes. Next, our Python AST parser inspects every <code className="text-teal font-mono">.py</code> file in the repository, checking for deprecated functions (e.g. DataFrame.append in pandas 1.x vs 2.x).
              </p>
            </div>

            <div className="rounded-2xl bg-midnight-slate border border-border p-8">
              <div className="flex items-center gap-3 text-champagne font-mono text-sm mb-2">
                <span>PHASE 3 & 4</span>
                <span>•</span>
                <span>AI SYNTHESIS & SANDBOX VERIFICATION</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-ivory">
                Open-Weight Qwen2.5 Inference & Pytest Sandbox
              </h3>
              <p className="mt-3 text-sm text-secondary-text leading-relaxed">
                The AST findings and affected code are structured into a prompt for Qwen2.5-Coder-7B-Instruct. The model returns compatible code and explanations. VERYNTH generates unified diffs and writes the patched files to an isolated temporary sandbox to run pytest. Real pass/fail counts and terminal tracebacks are collected.
              </p>
            </div>

            <div className="rounded-2xl bg-midnight-slate border border-border p-8">
              <div className="flex items-center gap-3 text-success font-mono text-sm mb-2">
                <span>PHASE 5</span>
                <span>•</span>
                <span>GOVERNANCE & REVIEW</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-ivory">
                Developer Approval Gate
              </h3>
              <p className="mt-3 text-sm text-secondary-text leading-relaxed">
                Nothing is modified in your repository without explicit user authorization. You review the original vs proposed code in a side-by-side Monaco diff, inspect the verification log, and click "Approve Migration" or "Reject".
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

