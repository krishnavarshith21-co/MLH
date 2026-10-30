import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FolderGit2,
  FileCode,
  ScanEye,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchProjectData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any>(`/projects/${id}`);
      setProject(res.data);
      // Auto analyze if new or fetch existing analysis
      if (res.data.status === 'analyzed') {
        runAnalysis();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!id) return;
    setAnalyzing(true);
    try {
      const res = await api.post<any>(`/projects/${id}/analyze`);
      setDependencies(res.data.dependencies || []);
      setIssues(res.data.issues || []);
      if (project) {
        setProject({ ...project, status: 'analyzed' });
      }
    } catch (err: any) {
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartMigration = async (depId: string) => {
    if (!id) return;
    try {
      const res = await api.post<any>('/migrations', {
        project_id: id,
        dependency_id: depId,
      });
      navigate(`/migrations/${res.data.id}`);
    } catch (err: any) {
      alert(`Failed to start migration: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-secondary-text font-mono text-xs">
        Loading codebase details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center text-error font-mono text-sm">
        Project not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-midnight-slate border border-border p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-teal">
              <FolderGit2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-heading text-ivory">{project.name}</h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                  project.status === 'analyzed'
                    ? 'bg-success/15 text-success'
                    : 'bg-teal/15 text-teal'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-xs font-mono text-secondary-text mt-1">{project.source}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={runAnalysis}
              disabled={analyzing}
              icon={<ScanEye size={16} />}
            >
              {analyzing ? 'Scanning AST Trees...' : 'Run AST & Dep Audit'}
            </Button>
          </div>
        </div>

        {/* Project Metadata Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs font-mono">
          <div>
            <span className="text-secondary-text block">Language</span>
            <span className="text-ivory font-semibold mt-0.5 block">{project.language}</span>
          </div>
          <div>
            <span className="text-secondary-text block">Manifest File</span>
            <span className="text-champagne font-semibold mt-0.5 block">{project.dep_file || 'requirements.txt'}</span>
          </div>
          <div>
            <span className="text-secondary-text block">Python Files</span>
            <span className="text-ivory font-semibold mt-0.5 block">{project.file_count}</span>
          </div>
          <div>
            <span className="text-secondary-text block">AST Issues Flagged</span>
            <span className={`font-semibold mt-0.5 block ${issues.length > 0 ? 'text-warning' : 'text-success'}`}>
              {issues.length} detected
            </span>
          </div>
        </div>
      </div>

      {/* Dependencies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-ivory">Declared Dependencies</h2>
          <span className="text-xs font-mono text-secondary-text">
            {dependencies.length} packages indexed
          </span>
        </div>

        {dependencies.length === 0 ? (
          <div className="rounded-2xl bg-midnight-slate/60 border border-dashed border-border p-8 text-center text-xs text-secondary-text">
            No dependencies analyzed yet. Click <strong>"Run AST & Dep Audit"</strong> above to scan the codebase.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dependencies.map((dep) => (
              <div
                key={dep.id}
                className={`rounded-2xl bg-midnight-slate border p-5 flex flex-col justify-between transition-all ${
                  dep.has_breaking_changes
                    ? 'border-warning/40 hover:border-warning'
                    : 'border-border hover:border-teal/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold font-mono text-ivory">{dep.name}</span>
                    {dep.has_breaking_changes && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-warning/15 text-warning font-semibold">
                        <AlertTriangle size={11} /> Breaking Change
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs font-mono text-secondary-text">
                    <p>Current: <span className="text-ivory font-semibold">{dep.current_version || 'unpinned'}</span></p>
                    <p>Candidate Target: <span className="text-teal font-semibold">{dep.latest_version || '2.0.0'}</span></p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Button
                    variant={dep.has_breaking_changes ? 'primary' : 'secondary'}
                    size="sm"
                    className="w-full"
                    onClick={() => handleStartMigration(dep.id)}
                    icon={<GitBranch size={14} />}
                  >
                    Start AI Migration
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AST Telemetry / Incompatible Code Findings */}
      {issues.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-warning" size={18} />
            <h2 className="text-lg font-bold font-heading text-ivory">
              AST Compatibility Findings ({issues.length})
            </h2>
          </div>

          <div className="space-y-3">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-midnight-slate border border-border p-4 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 text-ivory font-semibold">
                    <span className="text-champagne">{issue.file}:{issue.line}</span>
                    <span className="text-secondary-text">in {issue.function || 'module'}</span>
                  </div>
                  <p className="text-error mt-1">
                    Detected call pattern: <code className="bg-obsidian px-1.5 py-0.5 rounded text-error">{issue.code}</code>
                  </p>
                  <p className="text-teal mt-0.5">{issue.suggestion}</p>
                </div>

                <span className="text-[10px] font-mono px-2 py-1 rounded bg-elevated text-warning border border-warning/30 uppercase shrink-0">
                  High Risk (Removed API)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

