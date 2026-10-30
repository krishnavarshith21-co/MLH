import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DiffEditor } from '@monaco-editor/react';
import {
  GitBranch,
  Wand2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCode,
  Layers,
  ChevronRight,
  ChevronDown,
  Terminal,
  Cpu,
  Clock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  PanelRightClose,
  PanelRightOpen,
  Download,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export function MigrationWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const [migration, setMigration] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [bottomLogOpen, setBottomLogOpen] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [activeFile, setActiveFile] = useState<string>('src/data_processor.py');

  const navigate = useNavigate();

  const fetchMigration = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get<any>(`/migrations/${id}`);
      setMigration(res.data);
    } catch (err: any) {
      alert(`Failed to load migration: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMigration();
  }, [id]);

  const handleGenerate = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await api.post<any>(`/migrations/${id}/generate`);
      setMigration(res.data);
    } catch (err: any) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await api.post<any>(`/migrations/${id}/verify`);
      setVerificationResult(res.data);
      // Refresh migration state
      await fetchMigration();
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await api.post<any>(`/migrations/${id}/approve`);
      setMigration(res.data);
      alert('Migration approved! Changes are certified and applied.');
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadDiff = () => {
    if (!migration?.diff) return;
    const blob = new Blob([migration.diff], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verynth-migration-${migration.id.slice(0, 8)}.diff`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-secondary-text font-mono text-xs">
        Loading migration workspace...
      </div>
    );
  }

  if (!migration) {
    return (
      <div className="p-16 text-center text-error font-mono text-sm">
        Migration record not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-hidden space-y-3">
      {/* Workspace Top Toolbar */}
      <div className="rounded-xl bg-midnight-slate border border-border p-3 px-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center text-teal">
            <GitBranch size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-heading text-ivory">
                Pandas 1.5.3 → 2.0.0 Migration
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                migration.status === 'approved'
                  ? 'bg-success/15 text-success'
                  : migration.status === 'verified'
                  ? 'bg-teal/15 text-teal'
                  : migration.status === 'generated'
                  ? 'bg-champagne/15 text-champagne'
                  : 'bg-warning/15 text-warning'
              }`}>
                {migration.status}
              </span>
            </div>
            <p className="text-[11px] font-mono text-secondary-text">
              Target ID: {migration.id.slice(0, 8)} • Attempts: {migration.attempts}
            </p>
          </div>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadDiff}
            disabled={!migration.diff}
            icon={<Download size={14} />}
          >
            Diff
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerate}
            disabled={actionLoading}
            icon={<Wand2 size={14} />}
          >
            {actionLoading ? 'Synthesizing...' : 'Generate Patch'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleVerify}
            disabled={actionLoading || !migration.migrated_code}
            icon={<ShieldCheck size={14} />}
          >
            Run Pytest Verification
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            disabled={actionLoading || migration.status === 'approved'}
            icon={<CheckCircle2 size={14} />}
          >
            {migration.status === 'approved' ? 'Approved' : 'Approve Migration'}
          </Button>

          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="p-2 text-secondary-text hover:text-ivory rounded-lg hover:bg-elevated ml-1"
            title={rightPanelOpen ? 'Collapse AI panel' : 'Expand AI panel'}
          >
            {rightPanelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </button>
        </div>
      </div>

      {/* Flagship Three-Region Center Section */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Left Region: Project Context (approx 20%) */}
        <div className="w-56 lg:w-64 bg-midnight-slate rounded-xl border border-border p-3.5 flex flex-col justify-between shrink-0 overflow-y-auto font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider block mb-2">
              Affected Source Files
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setActiveFile('src/data_processor.py')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                  activeFile === 'src/data_processor.py'
                    ? 'bg-elevated text-teal border border-teal/30'
                    : 'text-secondary-text hover:text-ivory hover:bg-elevated/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode size={14} />
                  <span className="truncate">data_processor.py</span>
                </div>
                <span className="text-[10px] text-error font-bold">4 calls</span>
              </button>

              <button
                onClick={() => setActiveFile('src/analytics.py')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                  activeFile === 'src/analytics.py'
                    ? 'bg-elevated text-teal border border-teal/30'
                    : 'text-secondary-text hover:text-ivory hover:bg-elevated/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode size={14} />
                  <span className="truncate">analytics.py</span>
                </div>
                <span className="text-[10px] text-error font-bold">2 calls</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60">
              <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider block mb-2">
                Upgrade Target
              </span>
              <div className="p-2.5 rounded-lg bg-elevated/40 border border-border/40 space-y-1 text-[11px]">
                <p className="text-ivory font-bold">Package: pandas</p>
                <p className="text-secondary-text">From: 1.5.3</p>
                <p className="text-teal font-semibold">To: 2.0.0 (Latest)</p>
                <p className="text-warning text-[10px] mt-1 pt-1 border-t border-border/40">
                  DataFrame.append() removed
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 text-[10px] text-secondary-text">
            <span>Branch: verynth/migration-pandas-2.0</span>
          </div>
        </div>

        {/* Center Region: Code Migration & Side-by-side Diff (Highest width) */}
        <div className="flex-1 rounded-xl bg-midnight-slate border border-border overflow-hidden flex flex-col min-w-0 shadow-lg">
          <div className="h-9 bg-elevated/80 border-b border-border flex items-center justify-between px-4 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-ivory font-semibold">{activeFile}</span>
              <span className="text-secondary-text text-[11px]">(Side-by-Side Unified Comparison)</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-error flex items-center gap-1">• Original Pandas 1.x</span>
              <span className="text-success flex items-center gap-1">• Proposed Pandas 2.x</span>
            </div>
          </div>

          <div className="flex-1 relative bg-[#090D14]">
            {migration.original_code && migration.migrated_code ? (
              <DiffEditor
                height="100%"
                language="python"
                original={migration.original_code}
                modified={migration.migrated_code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  renderSideBySide: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 12,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-secondary-text">
                <Wand2 size={36} className="text-champagne mb-3 animate-pulse" />
                <h3 className="text-base font-bold font-heading text-ivory">Ready for Code Migration</h3>
                <p className="text-xs text-secondary-text mt-1 mb-4 max-w-sm">
                  Click <strong>"Generate Patch"</strong> in the top toolbar to instruct Qwen2.5-Coder to migrate the syntax.
                </p>
                <Button variant="primary" size="sm" onClick={handleGenerate} disabled={actionLoading}>
                  Generate Patch
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Region: AI Intelligence Panel (Collapsible) */}
        {rightPanelOpen && (
          <div className="w-72 lg:w-80 bg-midnight-slate rounded-xl border border-border p-4 flex flex-col justify-between shrink-0 overflow-y-auto space-y-4 shadow-lg text-xs font-mono">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-teal" />
                  <span className="font-bold text-ivory">AI Model Intelligence</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal/10 text-teal border border-teal/20">
                  {migration.ai_model || 'qwen2.5-coder'}
                </span>
              </div>

              {/* Reasoning Summary */}
              <div className="mt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">
                  Reasoning & Patch Justification
                </span>
                <div className="p-3 rounded-lg bg-elevated/40 border border-border/40 text-secondary-text leading-relaxed whitespace-pre-line text-[11px] max-h-48 overflow-y-auto">
                  {migration.explanation || 'No patch generated yet. Click Generate Patch to view model reasoning.'}
                </div>
              </div>

              {/* Identified Risks */}
              <div className="mt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">
                  Risk & Safety Constraints
                </span>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-[11px] space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle size={12} /> Loop Concatenation Memory
                  </p>
                  <p className="text-secondary-text text-[10px]">
                    Repeated concatenation in loops creates intermediate allocations. Safe for current dataset bounds.
                  </p>
                </div>
              </div>

              {/* Verification Telemetry */}
              <div className="mt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-secondary-text tracking-wider">
                  Verification State
                </span>
                <div className="p-3 rounded-lg bg-elevated/60 border border-border text-[11px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-text">Pytest Sandbox:</span>
                    <span className={verificationResult?.status === 'passed' ? 'text-success font-bold' : 'text-champagne font-bold'}>
                      {verificationResult?.status || 'Awaiting Run'}
                    </span>
                  </div>
                  {verificationResult && (
                    <div className="pt-2 border-t border-border/40 text-[10px] space-y-1">
                      <p className="text-success">Passed tests: {verificationResult.tests_passed}</p>
                      <p className="text-error">Failed tests: {verificationResult.tests_failed}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <Link to={`/migrations/${migration.id}/verification`} className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-champagne text-[11px]">
                  View Detailed Verification Log →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Expandable Technical Activity Log */}
      <div className="rounded-xl bg-midnight-slate border border-border overflow-hidden shrink-0">
        <button
          onClick={() => setBottomLogOpen(!bottomLogOpen)}
          className="w-full h-8 px-4 bg-elevated/70 flex items-center justify-between font-mono text-xs text-secondary-text hover:text-ivory transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal size={13} className="text-teal" />
            <span className="font-semibold text-ivory">Technical Execution Event Log</span>
          </div>
          {bottomLogOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {bottomLogOpen && (
          <div className="p-3 px-4 bg-obsidian max-h-24 overflow-y-auto font-mono text-[11px] space-y-1 text-secondary-text">
            <p className="text-teal">[INFO] Repository AST scan parsed 6 source files cleanly.</p>
            <p className="text-champagne">[EVENT] Target dependency selected: pandas (1.5.3 → 2.0.0).</p>
            <p className="text-teal">[AI] Ingestion prompt submitted to Qwen2.5-Coder model.</p>
            {migration.migrated_code && (
              <p className="text-success">[PATCH] Code patch generated and unified diff constructed.</p>
            )}
            {verificationResult && (
              <p className="text-success">
                [TEST] Pytest subprocess finished with exit code {verificationResult.tests_failed === 0 ? '0' : '1'}: {verificationResult.tests_passed} passed.
              </p>
            )}
            {migration.status === 'approved' && (
              <p className="text-champagne font-bold">[APPROVED] Explicit developer approval recorded.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
