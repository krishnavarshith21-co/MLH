import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  ArrowRight,
  RefreshCw,
  Search,
  Code,
  FileCode,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';

export function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  // Import form state
  const [projectName, setProjectName] = useState('Sample Legacy Project');
  const [projectPath, setProjectPath] = useState('/Users/krishnavarshithkamanaboina/Desktop/mlh/sample-project');

  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any[]>('/projects');
      setProjects(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !projectPath) return;

    setImporting(true);
    try {
      const res = await api.post<any>('/projects/import', {
        name: projectName,
        source: projectPath,
      });
      setModalOpen(false);
      navigate(`/projects/${res.data.id}`);
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-ivory">
            Codebase Repositories
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Imported software projects monitored for dependency obsolescence and breaking changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={fetchProjects} icon={<RefreshCw size={14} />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>
            Import Project
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 text-center text-secondary-text font-mono text-xs">
          Loading repositories...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl bg-midnight-slate/60 border border-dashed border-border p-12 text-center">
          <FolderGit2 className="mx-auto text-secondary-text mb-3" size={40} />
          <h3 className="text-base font-bold font-heading text-ivory">No Repositories Configured</h3>
          <p className="text-sm text-secondary-text mt-1 mb-6 max-w-md mx-auto">
            Import a controlled Python project or the pre-configured sample project to start automated analysis.
          </p>
          <Button variant="primary" onClick={() => setModalOpen(true)} icon={<Plus size={16} />}>
            Import Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="rounded-2xl bg-midnight-slate border border-border p-6 hover:border-teal/50 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-teal group-hover:scale-105 transition-transform">
                    <FolderGit2 size={20} />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    proj.status === 'analyzed'
                      ? 'bg-success/15 text-success'
                      : proj.status === 'analyzing'
                      ? 'bg-warning/15 text-warning animate-pulse'
                      : 'bg-teal/15 text-teal'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-ivory group-hover:text-teal transition-colors">
                  {proj.name}
                </h3>
                <p className="text-xs font-mono text-secondary-text mt-1 line-clamp-2">
                  {proj.source}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-secondary-text">
                <span className="flex items-center gap-1.5 text-ivory">
                  <FileCode size={14} className="text-teal" />
                  {proj.file_count} files
                </span>
                <span className="text-champagne font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Import Codebase">
        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary-text uppercase tracking-wider mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-midnight-slate border border-border text-sm text-ivory placeholder-secondary-text/50 focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary-text uppercase tracking-wider mb-1.5">
              Local File Path
            </label>
            <input
              type="text"
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-midnight-slate border border-border text-sm text-ivory font-mono placeholder-secondary-text/50 focus:outline-none focus:border-champagne"
            />
            <p className="text-[11px] text-secondary-text mt-1.5">
              Path on server. Default points to the verified demonstration project with Pandas 1.5.3.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={importing}>
              {importing ? 'Importing...' : 'Confirm Import'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
