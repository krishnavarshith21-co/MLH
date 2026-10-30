import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, migrations] = await Promise.all([api.get<any[]>('/projects'), api.get<any[]>('/history')]);
        setHistory(migrations.data);
        setProjects(res.data.map(p => ({...p, versionSub:p.language, dependencies:p.dep_file ? `${p.dep_file.split('\n').filter((line: string) => line.trim() && !line.trim().startsWith('#')).length} declared packages` : 'Not analyzed', lastMigration:migrations.data.find(m => m.project_name === p.name)?.created_at ? new Date(migrations.data.find(m => m.project_name === p.name).created_at).toLocaleDateString() : '—', updated:new Date(p.created_at).toLocaleDateString()})));
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="workspace">
      {error && <p role="alert" className="notice error">{error}</p>}
      {/* Page Heading - Image 9 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F2F0EA] tracking-tight">
          Project Overview
        </h1>
        <p className="text-sm text-[#9AA7B5] mt-1 font-body">
          Manage your dependency migrations with confidence.
        </p>
      </div>

      {/* 4 Metric / KPI Cards - Image 9 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Total Projects */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-6 min-h-[140px] flex items-center justify-between shadow-md hover:border-[#54C7BE]/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE] shrink-0">
              <FolderGit2 size={22} />
            </div>
            <div>
              <p className="!text-ivory text-[32px] font-bold font-heading">{loading ? '—' : projects.length}</p>
              <p className="text-sm text-[#9AA7B5] font-body mt-0.5">Total Projects</p>
            </div>
          </div>

        </div>

        {/* Card 2: Migrations */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-6 min-h-[140px] flex items-center justify-between shadow-md hover:border-[#54C7BE]/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE] shrink-0">
              <ArrowLeftRight size={22} />
            </div>
            <div>
              <p className="!text-ivory text-[32px] font-bold font-heading">{loading ? '—' : history.length}</p>
              <p className="text-sm text-[#9AA7B5] font-body mt-0.5">Migrations</p>
            </div>
          </div>

        </div>

        {/* Card 3: Successful */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-6 min-h-[140px] flex items-center justify-between shadow-md hover:border-[#54C7BE]/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE] shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="!text-ivory text-[32px] font-bold font-heading">{loading ? '—' : history.filter(m => m.status === 'approved').length}</p>
              <p className="text-sm text-[#9AA7B5] font-body mt-0.5">Successful</p>
            </div>
          </div>

        </div>

        {/* Card 4: Needs Review */}
        <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-6 min-h-[140px] flex items-center justify-between shadow-md hover:border-[#54C7BE]/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE] shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <p className="!text-ivory text-[32px] font-bold font-heading">{loading ? '—' : history.filter(m => m.status === 'verified' || m.status === 'generated').length}</p>
              <p className="text-sm text-[#9AA7B5] font-body mt-0.5">Needs Review</p>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Projects Table Card - Image 9 */}
      <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] shadow-xl overflow-hidden">
        {/* Table Card Header */}
        <div className="p-6 border-b border-[#2B3544] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCode2 size={20} className="text-[#54C7BE]" />
            <h2 className="text-lg font-bold font-heading text-[#F2F0EA]">
              Recent Projects
            </h2>
          </div>
          <Link to="/projects">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={15} />}
              className="bg-[#C6B99A] text-[#090D14] hover:bg-[#DDD2BA] font-semibold"
            >
              New Project
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto" tabIndex={0} aria-label="Scrollable records table">
          <table className="w-full min-w-[760px] text-left font-body text-sm">
            <thead className="bg-[#1D2735] border-b border-[#2B3544] text-[#9AA7B5] uppercase text-[11px] tracking-wider font-semibold select-none">
              <tr>
                <th className="py-4 px-6">Project Name</th>
                <th className="py-4 px-6">Dependencies</th>
                <th className="py-4 px-6">Last Migration</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Imported</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B3544]/60">
              {!projects.length && <tr><td colSpan={6} className="empty-state">{loading ? 'Loading projects…' : 'Import your first project to get started.'}</td></tr>}
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
                        <p className="text-[#F2F0EA] font-semibold text-sm">
                          {proj.name}
                        </p>
                        <p className="text-[11px] text-[#9AA7B5] font-body mt-0.5">
                          {proj.versionSub}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#9AA7B5]">
                    {proj.dependencies}
                  </td>
                  <td className="py-4 px-6 text-[#9AA7B5]">
                    {proj.lastMigration}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-body px-3 py-1 rounded-full font-medium ${
                        proj.statusVariant === 'success'
                          ? 'bg-[#49B994]/15 text-[#49B994] border border-[#49B994]/30'
                          : proj.statusVariant === 'progress'
                          ? 'bg-[#54C7BE]/15 text-[#54C7BE] border border-[#54C7BE]/30'
                          : 'bg-[#D5A86B]/15 text-[#D5A86B] border border-[#D5A86B]/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          proj.statusVariant === 'success'
                            ? 'bg-[#49B994]'
                            : proj.statusVariant === 'progress'
                            ? 'bg-[#54C7BE]'
                            : 'bg-[#D5A86B]'
                        }`}
                      />
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#9AA7B5]">
                    {proj.updated}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      aria-label="Open record"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${proj.id}`);
                      }}
                      className="p-1.5 text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#090D14] rounded-lg transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
