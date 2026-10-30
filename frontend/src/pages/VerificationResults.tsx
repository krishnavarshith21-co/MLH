import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Terminal, Cpu, Clock, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export function VerificationResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await api.get<any>(`/migrations/${id}/report`);
        setReport(res.data);
      } catch (err: any) {
        alert(`Failed to load verification report: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-secondary-text font-mono text-xs">
        Loading test execution records...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-16 text-center text-error font-mono text-sm">
        Report not found.
      </div>
    );
  }

  const { migration, verifications, summary } = report;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-6 border-b border-border/80">
        <Link to={`/migrations/${id}`} className="inline-flex items-center gap-2 text-sm text-secondary-text hover:text-ivory font-mono">
          <ArrowLeft size={16} /> Back to Migration Workspace
        </Link>
        <span className="text-xs font-mono text-secondary-text">
          Audit ID: {id}
        </span>
      </div>

      {/* Main Report Header Card */}
      <div className="rounded-2xl bg-midnight-slate border border-border p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success border border-success/20 flex items-center justify-center">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold font-heading text-ivory">
                  Verification Report
                </h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                  summary.latest_status === 'passed'
                    ? 'bg-success/15 text-success'
                    : 'bg-warning/15 text-warning'
                }`}>
                  {summary.latest_status}
                </span>
              </div>
              <p className="text-xs font-mono text-secondary-text mt-1">
                Pandas upgrade ({summary.from_version} → {summary.to_version})
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-teal">Model: {summary.ai_model}</span>
            <p className="text-[11px] text-secondary-text font-mono mt-0.5">
              Total sandbox runs: {summary.total_attempts}
            </p>
          </div>
        </div>

        {/* Verification Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs font-mono">
          <div>
            <span className="text-secondary-text block">Overall Verdict</span>
            <span className="text-success font-bold mt-0.5 block flex items-center gap-1">
              <CheckCircle2 size={14} /> Passed Selected Tests
            </span>
          </div>
          <div>
            <span className="text-secondary-text block">Passing Attempts</span>
            <span className="text-ivory font-semibold mt-0.5 block">{summary.passed_attempts} of {summary.total_attempts}</span>
          </div>
          <div>
            <span className="text-secondary-text block">Subprocess Isolation</span>
            <span className="text-teal font-semibold mt-0.5 block">Sandboxed Pytest</span>
          </div>
          <div>
            <span className="text-secondary-text block">Migration Status</span>
            <span className="text-champagne font-semibold mt-0.5 block uppercase">{migration.status}</span>
          </div>
        </div>
      </div>

      {/* Verification Attempt Runs */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold font-heading text-ivory">
          Verification Execution Attempts ({verifications.length})
        </h2>

        {verifications.map((ver: any, idx: number) => (
          <div key={ver.id} className="rounded-2xl bg-midnight-slate border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono text-ivory">
                  Attempt #{ver.attempt_number}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                  ver.status === 'passed' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
                }`}>
                  {ver.status}
                </span>
              </div>
              <span className="text-xs font-mono text-secondary-text">
                {ver.tests_passed} passed, {ver.tests_failed} failed
              </span>
            </div>

            {/* Terminal Pytest Log Output */}
            <div className="rounded-xl bg-obsidian p-4 font-mono text-xs text-secondary-text border border-border overflow-x-auto">
              <div className="flex items-center gap-2 text-teal mb-2 pb-1 border-b border-border/40 text-[11px]">
                <Terminal size={13} />
                <span>Isolated Pytest Subprocess Stdout</span>
              </div>
              <pre className="text-secondary-text leading-relaxed whitespace-pre-wrap">
                {ver.output || 'No output recorded'}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

