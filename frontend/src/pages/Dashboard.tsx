import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Plus,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projRes, histRes] = await Promise.all([
        api.get<any[]>('/projects'),
        api.get<any[]>('/history'),
      ]);
      setProjects(projRes.data || []);
      setHistory(histRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalProjects = projects.length;
  const totalMigrations = history.length;
  const approvedMigrations = history.filter((h) => h.status === 'approved' || h.status === 'verified').length;
  const pendingMigrations = history.filter((h) => h.status === 'pending' || h.status === 'generating').length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-ivory">
            Engineering Overview
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Real-time status of dependencies, static AST audits, and sandboxed AI migrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={fetchData} icon={<RefreshCw size={14} />}>
            Refresh
          </Button>
          <Link to="/projects">
            <Button variant="primary" size="sm" icon={<Plus size={16} />}>
              Import Project
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error text-xs">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-midnight-slate border border-border p-5 hover:border-teal/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-text">Projects</span>
            <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
              <FolderGit2 size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-ivory mt-3">{totalProjects}</p>
          <p className="text-xs text-secondary-text mt-1">Active codebases tracked</p>
        </div>

        <div className="rounded-2xl bg-midnight-slate border border-border p-5 hover:border-champagne/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-text">Migrations</span>
            <div className="w-8 h-8 rounded-lg bg-champagne/10 text-champagne flex items-center justify-center">
              <GitBranch size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-ivory mt-3">{totalMigrations}</p>
          <p className="text-xs text-secondary-text mt-1">Total migration jobs logged</p>
        </div>

        <div className="rounded-2xl bg-midnight-slate border border-border p-5 hover:border-success/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-text">Verified & Approved</span>
            <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-success mt-3">{approvedMigrations}</p>
          <p className="text-xs text-secondary-text mt-1">Pytest-backed approvals</p>
        </div>

        <div className="rounded-2xl bg-midnight-slate border border-border p-5 hover:border-warning/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-text">In Flight</span>
            <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-warning mt-3">{pendingMigrations}</p>
          <p className="text-xs text-secondary-text mt-1">Pending AI review</p>
        </div>
      </div>

      {/* Main Workspace Grid: Projects on Left, Activity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Projects List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-ivory">Active Repositories</h2>
            <Link to="/projects" className="text-xs font-mono text-champagne hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl bg-midnight-slate/60 border border-dashed border-border p-8 text-center">
              <FolderGit2 className="mx-auto text-secondary-text mb-3" size={32} />
              <p className="text-sm font-semibold text-ivory">No projects imported yet</p>
              <p className="text-xs text-secondary-text mt-1 mb-4">
                Import your Python codebase or sample project to start AST compatibility analysis.
              </p>
              <Link to="/projects">
                <Button variant="primary" size="sm">Import Sample Project</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="rounded-xl bg-midnight-slate border border-border p-4 hover:border-teal/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center text-teal group-hover:scale-105 transition-transform">
                      <FolderGit2 size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-heading text-ivory group-hover:text-teal transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs font-mono text-secondary-text mt-0.5 truncate max-w-xs sm:max-w-md">
                        {proj.source}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-elevated text-secondary-text border border-border">
                      {proj.file_count} files
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      proj.status === 'analyzed'
                        ? 'bg-success/15 text-success'
                        : proj.status === 'analyzing'
                        ? 'bg-warning/15 text-warning animate-pulse'
                        : 'bg-teal/15 text-teal'
                    }`}>
                      {proj.status}
                    </span>
                    <ArrowRight size={14} className="text-secondary-text group-hover:text-ivory" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Migrations / Activity Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-ivory">Recent Migrations</h2>
            <Link to="/history" className="text-xs font-mono text-champagne hover:underline flex items-center gap-1">
              Audit log <ArrowRight size={12} />
            </Link>
          </div>

          <div className="rounded-2xl bg-midnight-slate border border-border p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 text-xs text-secondary-text">
                No migrations performed yet. Start by analyzing a project.
              </div>
            ) : (
              history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/migrations/${item.id}`)}
                  className="p-3 rounded-xl bg-elevated/50 border border-border/60 hover:border-champagne/40 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-ivory">
                        {item.dependency_name}
                      </span>
                      <span className="text-[10px] font-mono text-secondary-text">
                        {item.from_version} → {item.to_version}
                      </span>
                    </div>
                    <p className="text-[11px] text-secondary-text mt-0.5">
                      Project: {item.project_name}
                    </p>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    item.status === 'approved'
                      ? 'bg-success/15 text-success'
                      : item.status === 'verified'
                      ? 'bg-teal/15 text-teal'
                      : item.status === 'failed'
                      ? 'bg-error/15 text-error'
                      : 'bg-champagne/15 text-champagne'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

