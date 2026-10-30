import { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw, X, Shield, Zap } from 'lucide-react';
import { api } from '../../services/api';

interface AiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiStatusModal({ isOpen, onClose }: AiStatusModalProps) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any>('/demo/ai-status');
      setStatus(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to query AI engine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#151D2A] border border-[#2B3544] shadow-2xl p-6 sm:p-8 text-[#F2F0EA] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#54C7BE]/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#2B3544]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE]">
              <Cpu size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-[#F2F0EA]">
                Open-Weight AI Engine Status
              </h2>
              <p className="text-xs text-[#9AA7B5] font-body">
                Local inference stack powering code intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#1D2735] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#E47979]/15 border border-[#E47979]/30 text-[#E47979] text-xs flex items-center gap-2.5">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Operational Banner */}
          <div className="p-4 rounded-xl bg-[#1D2735] border border-[#2B3544] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#49B994] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#49B994]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F2F0EA]">
                  {status?.online ? 'Engine Operational & Ready' : 'Engine Connecting...'}
                </p>
                <p className="text-xs text-[#9AA7B5]">
                  {status?.provider || 'Ollama (Local Open-Weight)'}
                </p>
              </div>
            </div>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090D14] border border-[#2B3544] text-xs text-[#9AA7B5] hover:text-[#54C7BE] hover:border-[#54C7BE]/40 transition-colors"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>Recheck</span>
            </button>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#2B3544]">
              <span className="text-[#9AA7B5] block mb-1">Active Primary Model</span>
              <span className="font-mono text-[#54C7BE] font-semibold text-sm">
                {status?.active_model || 'qwen2.5-coder:7b-instruct'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#2B3544]">
              <span className="text-[#9AA7B5] block mb-1">Hardware Acceleration</span>
              <span className="font-semibold text-[#C6B99A] text-sm flex items-center gap-1">
                <Zap size={14} className="text-[#C6B99A]" />
                Metal GPU (100% Offload)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#2B3544]">
              <span className="text-[#9AA7B5] block mb-1">Inference Architecture</span>
              <span className="font-semibold text-[#F2F0EA]">
                Qwen2.5-Coder (Alibaba Cloud)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#2B3544]">
              <span className="text-[#9AA7B5] block mb-1">Sandboxed Verification</span>
              <span className="font-semibold text-[#49B994] flex items-center gap-1">
                <Shield size={14} />
                Isolated Subprocess Pytest
              </span>
            </div>
          </div>

          {/* Detected Models List */}
          <div className="p-4 rounded-xl bg-[#090D14] border border-[#2B3544]">
            <span className="text-xs font-semibold text-[#9AA7B5] uppercase tracking-wider block mb-2.5">
              Available Local Open-Weight Models
            </span>
            <div className="space-y-1.5">
              {(status?.models_detected?.length ? status.models_detected : ['qwen2.5-coder:7b-instruct', 'qwen2.5-coder:1.5b-instruct']).map((m: string) => (
                <div key={m} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#151D2A] border border-[#2B3544]/60 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#54C7BE]" />
                    <span className="font-mono text-[#F2F0EA]">{m}</span>
                  </div>
                  <span className="text-[10px] text-[#C6B99A] px-2 py-0.5 rounded bg-[#C6B99A]/10 border border-[#C6B99A]/20">
                    {m.includes('7b') ? 'Primary Demo' : 'Fast Fallback'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#2B3544] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1D2735] hover:bg-[#263345] text-xs font-semibold text-[#F2F0EA] border border-[#2B3544] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

