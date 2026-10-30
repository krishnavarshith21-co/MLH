import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, FolderGit2, MoreVertical, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

export function HistoryPage() {
  const [params] = useSearchParams();
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get<any[]>('/history');
        setHistoryList(res.data.map(m => ({...m, project:m.project_name, path:m.dependency_name, fromTo:`${m.from_version || '—'} → ${m.to_version || '—'}`, status:m.status.toUpperCase(), statusVariant:m.status === 'approved' ? 'success' : 'progress', tests:'View report', date:new Date(m.created_at).toLocaleString()})));
      } catch (err: any) { setError(err.message); } finally {setLoading(false);}
    };
    fetchHistory();
  }, []);

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fromTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      (statusFilter === 'ALL' || item.status === statusFilter) && (!params.has('view') || item.status !== 'APPROVED');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="workspace">
      {error && <p role="alert" className="notice error">{error}</p>}
      {/* Header matching Image 10 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F2F0EA] tracking-tight">
          Migration History
        </h1>
        <p className="text-sm font-semibold text-[#F2F0EA] mt-1 font-body">
          Track all your dependency migrations
        </p>
        <p className="text-xs text-[#9AA7B5] mt-0.5 font-body">
          View the history of all your dependency upgrades, including versions, test results, and migration status.
        </p>
      </div>

      {/* Filter and Search Bar matching Image 10 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA7B5]"
          />
          <input
            aria-label="Search migrations" type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search migrations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151D2A] border border-[#2B3544] text-xs font-body text-[#F2F0EA] placeholder-[#9AA7B5]/60 focus:outline-none focus:border-[#C6B99A] transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select aria-label="Filter migration status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-[#151D2A] border border-[#2B3544] text-xs font-body text-[#F2F0EA] focus:outline-none focus:border-[#C6B99A] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option><option value="FAILED">Failed</option>
            <option value="GENERATED">Generated</option><option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA7B5] pointer-events-none"
          />
        </div>
      </div>

      {/* Table matching Image 10 */}
      <div className="rounded-2xl bg-[#151D2A] border border-[#2B3544] overflow-hidden shadow-xl">
        <div className="overflow-x-auto" tabIndex={0} aria-label="Scrollable records table">
          <table className="w-full min-w-[760px] text-left font-body text-sm">
            <thead className="bg-[#1D2735] border-b border-[#2B3544] text-[#9AA7B5] uppercase text-[11px] tracking-wider font-semibold select-none">
              <tr>
                <th className="py-4 px-6">Project</th>
                <th className="py-4 px-6">From → To</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Tests</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B3544]/60">{!filteredHistory.length && <tr><td colSpan={6} className="empty-state">{loading ? 'Loading migrations…' : 'No migrations match your filters.'}</td></tr>}
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/migrations/${item.id}`)}
                  className="hover:bg-[#1D2735]/60 cursor-pointer transition-colors h-16"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#090D14] border border-[#2B3544] flex items-center justify-center text-[#54C7BE] shrink-0">
                        <FolderGit2 size={16} />
                      </div>
                      <div>
                        <p className="text-[#F2F0EA] font-semibold text-sm">
                          {item.project}
                        </p>
                        <p className="text-[11px] text-[#9AA7B5] font-body mt-0.5">
                          {item.path}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#9AA7B5]">
                    {item.fromTo}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-body px-3 py-1 rounded-full font-semibold ${
                        item.statusVariant === 'success'
                          ? 'bg-[#49B994]/15 text-[#49B994] border border-[#49B994]/30'
                          : item.statusVariant === 'progress'
                          ? 'bg-[#54C7BE]/15 text-[#54C7BE] border border-[#54C7BE]/30'
                          : 'bg-[#D5A86B]/15 text-[#D5A86B] border border-[#D5A86B]/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.statusVariant === 'success'
                            ? 'bg-[#49B994]'
                            : item.statusVariant === 'progress'
                            ? 'bg-[#54C7BE]'
                            : 'bg-[#D5A86B]'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#49B994] font-semibold">
                    <a href={`/migrations/${item.id}/verification`} onClick={e => e.stopPropagation()} className="text-teal">{item.tests}</a>
                  </td>
                  <td className="py-4 px-6 text-[#9AA7B5]">
                    {item.date}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      aria-label="Open record"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/migrations/${item.id}`);
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
