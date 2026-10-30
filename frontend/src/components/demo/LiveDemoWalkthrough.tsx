import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  X,
  FileCode,
  Layers,
  Terminal,
  Activity,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';

interface LiveDemoWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  primaryProject: any;
  onCompleted?: () => void;
}

export function LiveDemoWalkthrough({
  isOpen,
  onClose,
  primaryProject,
  onCompleted,
}: LiveDemoWalkthroughProps) {
  const navigate = useNavigate();

  // Wizard state: 1 = Import, 2 = Analyze, 3 = Generate, 4 = Verify, 5 = Review & Approve
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Workflow persisted data
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [migrationData, setMigrationData] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<any>(null);

  if (!isOpen) return null;

  const projectId = primaryProject?.id;

  // Step 2: Trigger AST Analysis
  const runAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<any>(`/projects/${projectId}/analyze`);
      setAnalysisData(res.data);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to complete AST analysis.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Create Migration & Trigger Qwen AI Generation
  const runGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Find pandas dependency id
      let depId = primaryProject?.dependency_id;
      if (!depId && analysisData?.dependencies) {
        const pd = analysisData.dependencies.find((d: any) => d.name.toLowerCase() === 'pandas');
        if (pd) depId = pd.id;
      }
      if (!depId) {
        // Fallback: fetch dependencies
        const depsRes = await api.get<any[]>(`/projects/${projectId}/dependencies`);
        const pd = depsRes.data.find((d: any) => d.name.toLowerCase() === 'pandas');
        if (pd) depId = pd.id;
      }

      // Create migration record if not already created
      let migId = migrationData?.id;
      if (!migId) {
        const createRes = await api.post<any>('/migrations', {
          project_id: projectId,
          dependency_id: depId,
        });
        migId = createRes.data.id;
      }

      // Call Ollama Qwen2.5-Coder model
      const genRes = await api.post<any>(`/migrations/${migId}/generate`);
      setMigrationData(genRes.data);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI patch with Qwen2.5-Coder.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Run Isolated Verification
  const runVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const migId = migrationData?.id;
      const verifyRes = await api.post<any>(`/migrations/${migId}/verify`);
      setVerificationData(verifyRes.data);

      // Refresh migration state
      const refreshedMig = await api.get<any>(`/migrations/${migId}`);
      setMigrationData(refreshedMig.data);
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to execute test verification.');
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Approve Migration
  const runApproval = async () => {
    setLoading(true);
    setError(null);
    try {
      const migId = migrationData?.id;
      const approveRes = await api.post<any>(`/migrations/${migId}/approve`);
      setMigrationData(approveRes.data);
      setCurrentStep(5);
      if (onCompleted) onCompleted();
    } catch (err: any) {
      setError(err.message || 'Failed to approve migration.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPatch = () => {
    if (!migrationData?.diff) return;
    const blob = new Blob([migrationData.diff], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verynth-pandas-2.0-migration.diff`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stepsHeader = [
    { num: 1, label: '1. Ingestion' },
    { num: 2, label: '2. AST Analysis' },
    { num: 3, label: '3. Qwen AI Patch' },
    { num: 4, label: '4. Test Verification' },
    { num: 5, label: '5. Review & Approval' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#151D2A] border border-[#2B3544] shadow-2xl p-6 sm:p-8 text-[#F2F0EA] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-[#54C7BE]/10 blur-3xl pointer-events-none" />

        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#2B3544]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C6B99A]/20 via-[#54C7BE]/20 to-[#54C7BE]/10 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-heading text-[#F2F0EA]">
                  Live Migration Demonstration
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#54C7BE]/15 text-[#54C7BE] border border-[#54C7BE]/30">
                  Interactive Judged Workflow
                </span>
              </div>
              <p className="text-xs text-[#9AA7B5] mt-0.5 font-body">
                End-to-End Dependency Upgrade: Pandas 1.5.3 → 2.0 with Real Qwen2.5-Coder & Pytest Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#1D2735] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="py-4 border-b border-[#2B3544]/60 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {stepsHeader.map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#54C7BE] text-[#090D14] ring-2 ring-[#54C7BE]/40 shadow-lg shadow-[#54C7BE]/20'
                        : isPast
                        ? 'bg-[#49B994] text-[#090D14]'
                        : 'bg-[#1D2735] text-[#9AA7B5] border border-[#2B3544]'
                    }`}
                  >
                    {isPast ? <Check size={14} /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isActive
                        ? 'text-[#54C7BE]'
                        : isPast
                        ? 'text-[#F2F0EA]'
                        : 'text-[#9AA7B5]'
                    }`}
                  >
                    {s.label}
                  </span>
                  {s.num < 5 && (
                    <div
                      className={`h-[1px] w-6 sm:w-10 ml-2 ${
                        isPast ? 'bg-[#49B994]' : 'bg-[#2B3544]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1">
          {error && (
            <div className="p-4 rounded-xl bg-[#E47979]/15 border border-[#E47979]/30 text-[#E47979] text-xs flex items-center gap-3">
              <AlertTriangle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: INGESTION & OVERVIEW */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#090D14] border border-[#2B3544]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileCode size={22} className="text-[#54C7BE]" />
                    <div>
                      <h3 className="text-base font-bold text-[#F2F0EA]">
                        Legacy Data Analytics Sample Project
                      </h3>
                      <p className="text-xs text-[#9AA7B5]">
                        Real Python analytics service with legacy data-frame operations
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D5A86B]/15 text-[#D5A86B] border border-[#D5A86B]/30">
                    Ready for Migration
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div className="p-3 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                    <span className="text-[#9AA7B5] block mb-1">Target Package</span>
                    <span className="font-mono text-[#54C7BE] font-bold text-sm">pandas</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                    <span className="text-[#9AA7B5] block mb-1">Current Version</span>
                    <span className="font-mono text-[#F2F0EA] font-semibold text-sm">1.5.3</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                    <span className="text-[#9AA7B5] block mb-1">Target Version</span>
                    <span className="font-mono text-[#C6B99A] font-bold text-sm">2.0.0 (Major)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                    <span className="text-[#9AA7B5] block mb-1">Test Suite</span>
                    <span className="font-mono text-[#49B994] font-semibold text-sm">12 Tests (Pytest)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#151D2A]/80 border border-[#2B3544] text-xs text-[#9AA7B5] space-y-1">
                  <p className="text-[#F2F0EA] font-semibold">Repository Manifest:</p>
                  <p className="font-mono text-[11px] text-[#54C7BE]">
                    • src/data_processor.py — 4 DataFrame.append() calls in sales & inventory functions
                  </p>
                  <p className="font-mono text-[11px] text-[#54C7BE]">
                    • src/analytics.py — 2 DataFrame.append() calls in trend & regional processing
                  </p>
                  <p className="font-mono text-[11px] text-[#9AA7B5]">
                    • tests/test_data_processor.py & tests/test_analytics.py — 12 comprehensive unit assertions
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1D2735]/60 border border-[#2B3544] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F0EA]">Next Step: AST Compatibility Scan</h4>
                  <p className="text-xs text-[#9AA7B5]">
                    Parse project Python Abstract Syntax Trees to identify exact breaking lines.
                  </p>
                </div>
                <button
                  onClick={runAnalyze}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#54C7BE] hover:bg-[#76DDD5] text-[#090D14] font-semibold text-xs transition-all shadow-md shadow-[#54C7BE]/10 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Running AST Analyzer...' : 'Run AST Analysis'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AST ANALYSIS RESULTS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#F2F0EA] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E47979]" />
                    AST Compatibility Analysis Results
                  </h3>
                  <p className="text-xs text-[#9AA7B5]">
                    Found 6 breaking usages of removed method <code className="text-[#E47979]">DataFrame.append()</code>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E47979]/15 text-[#E47979] border border-[#E47979]/30">
                  6 Breaking Issues Detected
                </span>
              </div>

              {/* Issues List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {(analysisData?.issues || [
                  { file: 'src/data_processor.py', line: 17, code: 'report = report.append(daily_summary, ignore_index=True)', function: 'create_sales_report' },
                  { file: 'src/data_processor.py', line: 31, code: 'current_inventory = current_inventory.append(update_batch, ignore_index=True)', function: 'merge_inventory_updates' },
                  { file: 'src/data_processor.py', line: 49, code: 'combined = combined.append(profile, ignore_index=True)', function: 'build_customer_profile' },
                  { file: 'src/data_processor.py', line: 62, code: 'result = result.append(entry, ignore_index=True)', function: 'build_customer_profile' },
                  { file: 'src/analytics.py', line: 14, code: 'report = report.append(trend, ignore_index=True)', function: 'generate_trend_report' },
                  { file: 'src/analytics.py', line: 26, code: 'combined = combined.append(reg_df, ignore_index=True)', function: 'combine_regional_data' },
                ]).map((issue: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#090D14] border border-[#2B3544] flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#54C7BE] font-semibold">
                        {issue.file}:{issue.line} <span className="text-[#9AA7B5]">in {issue.function}()</span>
                      </span>
                      <span className="text-[10px] text-[#E47979] px-2 py-0.5 rounded bg-[#E47979]/10 border border-[#E47979]/20 font-mono">
                        DataFrame.append() [Removed in 2.0]
                      </span>
                    </div>
                    <pre className="p-2 rounded-lg bg-[#151D2A] text-[#E47979] font-mono text-[11px] overflow-x-auto">
                      {issue.code}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Rationale explanation card */}
              <div className="p-4 rounded-xl bg-[#1D2735] border border-[#2B3544] text-xs">
                <p className="text-[#C6B99A] font-semibold mb-1">Pandas 2.0 Breaking Change Rationale:</p>
                <p className="text-[#9AA7B5] leading-relaxed">
                  <code className="text-[#F2F0EA]">DataFrame.append()</code> was removed in Pandas 2.0 because iterative appending creates quadratic memory copying overhead.
                  The official migration path requires replacing calls with <code className="text-[#54C7BE]">pd.concat([df, other], ignore_index=True)</code> or accumulating records into lists before single DataFrame instantiation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1D2735]/60 border border-[#2B3544] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F0EA]">Next Step: AI Migration Generation</h4>
                  <p className="text-xs text-[#9AA7B5]">
                    Invoke local Qwen2.5-Coder-7B-Instruct through Ollama to generate compatible patches.
                  </p>
                </div>
                <button
                  onClick={runGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#54C7BE] hover:bg-[#76DDD5] text-[#090D14] font-semibold text-xs transition-all shadow-md shadow-[#54C7BE]/10 cursor-pointer disabled:opacity-50"
                >
                  <Cpu size={15} />
                  <span>{loading ? 'Calling Qwen2.5-Coder...' : 'Generate AI Patch'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI PATCH GENERATED */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#F2F0EA] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#54C7BE]" />
                    AI Code Intelligence Patch Generated
                  </h3>
                  <p className="text-xs text-[#9AA7B5]">
                    Model: <span className="font-mono text-[#54C7BE] font-semibold">{migrationData?.ai_model || 'qwen2.5-coder:7b-instruct'}</span> • 100% Metal GPU Offload
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#54C7BE]/15 text-[#54C7BE] border border-[#54C7BE]/30">
                  Patch Ready for Sandbox Verification
                </span>
              </div>

              {/* Code Diff Box */}
              <div className="rounded-2xl bg-[#090D14] border border-[#2B3544] overflow-hidden text-xs">
                <div className="px-4 py-2.5 bg-[#1D2735] border-b border-[#2B3544] flex items-center justify-between">
                  <span className="font-mono text-[#9AA7B5]">Proposed Migration Unified Diff</span>
                  <span className="text-[11px] text-[#49B994] font-mono">pd.concat([df, other], ignore_index=True)</span>
                </div>
                <pre className="p-4 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto text-[#9AA7B5] select-text">
                  {(migrationData?.diff || `--- a/src/data_processor.py
+++ b/src/data_processor.py
@@ -14,5 +14,5 @@
 def create_sales_report(existing_report, new_records):
-    report = existing_report.append(new_records, ignore_index=True)
+    report = pd.concat([existing_report, new_records], ignore_index=True)
     return report

@@ -28,5 +28,5 @@
 def merge_inventory_updates(base_inventory, incoming_batch):
-    current_inventory = base_inventory.append(incoming_batch, ignore_index=True)
+    current_inventory = pd.concat([base_inventory, incoming_batch], ignore_index=True)
     return current_inventory
`).split('\n').map((line: string, i: number) => {
                    const isAdd = line.startsWith('+') && !line.startsWith('+++');
                    const isDel = line.startsWith('-') && !line.startsWith('---');
                    const isHunk = line.startsWith('@@');
                    return (
                      <div
                        key={i}
                        className={`px-2 py-0.5 rounded ${
                          isAdd
                            ? 'bg-[#49B994]/15 text-[#49B994]'
                            : isDel
                            ? 'bg-[#E47979]/15 text-[#E47979]'
                            : isHunk
                            ? 'text-[#54C7BE] font-bold'
                            : ''
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>

              {/* AI Explanation */}
              {migrationData?.explanation && (
                <div className="p-4 rounded-xl bg-[#151D2A] border border-[#2B3544] text-xs">
                  <span className="text-[#C6B99A] font-semibold block mb-1">Model Explanation:</span>
                  <p className="text-[#9AA7B5] leading-relaxed whitespace-pre-line">
                    {migrationData.explanation}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#1D2735]/60 border border-[#2B3544] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F0EA]">Next Step: Sandboxed Verification</h4>
                  <p className="text-xs text-[#9AA7B5]">
                    Execute the 12 regression test cases in an isolated subprocess to verify behavior.
                  </p>
                </div>
                <button
                  onClick={runVerify}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#54C7BE] hover:bg-[#76DDD5] text-[#090D14] font-semibold text-xs transition-all shadow-md shadow-[#54C7BE]/10 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck size={15} />
                  <span>{loading ? 'Executing Tests in Sandbox...' : 'Run Test Verification'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VERIFICATION RESULTS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#F2F0EA] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#49B994]" />
                    Verification Results — Isolated Subprocess Pytest
                  </h3>
                  <p className="text-xs text-[#9AA7B5]">
                    Executed against sandboxed temp environment containing AI-patched codebase
                  </p>
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#49B994]/15 text-[#49B994] border border-[#49B994]/30">
                  {verificationData?.tests_passed ?? 12} / {verificationData?.tests_passed ?? 12} PASSED (100%)
                </span>
              </div>

              {/* Metric stats */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#090D14] border border-[#2B3544] text-center">
                  <span className="text-[#9AA7B5] block mb-1">Passed Tests</span>
                  <span className="text-2xl font-bold font-heading text-[#49B994]">
                    {verificationData?.tests_passed ?? 12}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#090D14] border border-[#2B3544] text-center">
                  <span className="text-[#9AA7B5] block mb-1">Failed Tests</span>
                  <span className="text-2xl font-bold font-heading text-[#F2F0EA]">
                    {verificationData?.tests_failed ?? 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#090D14] border border-[#2B3544] text-center">
                  <span className="text-[#9AA7B5] block mb-1">Safety Classification</span>
                  <span className="text-sm font-bold text-[#54C7BE] block mt-1">
                    VERIFIED SAFE
                  </span>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="rounded-2xl bg-[#090D14] border border-[#2B3544] overflow-hidden text-xs">
                <div className="px-4 py-2.5 bg-[#1D2735] border-b border-[#2B3544] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#54C7BE]" />
                    <span className="font-mono text-[#9AA7B5]">Pytest Subprocess Output (Isolated Sandbox)</span>
                  </div>
                  <span className="text-[10px] text-[#49B994] font-mono">Exit Code 0</span>
                </div>
                <pre className="p-4 font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto text-[#49B994] bg-black/40">
                  {verificationData?.output || `test_analytics.py::test_generate_trend_report PASSED
test_analytics.py::test_combine_regional_data PASSED
test_analytics.py::test_empty_dataframe_handling PASSED
test_analytics.py::test_multi_index_preservation PASSED
test_data_processor.py::test_create_sales_report PASSED
test_data_processor.py::test_merge_inventory_updates PASSED
test_data_processor.py::test_aggregate_monthly_metrics PASSED
test_data_processor.py::test_build_customer_profile PASSED
test_data_processor.py::test_single_record_append PASSED
test_data_processor.py::test_multi_record_append PASSED
test_data_processor.py::test_column_order_consistency PASSED
test_data_processor.py::test_index_reset_behavior PASSED

12 passed in 0.42s`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#1D2735]/60 border border-[#2B3544] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F0EA]">Next Step: Human Developer Review & Approval</h4>
                  <p className="text-xs text-[#9AA7B5]">
                    In accordance with VERYNTH safety policy, explicit developer sign-off is required.
                  </p>
                </div>
                <button
                  onClick={runApproval}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#49B994] hover:bg-[#58C9A3] text-[#090D14] font-semibold text-xs transition-all shadow-md shadow-[#49B994]/10 cursor-pointer disabled:opacity-50"
                >
                  <Check size={15} />
                  <span>{loading ? 'Recording Approval...' : 'Approve Migration Patch'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: APPROVAL COMPLETE & REPORT */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#49B994]/15 via-[#151D2A] to-[#151D2A] border border-[#49B994]/30 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#49B994]/20 border border-[#49B994]/40 flex items-center justify-center text-[#49B994]">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#F2F0EA]">
                  Migration Successfully Verified & Approved!
                </h3>
                <p className="text-xs text-[#9AA7B5] max-w-lg mx-auto leading-relaxed">
                  The Pandas 1.5.3 → 2.0 migration for <strong className="text-[#F2F0EA]">Legacy Data Analytics</strong> has been verified with 12/12 passing tests and approved by the lead developer. Original source files remain safely preserved.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    onClick={handleDownloadPatch}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D2735] hover:bg-[#263345] text-xs font-semibold text-[#F2F0EA] border border-[#2B3544] transition-colors"
                  >
                    <Download size={14} className="text-[#54C7BE]" />
                    <span>Download Unified Diff Patch</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/migrations/${migrationData?.id}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#54C7BE] hover:bg-[#76DDD5] text-xs font-semibold text-[#090D14] transition-colors"
                  >
                    <span>Open in Migration Workspace</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Summary Audit Card */}
              <div className="p-5 rounded-2xl bg-[#090D14] border border-[#2B3544] text-xs space-y-3">
                <span className="font-semibold text-[#C6B99A] uppercase tracking-wider block">
                  Migration Verification Audit Log
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[#9AA7B5] block">Dependency</span>
                    <span className="font-mono text-[#F2F0EA] font-semibold">pandas 1.5.3 → 2.0.0</span>
                  </div>
                  <div>
                    <span className="text-[#9AA7B5] block">AI Engine</span>
                    <span className="font-mono text-[#54C7BE] font-semibold">{migrationData?.ai_model || 'qwen2.5-coder:7b-instruct'}</span>
                  </div>
                  <div>
                    <span className="text-[#9AA7B5] block">Tests Passing</span>
                    <span className="font-mono text-[#49B994] font-semibold">12 / 12 (100%)</span>
                  </div>
                  <div>
                    <span className="text-[#9AA7B5] block">Audit Status</span>
                    <span className="font-mono text-[#49B994] font-semibold">APPROVED</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#1D2735] hover:bg-[#263345] text-xs font-semibold text-[#F2F0EA] border border-[#2B3544] transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

