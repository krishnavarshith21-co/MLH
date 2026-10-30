import { useState } from 'react';
import { RefreshCw, AlertTriangle, X, Check } from 'lucide-react';
import { api } from '../../services/api';

interface ResetDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetComplete: () => void;
}

export function ResetDemoModal({ isOpen, onClose, onResetComplete }: ResetDemoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/demo/reset');
      onResetComplete();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reset demo environment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#151D2A] border border-[#2B3544] shadow-2xl p-6 text-[#F2F0EA] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2B3544]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D5A86B]/15 border border-[#D5A86B]/30 flex items-center justify-center text-[#D5A86B]">
              <RefreshCw size={18} />
            </div>
            <h2 className="text-base font-bold font-heading text-[#F2F0EA]">
              Reset Demo Environment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#1D2735] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 text-xs text-[#9AA7B5]">
          {error && (
            <div className="p-3 rounded-xl bg-[#E47979]/15 border border-[#E47979]/30 text-[#E47979] flex items-center gap-2">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <p className="leading-relaxed">
            This operation resets the hackathon demonstration state back to its clean baseline:
          </p>

          <ul className="space-y-2 text-[#F2F0EA] font-medium pl-1">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-[#54C7BE]" />
              <span>Restores original Legacy Data Analytics source files</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-[#54C7BE]" />
              <span>Clears temporary demo patch generations and test logs</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-[#54C7BE]" />
              <span>Preserves all 3 sample projects and dependency records</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-[#54C7BE]" />
              <span>Does not impact any non-demo user data</span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-[#090D14] border border-[#2B3544] text-[11px] text-[#9AA7B5]">
            <span className="text-[#C6B99A] font-semibold block mb-0.5">Presenter Tip:</span>
            Use this between judge presentations to run the live migration walkthrough from scratch.
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#2B3544] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#1D2735] hover:bg-[#263345] text-xs font-semibold text-[#9AA7B5] hover:text-[#F2F0EA] border border-[#2B3544] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D5A86B] hover:bg-[#E5B87B] text-xs font-semibold text-[#090D14] transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Resetting...' : 'Confirm Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

