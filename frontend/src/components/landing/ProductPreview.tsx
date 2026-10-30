import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRight, Play, Check, ShieldCheck, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<'diff' | 'ast' | 'test'>('diff');

  return (
    <section className="py-16 bg-midnight-slate/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-teal/10 border border-teal/20 text-[11px] font-mono text-teal uppercase mb-2">
              Demonstration Workflow
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-ivory">
              Real-World Migration: Pandas 1.5 → 2.0
            </h2>
            <p className="text-sm text-secondary-text mt-1">
              Demonstrating detection of removed <code className="text-champagne font-mono">DataFrame.append()</code> and automated synthesis of <code className="text-teal font-mono">pd.concat()</code> replacements.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-secondary-text bg-elevated/80 px-3 py-1.5 rounded-lg border border-border">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>Interactive Demo Sandbox</span>
          </div>
        </div>

        {/* Realistic Application Card */}
        <div className="rounded-2xl bg-midnight-slate border border-border shadow-2xl overflow-hidden">
          {/* Top Header Bar */}
          <div className="p-4 sm:px-6 bg-elevated/70 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-champagne/15 text-champagne text-xs font-mono font-medium border border-champagne/30">
                pandas 1.5.3 → 2.0.0
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-warning font-mono">
                <AlertTriangle size={13} />
                Breaking API Change Detected
              </span>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center rounded-lg bg-obsidian/80 p-1 border border-border/80">
              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeTab === 'diff' ? 'bg-elevated text-ivory shadow' : 'text-secondary-text hover:text-ivory'
                }`}
              >
                Code Diff
              </button>
              <button
                onClick={() => setActiveTab('ast')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeTab === 'ast' ? 'bg-elevated text-ivory shadow' : 'text-secondary-text hover:text-ivory'
                }`}
              >
                AST Telemetry
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeTab === 'test' ? 'bg-elevated text-ivory shadow' : 'text-secondary-text hover:text-ivory'
                }`}
              >
                Verification (12/12)
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {activeTab === 'diff' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-secondary-text border-b border-border/40 pb-2">
                  <span className="text-ivory font-semibold">src/data_processor.py</span>
                  <span className="text-teal">AI Model: Qwen2.5-Coder-7B</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Original Code */}
                  <div className="rounded-xl bg-obsidian p-4 border border-error/20 overflow-x-auto">
                    <div className="flex items-center justify-between text-error mb-3 pb-2 border-b border-border/40">
                      <span className="font-semibold">Original (Pandas 1.5.3)</span>
                      <span className="text-[10px] bg-error/10 px-1.5 py-0.5 rounded">Deprecated</span>
                    </div>
                    <pre className="text-secondary-text leading-relaxed">
{`def create_sales_report(transactions):
    df = pd.DataFrame(columns=[...])
    for tx in transactions:
        row = pd.DataFrame([{...}])
`}<span className="bg-error/20 text-error px-1 py-0.5 rounded block my-1">{`-       df = df.append(row, ignore_index=True)`}</span>{`    return df`}
                    </pre>
                  </div>

                  {/* Migrated Code */}
                  <div className="rounded-xl bg-obsidian p-4 border border-success/20 overflow-x-auto">
                    <div className="flex items-center justify-between text-success mb-3 pb-2 border-b border-border/40">
                      <span className="font-semibold">VERYNTH Patch (Pandas 2.0+)</span>
                      <span className="text-[10px] bg-success/10 px-1.5 py-0.5 rounded">Compatible</span>
                    </div>
                    <pre className="text-secondary-text leading-relaxed">
{`def create_sales_report(transactions):
    df = pd.DataFrame(columns=[...])
    for tx in transactions:
        row = pd.DataFrame([{...}])
`}<span className="bg-success/20 text-success px-1 py-0.5 rounded block my-1">{`+       df = pd.concat([df, row], ignore_index=True)`}</span>{`    return df`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ast' && (
              <div className="rounded-xl bg-obsidian p-5 font-mono text-xs text-secondary-text border border-border">
                <div className="flex items-center gap-2 text-champagne mb-4">
                  <Terminal size={14} />
                  <span>AST Scanner Diagnostic Report</span>
                </div>
                <div className="space-y-3">
                  <div className="p-2.5 rounded bg-elevated/40 border border-border/40 flex items-start justify-between">
                    <div>
                      <p className="text-ivory font-semibold">src/data_processor.py:23</p>
                      <p className="text-error mt-0.5">Call to deprecated attribute: <code className="text-champagne font-bold">DataFrame.append()</code></p>
                      <p className="text-teal mt-0.5">Recommended replacement: <code className="text-ivory font-bold">pd.concat([df, other], ignore_index=True)</code></p>
                    </div>
                    <span className="text-[10px] bg-warning/15 text-warning px-2 py-0.5 rounded uppercase">High Risk</span>
                  </div>
                  <div className="p-2.5 rounded bg-elevated/40 border border-border/40 flex items-start justify-between">
                    <div>
                      <p className="text-ivory font-semibold">src/analytics.py:20</p>
                      <p className="text-error mt-0.5">Call to deprecated attribute: <code className="text-champagne font-bold">DataFrame.append()</code></p>
                      <p className="text-teal mt-0.5">Recommended replacement: <code className="text-ivory font-bold">pd.concat([report, row], ignore_index=True)</code></p>
                    </div>
                    <span className="text-[10px] bg-warning/15 text-warning px-2 py-0.5 rounded uppercase">High Risk</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="rounded-xl bg-obsidian p-5 font-mono text-xs border border-border">
                <div className="flex items-center justify-between text-success mb-3 pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span className="font-semibold text-ivory">Subprocess Sandbox: Pytest Suite Passed</span>
                  </div>
                  <span className="text-[11px] text-secondary-text font-mono">12 passed in 13.8s</span>
                </div>
                <div className="space-y-1 text-secondary-text">
                  <p className="text-teal">tests/test_analytics.py::TestGenerateTrendReport::test_basic_report <span className="text-success">PASSED</span></p>
                  <p className="text-teal">tests/test_analytics.py::TestCombineRegionalData::test_combine <span className="text-success">PASSED</span></p>
                  <p className="text-teal">tests/test_data_processor.py::TestCreateSalesReport::test_basic_report <span className="text-success">PASSED</span></p>
                  <p className="text-teal">tests/test_data_processor.py::TestMergeInventoryUpdates::test_merge_updates <span className="text-success">PASSED</span></p>
                  <p className="text-secondary-text italic pt-1">...and 8 additional tests executed cleanly</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
