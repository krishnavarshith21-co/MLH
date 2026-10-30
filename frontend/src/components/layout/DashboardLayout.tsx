import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Monitor, RefreshCw, Cpu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { AiStatusModal } from '../demo/AiStatusModal';
import { ResetDemoModal } from '../demo/ResetDemoModal';

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [aiOnline, setAiOnline] = useState<boolean | null>(null);

  const { isAuthenticated, user, logout, isPresentationMode, togglePresentationMode } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch me and AI status
  useEffect(() => {
    let active = true;
    if (isAuthenticated) {
      api.get<any>('/auth/me')
        .then((r) => {
          if (active) useAuthStore.setState({ user: r.data });
        })
        .catch((e) => {
          if (active && e.message === 'Unauthorized') logout();
        });

      api.get<any>('/demo/ai-status')
        .then((r) => {
          if (active) setAiOnline(r.data.online);
        })
        .catch(() => {
          if (active) setAiOnline(false);
        });
    }
    return () => {
      active = false;
    };
  }, [isAuthenticated, logout]);

  if (!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />;

  const isDemo = user?.is_demo || user?.email === 'demo@verynth.local';

  return (
    <div className={`min-h-screen bg-obsidian text-ivory flex ${isPresentationMode ? 'presentation-mode' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 min-h-[76px] bg-obsidian/95 backdrop-blur-xl border-b border-border flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <button
            className="md:hidden p-2 text-[#9AA7B5] hover:text-[#F2F0EA]"
            aria-label="Open sidebar menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Search bar */}
          <form
            className="relative flex-1 max-w-md hidden sm:block"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/projects?q=${encodeURIComponent(query)}`);
            }}
          >
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text" />
            <input
              aria-label="Search projects"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects & dependencies…"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-midnight-slate border border-border text-xs focus:outline-none focus:border-[#C6B99A] transition-colors"
            />
          </form>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Demo Environment Badge */}
            {isDemo && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#54C7BE]/15 border border-[#54C7BE]/30 text-[11px] font-mono text-[#54C7BE]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54C7BE] animate-pulse" />
                <span className="font-semibold">Demo Environment</span>
              </div>
            )}

            {/* AI Model Status Pill */}
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#151D2A] hover:bg-[#1D2735] border border-[#2B3544] text-xs font-mono text-[#F2F0EA] transition-all cursor-pointer group"
              title="Click to view AI Engine health & hardware acceleration"
            >
              <Cpu size={14} className="text-[#54C7BE]" />
              <span className="hidden md:inline font-medium">Qwen2.5-Coder-7B</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  aiOnline ? 'bg-[#49B994] shadow-[0_0_8px_rgba(73,185,148,0.6)]' : 'bg-[#D5A86B]'
                }`}
              />
            </button>

            {/* Presentation Mode Toggle */}
            <button
              type="button"
              onClick={togglePresentationMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isPresentationMode
                  ? 'bg-[#C6B99A] text-[#090D14] border-[#C6B99A] font-semibold shadow-md shadow-[#C6B99A]/20'
                  : 'bg-[#151D2A] text-[#9AA7B5] hover:text-[#F2F0EA] border-[#2B3544] hover:bg-[#1D2735]'
              }`}
              title="Toggle presentation-friendly high contrast and enlarged labels"
            >
              <Monitor size={14} />
              <span className="hidden lg:inline">
                {isPresentationMode ? 'Presentation On' : 'Presentation'}
              </span>
            </button>

            {/* Reset Demo Button (Only for demo accounts) */}
            {isDemo && (
              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#151D2A] hover:bg-[#D5A86B]/20 text-[#D5A86B] border border-[#D5A86B]/40 text-xs font-medium transition-all cursor-pointer"
                title="Reset demo projects and clear temporary migration runs"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
            )}

            {/* User Profile Avatar Link */}
            <Link
              to="/settings"
              aria-label="Account settings"
              className="w-9 h-9 shrink-0 rounded-full border border-teal/40 bg-teal/10 flex items-center justify-center font-bold text-xs text-[#F2F0EA] hover:border-teal transition-colors"
            >
              {user?.name?.[0]?.toUpperCase() || 'V'}
            </Link>
          </div>
        </header>

        <main className="flex-1 min-w-0 w-full p-4 sm:p-7 xl:p-10">
          <Outlet />
        </main>
      </div>

      {/* Demo AI Status Modal */}
      <AiStatusModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

      {/* Demo Reset Modal */}
      <ResetDemoModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onResetComplete={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
