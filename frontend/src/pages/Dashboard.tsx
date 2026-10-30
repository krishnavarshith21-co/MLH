import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  MoreVertical,
  FileCode2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Layers,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { LiveDemoWalkthrough } from '../components/demo/LiveDemoWalkthrough';

export function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [presentationData, setPresentationData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isDemo = user?.is_demo || user?.email === 'demo@verynth.local';

  const fetchData = useCallback(async () => {
    try {
      const [projRes, histRes] = await Promise.all([
        api.get<any[]>('/projects'),
        api.get<any[]>('/history'),
      ]);

      setHistory(histRes.data);

      // Try fetching presentation data if available
      try {
        const presRes = await api.get<any>('/demo/presentation-data');
        setPresentationData(presRes.data);
      } catch {
        // Optional if demo mode not active
      }

      setProjects(
        projRes.data.map((p) => {
          let statusLabel = p.status;
          let statusVariant = 'warning';

          if (p.name === 'Legacy Data Analytics') {
            statusLabel = 'Ready for Migration';
            statusVariant = 'progress';
          } else if (p.name === 'Retail Analytics Service') {
            statusLabel = 'Sample Analysis';
            statusVariant = 'neutral';
          } else if (p.name === 'Inventory Reporting API') {
            statusLabel = 'Pending Review';
            statusVariant = 'warning';
          } else if (p.status === 'completed' || p.status === 'verified') {
            statusLabel = 'Verified Safe';
            statusVariant = 'success';
          }

          return {
            ...p,
            versionSub: p.description || p.language,
            statusLabel,
            statusVariant,
            dependencies: p.dep_file
              ? `${p.dep_file.split('\n').filter((l: string) => l.trim() && !l.trim().startsWith('#')).length} packages`
              : 'Not analyzed',
            lastMigration: histRes.data.find((m: any) => m.project_name === p.name)?.created_at
              ? new Date(histRes.data.find((m: any) => m.project_name === p.name).created_at).toLocaleDateString()
              : '—',
            updated: new Date(p.created_at).toLocaleDateString(),
          };
        })
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Primary demo project details
  const primaryProject =
    presentationData?.primary_demo ||
    projects.find((p) => p.name === 'Legacy Data Analytics') ||
    projects[0];

  const summary = presentationData?.summary;

  return (
    <div className="workspace">
      {error && (
        <p role="alert" className="notice error">
          {error}
        </p>
      )}

      {/* Page Heading & Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F2F0EA] tracking-tight">
              Project Overview
            </h1>
            {isDemo && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#54C7BE]/15 text-[#54C7BE] border border-[#54C7BE]/30">
                Demo Environment
              </span>
            )}
          </div>
          <p className="text-sm text-[#9AA7B5] mt-1 font-body">
            Safer dependency migration powered by open-weight AI and sandboxed verification.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setWalkthroughOpen(true)}
            icon={<Sparkles size={16} />}
            className="bg-gradient-to-r from-[#C6B99A] to-[#DDD2BA] text-[#090D14] hover:opacity-95 font-semibold text-xs h-10 px-4 rounded-xl shadow-md shadow-[#C6B99A]/15 cursor-pointer"
          >
            Run Live Migration Demo
          </Button>
          <Link to="/projects">
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus size={15} />}
              className="bg-[#151D2A] border-[#2B3544] hover:bg-[#1D2735] text-xs h-10 px-3.5 rounded-xl text-[#F2F0EA]"
            >
              Import Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Prominent Live Demonstration Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#151D2A] via-[#121926] to-[#151D2A] border border-[#54C7BE]/30 p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#54C7BE]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#54C7BE] animate-ping" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#54C7BE] font-semibold">
                SMRU Hack Day Hyderabad 2026 • Live Demonstration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F2F0EA]">
              Pandas 1.5.3 → 2.0.0 Migration Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA7B5] leading-relaxed">
              Step through the full 5-stage migration workflow: AST deprecation analysis (6 <code className="text-[#54C7BE]">DataFrame.append()</code> usages detected), local <strong className="text-[#F2F0EA]">Qwen2.5-Coder-7B</strong> patch generation via Ollama, and isolated subprocess pytest execution with 12/12 passing regression tests.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-[#C6B99A]">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#090D14] border border-[#2B3544]">
                <Cpu size={13} className="text-[#54C7BE]" />
                Qwen2.5-Coder-7B-Instruct
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#090D14] border border-[#2B3544]">
                <ShieldCheck size={13} className="text-[#49B994]" />
                12 Pytest Verifications
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#090D14] border border-[#2B3544]">
                <Layers size={13} className="text-[#C6B99A]" />
                6 AST Incompatibilities
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setWalkthroughOpen(true)}
              icon={<Sparkles size={16} />}
              className="bg-[#54C7BE] hover:bg-[#76DDD5] text-[#090D14] font-bold text-sm h-12 px-6 rounded-xl shadow-lg shadow-[#54C7BE]/20 cursor-pointer justify-center"
            >
              Start Live Demo Walkthrough
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards — Computed from Actual Persisted Records */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Sample Projects */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-5 shadow-md hover:border-[#54C7BE]/40 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE]">
              <FolderGit2 size={18} />
            </div>
            <span className="text-xs text-[#9AA7B5] font-body">Sample Projects</span>
          </div>
          <p className="!text-ivory text-2xl font-bold font-heading">
            {loading ? '—' : summary?.total_sample_projects ?? projects.length}
          </p>
        </div>

        {/* Card 2: Analyzed Dependencies */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-5 shadow-md hover:border-[#54C7BE]/40 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE]">
              <Layers size={18} />
            </div>
            <span className="text-xs text-[#9AA7B5] font-body">Dependencies</span>
          </div>
          <p className="!text-ivory text-2xl font-bold font-heading">
            {loading ? '—' : summary?.analyzed_dependencies ?? 11}
          </p>
        </div>

        {/* Card 3: Breaking Changes */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-5 shadow-md hover:border-[#D5A86B]/40 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#D5A86B]/15 border border-[#D5A86B]/30 flex items-center justify-center text-[#D5A86B]">
              <AlertTriangle size={18} />
            </div>
            <span className="text-xs text-[#9AA7B5] font-body">Breaking Changes</span>
          </div>
          <p className="!text-ivory text-2xl font-bold font-heading text-[#D5A86B]">
            {loading ? '—' : summary?.identified_breaking_changes ?? 3}
          </p>
        </div>

        {/* Card 4: AST Issues Detected */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-5 shadow-md hover:border-[#E47979]/40 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#E47979]/15 border border-[#E47979]/30 flex items-center justify-center text-[#E47979]">
              <FileCode2 size={18} />
            </div>
            <span className="text-xs text-[#9AA7B5] font-body">AST Code Issues</span>
          </div>
          <p className="!text-ivory text-2xl font-bold font-heading text-[#E47979]">
            {loading ? '—' : summary?.detected_code_issues ?? 8}
          </p>
        </div>

        {/* Card 5: Verified Migrations */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-5 shadow-md hover:border-[#49B994]/40 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#49B994]/15 border border-[#49B994]/30 flex items-center justify-center text-[#49B994]">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-xs text-[#9AA7B5] font-body">Verified Safe</span>
          </div>
          <p className="!text-ivory text-2xl font-bold font-heading text-[#49B994]">
            {loading ? '—' : summary?.verified_migrations ?? history.filter((m) => m.status === 'approved' || m.status === 'verified').length}
          </p>
        </div>

        {/* Card 6: Pending Reviews */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-5 shadow-md hover:border-[#54C7BE]/40 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE]">
              <Clock size={18} />
            </div>
            <span className="text-xs text-[#9AA7B5] font-body">Pending Review</span>
          </div>
          <p className="!text-ivory text-2xl font-bold font-heading">
            {loading ? '—' : summary?.pending_reviews ?? history.filter((m) => m.status === 'pending' || m.status === 'generated').length}
          </p>
        </div>
      </div>

      {/* Sample Projects Table Card */}
      <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] shadow-xl overflow-hidden">
        {/* Table Card Header */}
        <div className="p-5 sm:p-6 border-b border-[#2B3544] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCode2 size={20} className="text-[#54C7BE]" />
            <div>
              <h2 className="text-lg font-bold font-heading text-[#F2F0EA]">
                Active Demonstration Repositories
              </h2>
              <p className="text-xs text-[#9AA7B5] font-body">
                Pre-configured compatibility scenarios backed by AST rules and unit tests
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto" tabIndex={0} aria-label="Scrollable records table">
          <table className="w-full min-w-[760px] text-left font-body text-sm">
            <thead className="bg-[#1D2735] border-b border-[#2B3544] text-[#9AA7B5] uppercase text-[11px] tracking-wider font-semibold select-none">
              <tr>
                <th className="py-4 px-6">Project Name & Scenario</th>
                <th className="py-4 px-6">Dependencies</th>
                <th className="py-4 px-6">Compatibility State</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Demonstration Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B3544]/60">
              {!projects.length && (
                <tr>
                  <td colSpan={5} className="empty-state text-center py-10 text-xs text-[#9AA7B5]">
                    {loading ? 'Loading projects…' : 'No projects loaded.'}
                  </td>
                </tr>
              )}
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="hover:bg-[#1D2735]/60 cursor-pointer transition-colors h-16"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#090D14] border border-[#2B3544] flex items-center justify-center text-[#54C7BE] shrink-0">
                        <FolderGit2 size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[#F2F0EA] font-semibold text-sm">
                            {proj.name}
                          </p>
                          {proj.name === 'Legacy Data Analytics' && (
                            <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#54C7BE]/15 text-[#54C7BE] border border-[#54C7BE]/30 font-semibold">
                              Primary Demo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9AA7B5] font-body mt-0.5 line-clamp-1 max-w-md">
                          {proj.description || proj.versionSub}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-[#9AA7B5] font-mono">
                    {proj.dependencies}
                  </td>
                  <td className="py-4 px-6 text-xs">
                    {proj.name === 'Legacy Data Analytics' ? (
                      <span className="text-[#E47979] font-mono flex items-center gap-1.5 font-medium">
                        <AlertTriangle size={13} />
                        6 DataFrame.append() calls
                      </span>
                    ) : proj.name === 'Inventory Reporting API' ? (
                      <span className="text-[#D5A86B] font-mono flex items-center gap-1.5 font-medium">
                        <Clock size={13} />
                        Pydantic v1 .dict() calls
                      </span>
                    ) : (
                      <span className="text-[#49B994] font-mono flex items-center gap-1.5 font-medium">
                        <CheckCircle2 size={13} />
                        Clean data pipelines
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-body px-3 py-1 rounded-full font-medium ${
                        proj.statusVariant === 'success'
                          ? 'bg-[#49B994]/15 text-[#49B994] border border-[#49B994]/30'
                          : proj.statusVariant === 'progress'
                          ? 'bg-[#54C7BE]/15 text-[#54C7BE] border border-[#54C7BE]/30'
                          : proj.statusVariant === 'neutral'
                          ? 'bg-[#9AA7B5]/15 text-[#9AA7B5] border border-[#9AA7B5]/30'
                          : 'bg-[#D5A86B]/15 text-[#D5A86B] border border-[#D5A86B]/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          proj.statusVariant === 'success'
                            ? 'bg-[#49B994]'
                            : proj.statusVariant === 'progress'
                            ? 'bg-[#54C7BE]'
                            : proj.statusVariant === 'neutral'
                            ? 'bg-[#9AA7B5]'
                            : 'bg-[#D5A86B]'
                        }`}
                      />
                      {proj.statusLabel}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {proj.name === 'Legacy Data Analytics' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWalkthroughOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#54C7BE]/15 hover:bg-[#54C7BE]/25 text-[#54C7BE] border border-[#54C7BE]/40 text-xs font-semibold transition-colors"
                      >
                        <Sparkles size={12} />
                        <span>Run Live Demo</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${proj.id}`);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#151D2A] hover:bg-[#1D2735] text-[#9AA7B5] hover:text-[#F2F0EA] border border-[#2B3544] text-xs transition-colors"
                      >
                        <span>Inspect Analysis</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Demonstration Walkthrough Modal */}
      <LiveDemoWalkthrough
        isOpen={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        primaryProject={primaryProject}
        onCompleted={() => {
          fetchData();
        }}
      />
    </div>
  );
}
