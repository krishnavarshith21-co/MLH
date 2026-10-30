import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ArrowRight, RefreshCw, GitBranch, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get<any[]>('/history');
      setHistory(res.data || []);
    } catch (err: any) {
      alert(`Failed to load history: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-ivory">
            Migration History & Audit Log
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Permanent transactional record of dependency refactoring patches and verification runs.
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={fetchHistory} icon={<RefreshCw size={14} />}>
          Refresh Log
        </Button>
      </div>

      {/* History Table / Cards */}
      {loading ? (
        <div className="p-16 text-center text-secondary-text font-mono text-xs">
          Loading audit entries...
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl bg-midnight-slate/60 border border-dashed border-border p-12 text-center text-secondary-text text-sm">
          <HistoryIcon className="mx-auto mb-3 text-secondary-text" size={36} />
          <p className="font-semibold text-ivory">No Historical Migrations</p>
          <p className="text-xs text-secondary-text mt-1">
            Initiate and verify migrations from your projects to populate this audit log.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-midnight-slate border border-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-elevated/80 border-b border-border text-secondary-text uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-5">Project</th>
                  <th className="py-3 px-5">Dependency</th>
                  <th className="py-3 px-5">Version Jump</th>
                  <th className="py-3 px-5">Verification State</th>
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/migrations/${item.id}`)}
                    className="hover:bg-elevated/40 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-5 text-ivory font-bold">{item.project_name}</td>
                    <td className="py-4 px-5 text-teal">{item.dependency_name}</td>
                    <td className="py-4 px-5 text-secondary-text">
                      {item.from_version} → <span className="text-champagne font-semibold">{item.to_version}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
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
                    </td>
                    <td className="py-4 px-5 text-secondary-text text-[11px]">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="text-champagne hover:underline inline-flex items-center gap-1 font-sans text-xs font-medium">
                        Open <ArrowRight size={12} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
