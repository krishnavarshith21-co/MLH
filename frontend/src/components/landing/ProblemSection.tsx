import { AlertOctagon, XCircle, Clock, RefreshCw, Terminal, FileCode2 } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="py-24 lg:py-24 bg-[#090D14] border-b border-[#2B3544]">
      <div className="container-enterprise">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN: 45% (col-span-12 lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E47979]/10 border border-[#E47979]/25 text-xs font-body text-[#E47979] uppercase mb-4 w-fit">
              <AlertOctagon size={13} />
              The Architectural Dilemma
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#F2F0EA] tracking-tight leading-snug">
              Dependency upgrades break production silently.
            </h2>

            <p className="mt-4 text-base text-[#9AA7B5] leading-relaxed font-body">
              Modern applications rely on external libraries that evolve rapidly.
              When maintainers deprecate or rename interfaces across major versions,
              engineering teams face obscure traceback errors, broken pipelines, and
              high-risk manual refactoring cycles.
            </p>

            <div className="mt-8 space-y-4">
              {/* Problem 1 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                <div className="p-2 rounded-lg bg-[#090D14] border border-[#E47979]/30 text-[#E47979] shrink-0 mt-0.5">
                  <XCircle size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F0EA] font-heading">
                    Subtle Breaking API Changes
                  </h4>
                  <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                    Functions and methods are removed across major releases without runtime fallbacks, causing silent failures in production.
                  </p>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                <div className="p-2 rounded-lg bg-[#090D14] border border-[#D5A86B]/30 text-[#D5A86B] shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F0EA] font-heading">
                    Manual Documentation Excavation
                  </h4>
                  <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                    Developers comb through hundreds of changelog entries, release notes, and deprecation notices to discover correct syntax replacements.
                  </p>
                </div>
              </div>

              {/* Problem 3 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                <div className="p-2 rounded-lg bg-[#090D14] border border-[#C6B99A]/30 text-[#C6B99A] shrink-0 mt-0.5">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F0EA] font-heading">
                    Dependency Freezing & Tech Debt
                  </h4>
                  <p className="text-xs text-[#9AA7B5] mt-1 leading-relaxed">
                    Fear of regressions causes teams to lock dependencies indefinitely, accumulating security vulnerabilities and technical debt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 55% (col-span-12 lg:col-span-7) */}
          <div className="lg:col-span-7 w-full flex items-center justify-center min-w-0">
            <div className="w-full rounded-2xl bg-[#090D14] border border-[#E47979]/40 shadow-2xl overflow-hidden font-body text-xs max-w-full">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#151D2A] border-b border-[#2B3544] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E47979]" />
                  <span className="w-3 h-3 rounded-full bg-[#D5A86B]" />
                  <span className="w-3 h-3 rounded-full bg-[#49B994]" />
                  <span className="text-[#9AA7B5] text-[11px] ml-2 flex items-center gap-1.5 font-medium truncate">
                    <Terminal size={13} className="shrink-0" />
                    <span>ci-build-pipeline #8421</span>
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E47979]/15 text-[#E47979] font-semibold border border-[#E47979]/30 shrink-0">
                  TEST SUITE FAILED
                </span>
              </div>

              {/* Terminal Console Output */}
              <div className="p-4 sm:p-6 space-y-3 leading-relaxed text-[#9AA7B5] overflow-x-auto">
                <div className="flex items-center gap-2 text-[#F2F0EA] pb-1 border-b border-[#2B3544]/60">
                  <span className="text-[#54C7BE]">$</span>
                  <span>pytest tests/test_data_processor.py --tb=short</span>
                </div>

                <div className="text-[11px] text-[#9AA7B5]/60 space-y-0.5">
                  <p>rootdir: /workspace, configfile: pyproject.toml</p>
                  <p>collected 8 items / 1 error</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#151D2A] border border-[#2B3544] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#E47979] font-semibold">
                    <span>FAIL: test_create_sales_report</span>
                    <span className="text-[10px] text-[#9AA7B5]">src/data_processor.py:23</span>
                  </div>
                  <p className="text-[#F2F0EA] bg-[#090D14] p-2 rounded border border-[#2B3544] text-[12px]">
                    df = df.append(row, ignore_index=True)
                  </p>
                </div>

                {/* Actual Traceback Box */}
                <div className="p-4 rounded-xl bg-[#E47979]/10 border border-[#E47979]/30 text-[#E47979] space-y-1.5">
                  <p className="font-bold flex items-center gap-2 text-sm">
                    <AlertOctagon size={16} />
                    AttributeError: 'DataFrame' object has no attribute 'append'
                  </p>
                  <p className="text-[11px] text-[#E47979]/90 leading-relaxed pl-6">
                    The method `append` was removed in Pandas 2.0.0. Incompatible caller located in function `create_sales_report`.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[#E47979] font-bold">
                  <span>== 1 failed, 7 passed in 0.84s ==</span>
                  <span className="text-[#9AA7B5] font-normal text-[11px]">Exit Code: 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
