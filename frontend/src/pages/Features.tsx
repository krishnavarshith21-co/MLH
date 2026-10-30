import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SolutionSection } from '../components/landing/SolutionSection';
import { Cpu, ShieldCheck, GitBranch, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-xs font-mono text-teal uppercase">
              Platform Features
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-ivory mt-4">
              Intelligent Software Evolution Capabilities
            </h1>
            <p className="text-lg text-secondary-text mt-4">
              Comprehensive tooling designed to eliminate technical debt, automate breaking change detection, and safely migrate dependencies with verified tests.
            </p>
          </div>

          <SolutionSection />

          {/* Deep Dive Capabilities */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-midnight-slate border border-border p-8">
              <h3 className="text-xl font-bold font-heading text-ivory flex items-center gap-3">
                <Cpu className="text-teal" size={22} />
                AST-Guided Code Surgery
              </h3>
              <p className="mt-3 text-sm text-secondary-text leading-relaxed">
                Unlike regex or naive token search, VERYNTH constructs full syntax trees to track attribute calls, variable assignments, and scope. When Pandas 2.0 deprecates <code className="text-champagne font-mono">.append()</code>, VERYNTH pinpoints exact offending call sites and generates equivalent <code className="text-teal font-mono">pd.concat()</code> expressions without touching unaffected methods.
              </p>
            </div>

            <div className="rounded-2xl bg-midnight-slate border border-border p-8">
              <h3 className="text-xl font-bold font-heading text-ivory flex items-center gap-3">
                <ShieldCheck className="text-champagne" size={22} />
                Isolated Subprocess Verification
              </h3>
              <p className="mt-3 text-sm text-secondary-text leading-relaxed">
                Never trust AI code blindly. VERYNTH checks every patch against real pytest suites inside a sandboxed temporary workspace. If a test fails, the test tracebacks are automatically fed back to Qwen2.5-Coder for corrective synthesis (up to 3 iterations) before asking for your approval.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

