import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, XCircle, Clock, FileWarning, RefreshCw } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="py-20 bg-obsidian border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Problem Editorial */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 border border-error/20 text-xs font-mono text-error uppercase mb-4">
              The Architectural Dilemma
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-ivory tracking-tight leading-snug">
              Dependency updates break production silently.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-secondary-text leading-relaxed">
              Modern applications rely on hundreds of external open-source packages. When maintainers
              deprecate or rename APIs, engineers are left with cryptic traceback errors, broken pipelines,
              and expensive manual refactoring loops.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-elevated border border-border text-error mt-0.5">
                  <XCircle size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ivory">Subtle Breaking Changes</h4>
                  <p className="text-xs text-secondary-text mt-0.5">
                    Functions are removed across major releases with little notice, turning passing unit tests into runtime exceptions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-elevated border border-border text-warning mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ivory">Manual Documentation Hunting</h4>
                  <p className="text-xs text-secondary-text mt-0.5">
                    Developers comb through hundreds of changelog pages to deduce how to rewrite obsolete syntax manually.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-elevated border border-border text-champagne mt-0.5">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ivory">Fear of Updating</h4>
                  <p className="text-xs text-secondary-text mt-0.5">
                    Teams freeze dependencies for years, accumulating unpatched security vulnerabilities and technical debt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Upgrade Failure Terminal Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-midnight-slate border border-error/30 shadow-2xl p-6 font-mono text-xs overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error/70" />
                  <span className="w-3 h-3 rounded-full bg-warning/70" />
                  <span className="w-3 h-3 rounded-full bg-success/70" />
                  <span className="text-secondary-text text-[11px] ml-2">production-ci-job #4912</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-error/15 text-error font-semibold">
                  BUILD FAILED
                </span>
              </div>

              {/* Terminal Output */}
              <div className="space-y-2 text-secondary-text leading-relaxed">
                <p className="text-ivory">$ poetry run pytest tests/test_data_processor.py</p>
                <p className="text-secondary-text/60">==================== test session starts ====================</p>
                <p className="text-secondary-text/60">rootdir: /workspace, configfile: pyproject.toml</p>
                <p className="text-secondary-text/60">collected 8 items</p>
                <p className="mt-2 text-error">
                  tests/test_data_processor.py:23: in test_create_sales_report
                </p>
                <p className="text-ivory bg-elevated/80 p-2.5 rounded border border-border">
                  df = df.append(row, ignore_index=True)
                </p>
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertOctagon size={14} /> AttributeError: 'DataFrame' object has no attribute 'append'
                  </p>
                  <p className="text-[11px] text-error/80 mt-1">
                    The method `append` was removed in pandas 2.0. Use `pandas.concat` instead.
                  </p>
                </div>
                <p className="text-error font-bold pt-2">
                  FAILED tests/test_data_processor.py::TestCreateSalesReport - 8 failed, 0 passed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

