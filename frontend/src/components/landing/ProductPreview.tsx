import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Code2,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<'diff' | 'ast' | 'test'>('diff');
  const [mobileView, setMobileView] = useState<'split' | 'original' | 'migrated'>('split');
  const [copied, setCopied] = useState(false);

  const migratedCode = `import pandas as pd

def build_inventory_table(records: list[dict]) -> pd.DataFrame:
    """Build consolidated inventory frame from raw records."""
    master_df = pd.DataFrame(columns=["sku", "quantity", "unit_price"])

    for item in records:
        entry = pd.DataFrame([{
            "sku": item["sku"],
            "quantity": int(item["qty"]),
            "unit_price": float(item["price"]),
        }])
        # Replaced with compatible pd.concat pattern
        master_df = pd.concat([master_df, entry], ignore_index=True)

    return master_df`;

  const handleCopy = () => {
    navigator.clipboard.writeText(migratedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 lg:py-24 bg-[#151D2A]/30 border-b border-[#2B3544]">
      <div className="container-enterprise">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#54C7BE]/10 border border-[#54C7BE]/25 text-xs font-body text-[#54C7BE] uppercase mb-4">
              <Sparkles size={13} />
              Demonstration Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#F2F0EA] tracking-tight">
              Real-World Migration: Pandas 1.5 → 2.0
            </h2>
            <p className="text-base text-[#9AA7B5] mt-3 leading-relaxed">
              Demonstrating automated migration from removed{' '}
              <code className="text-[#C6B99A] font-body text-sm px-1.5 py-0.5 rounded bg-[#151D2A] border border-[#2B3544]">
                DataFrame.append()
              </code>{' '}
              calls to compatible{' '}
              <code className="text-[#54C7BE] font-body text-sm px-1.5 py-0.5 rounded bg-[#151D2A] border border-[#2B3544]">
                pd.concat()
              </code>{' '}
              patterns.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-body text-[#F2F0EA] bg-[#151D2A] px-4 py-2 rounded-xl border border-[#2B3544] shrink-0 self-start md:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#49B994] animate-pulse" />
            <span>Demonstration Sandbox</span>
          </div>
        </div>

        {/* Enterprise Migration Workspace Card */}
        <div className="rounded-2xl bg-[#090D14] border border-[#2B3544] shadow-2xl overflow-hidden">
          {/* Workspace Top Header */}
          <div className="p-4 sm:px-6 bg-[#151D2A] border-b border-[#2B3544] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-[#C6B99A]/15 text-[#C6B99A] text-xs font-body font-semibold border border-[#C6B99A]/30 flex items-center gap-2">
                <span>pandas</span>
                <span className="text-[#F2F0EA]">1.5.3 → 2.0.0</span>
              </span>

              <Badge variant="error" size="sm" icon={<AlertTriangle size={12} />}>
                Breaking API Deprecation
              </Badge>

              <Badge variant="info" size="sm" icon={<Sparkles size={12} />}>
                Qwen2.5-Coder-7B-Instruct
              </Badge>
            </div>

            {/* Navigation Tab Selector with clear buttons and spacing */}
            <div className="flex items-center rounded-xl bg-[#090D14] p-1 sm:p-1.5 border border-[#2B3544] gap-1 overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab('diff')}
                className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'diff'
                    ? 'bg-[#1D2735] text-[#F2F0EA] border border-[#2B3544] shadow-sm font-semibold'
                    : 'text-[#9AA7B5] hover:text-[#F2F0EA]'
                }`}
              >
                Code Diff
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ast')}
                className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'ast'
                    ? 'bg-[#1D2735] text-[#F2F0EA] border border-[#2B3544] shadow-sm font-semibold'
                    : 'text-[#9AA7B5] hover:text-[#F2F0EA]'
                }`}
              >
                AST Telemetry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('test')}
                className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'test'
                    ? 'bg-[#1D2735] text-[#F2F0EA] border border-[#2B3544] shadow-sm font-semibold'
                    : 'text-[#9AA7B5] hover:text-[#F2F0EA]'
                }`}
              >
                Pytest Suite (12/12)
              </button>
            </div>
          </div>

          {/* Subheader info bar */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#121824] border-b border-[#2B3544]/60 flex flex-wrap items-center justify-between gap-2 text-xs font-body text-[#9AA7B5]">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Code2 size={14} className="text-[#54C7BE] shrink-0" />
              <span className="text-[#F2F0EA] font-semibold truncate">src/data_processor.py</span>
              <span className="text-[#9AA7B5]/40 hidden sm:inline">•</span>
              <span className="hidden sm:inline">Python 3.10+ Target</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="text-[11px] text-[#49B994] hidden md:inline">
                Diff Unified: +1 / -1 lines
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#9AA7B5] hover:text-[#F2F0EA] transition-colors"
                title="Copy migrated code"
              >
                {copied ? <Check size={14} className="text-[#49B994]" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Patch'}</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-3.5 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-hidden">
            {activeTab === 'diff' && (
              <div className="space-y-6">
                {/* Mobile view toggle */}
                <div className="flex sm:hidden items-center justify-center rounded-lg bg-[#151D2A] p-1 border border-[#2B3544] text-xs font-body">
                  <button
                    onClick={() => setMobileView('original')}
                    className={`flex-1 py-1.5 rounded ${
                      mobileView === 'original' ? 'bg-[#1D2735] text-[#E47979] font-semibold' : 'text-[#9AA7B5]'
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setMobileView('migrated')}
                    className={`flex-1 py-1.5 rounded ${
                      mobileView === 'migrated' ? 'bg-[#1D2735] text-[#49B994] font-semibold' : 'text-[#9AA7B5]'
                    }`}
                  >
                    Migrated
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-body text-[13px] leading-relaxed min-w-0">
                  {/* LEFT PANE: Original Code (Pandas 1.5.3) */}
                  <div
                    className={`rounded-xl bg-[#090D14] border border-[#E47979]/40 overflow-hidden shadow-md min-w-0 ${
                      mobileView === 'migrated' ? 'hidden sm:block' : 'block'
                    }`}
                  >
                    <div className="px-5 py-3 bg-[#151D2A] border-b border-[#2B3544] flex items-center justify-between text-xs text-[#E47979]">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E47979]" />
                        <span>Original (Pandas 1.5.3)</span>
                      </div>
                      <span className="text-[10px] bg-[#E47979]/15 text-[#E47979] px-2 py-0.5 rounded font-body uppercase font-semibold">
                        Deprecated API
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 overflow-x-auto text-[#9AA7B5] space-y-1.5 min-w-0 max-w-full text-xs sm:text-[13px]">
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">1  import pandas as pd</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">2  </p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">3  def build_inventory_table(records: list[dict]) -&gt; pd.DataFrame:</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">4      master_df = pd.DataFrame(columns=[...])</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">5      </p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">6      for item in records:</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">7          entry = pd.DataFrame([&#123;...&#125;])</p>
                      {/* Highlighted removed line */}
                      <div className="bg-[#E47979]/15 border-l-2 border-[#E47979] text-[#E47979] py-1.5 px-3 rounded-r my-1.5 font-semibold inline-block min-w-full">
                        <span className="whitespace-nowrap">8 -        master_df = master_df.append(entry, ignore_index=True)</span>
                      </div>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">9      </p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">10     return master_df</p>
                    </div>
                  </div>

                  {/* RIGHT PANE: Migrated Code (Pandas 2.0+) */}
                  <div
                    className={`rounded-xl bg-[#090D14] border border-[#49B994]/40 overflow-hidden shadow-md min-w-0 max-w-full ${
                      mobileView === 'original' ? 'hidden sm:block' : 'block'
                    }`}
                  >
                    <div className="px-4 sm:px-5 py-3 bg-[#151D2A] border-b border-[#2B3544] flex items-center justify-between text-xs text-[#49B994]">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#49B994]" />
                        <span>VERYNTH Patch (Pandas 2.0+)</span>
                      </div>
                      <span className="text-[10px] bg-[#49B994]/15 text-[#49B994] px-2 py-0.5 rounded font-body uppercase font-semibold">
                        Verified Compatible
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 overflow-x-auto text-[#9AA7B5] space-y-1.5 min-w-0 max-w-full text-xs sm:text-[13px]">
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">1  import pandas as pd</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">2  </p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">3  def build_inventory_table(records: list[dict]) -&gt; pd.DataFrame:</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">4      master_df = pd.DataFrame(columns=[...])</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">5      </p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">6      for item in records:</p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">7          entry = pd.DataFrame([&#123;...&#125;])</p>
                      {/* Highlighted added line */}
                      <div className="bg-[#49B994]/15 border-l-2 border-[#49B994] text-[#49B994] py-1.5 px-3 rounded-r my-1.5 font-semibold inline-block min-w-full">
                        <span className="whitespace-nowrap">8 +        master_df = pd.concat([master_df, entry], ignore_index=True)</span>
                      </div>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">9      </p>
                      <p className="text-[#9AA7B5]/60 whitespace-nowrap">10     return master_df</p>
                    </div>
                  </div>
                </div>

                {/* Explanation Strip with dedicated column badge */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#151D2A] border border-[#2B3544] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-[#C6B99A]/15 text-[#C6B99A] font-body text-xs font-semibold shrink-0 border border-[#C6B99A]/30 w-fit">
                      AI Reasoning
                    </span>
                    <p className="text-xs text-[#9AA7B5] leading-relaxed">
                      <code className="text-[#F2F0EA] font-body">DataFrame.append</code> was permanently removed in Pandas 2.0. The Qwen model synthesized an exact functional replacement using <code className="text-[#54C7BE] font-body">pd.concat</code> with matching index behavior.
                    </p>
                  </div>
                  <span className="text-[11px] font-body text-[#54C7BE] bg-[#090D14] px-3 py-1 rounded-md border border-[#2B3544] shrink-0 w-fit">
                    AST Match: Call.Attribute (append)
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'ast' && (
              <div className="rounded-xl bg-[#090D14] p-6 font-body text-xs text-[#9AA7B5] border border-[#2B3544] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2B3544] pb-3">
                  <div className="flex items-center gap-2 text-[#C6B99A] font-semibold text-sm">
                    <Terminal size={16} />
                    <span>Python Abstract Syntax Tree (AST) Diagnostic Trace</span>
                  </div>
                  <span className="text-xs text-[#54C7BE]">Target: Pandas 2.x</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-[#151D2A] border border-[#2B3544] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-[#F2F0EA] font-bold text-sm">src/data_processor.py:23</p>
                      <p className="text-[#E47979] mt-1">
                        Call to removed method: <code className="font-bold">DataFrame.append()</code>
                      </p>
                      <p className="text-[#54C7BE] mt-0.5">
                        AST Node Type: <span className="text-[#F2F0EA]">ast.Attribute (id='append', ctx=ast.Load)</span>
                      </p>
                    </div>
                    <Badge variant="error" size="sm">Breaking Deprecation</Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-[#151D2A] border border-[#2B3544] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-[#F2F0EA] font-bold text-sm">src/analytics.py:48</p>
                      <p className="text-[#E47979] mt-1">
                        Call to removed method: <code className="font-bold">DataFrame.append()</code>
                      </p>
                      <p className="text-[#54C7BE] mt-0.5">
                        AST Node Type: <span className="text-[#F2F0EA]">ast.Attribute (id='append', ctx=ast.Load)</span>
                      </p>
                    </div>
                    <Badge variant="error" size="sm">Breaking Deprecation</Badge>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="rounded-xl bg-[#090D14] p-6 font-body text-xs border border-[#2B3544] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2B3544] pb-3 text-[#49B994]">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#F2F0EA]">
                    <CheckCircle2 size={18} className="text-[#49B994]" />
                    <span>Isolated Subprocess Pytest Runner: PASS</span>
                  </div>
                  <span className="text-xs text-[#9AA7B5] font-body">
                    12 passed in 1.48s (100% passing)
                  </span>
                </div>

                <div className="space-y-2.5 pt-2 text-[#9AA7B5]">
                  <p className="text-[#54C7BE]">
                    tests/test_analytics.py::TestGenerateTrendReport::test_basic_report{' '}
                    <span className="text-[#49B994] font-semibold">PASSED</span>
                  </p>
                  <p className="text-[#54C7BE]">
                    tests/test_analytics.py::TestCombineRegionalData::test_combine{' '}
                    <span className="text-[#49B994] font-semibold">PASSED</span>
                  </p>
                  <p className="text-[#54C7BE]">
                    tests/test_data_processor.py::TestCreateSalesReport::test_basic_report{' '}
                    <span className="text-[#49B994] font-semibold">PASSED</span>
                  </p>
                  <p className="text-[#54C7BE]">
                    tests/test_data_processor.py::TestMergeInventoryUpdates::test_merge_updates{' '}
                    <span className="text-[#49B994] font-semibold">PASSED</span>
                  </p>
                  <p className="text-[#9AA7B5]/60 italic pt-2">
                    + 8 additional test suites executed cleanly in subprocess isolation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
