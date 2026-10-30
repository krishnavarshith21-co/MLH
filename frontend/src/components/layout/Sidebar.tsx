import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  GitBranch,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderGit2, label: 'Projects', path: '/projects' },
  { icon: GitBranch, label: 'Migrations', path: '/history?view=active' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#090D14] border-r border-[#2B3544] p-4 select-none">
      {/* Top Header & Logo */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#2B3544]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C6B99A] via-[#8FA39A] to-[#54C7BE] p-[1px] shadow-sm">
              <div className="w-full h-full rounded-[11px] bg-[#090D14] flex items-center justify-center">
                <span className="text-[#F2F0EA] font-extrabold text-sm font-heading">V</span>
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold font-heading text-[#F2F0EA] tracking-wide group-hover:text-[#C6B99A] transition-colors leading-none">
                  VERYNTH
                </span>
                <span className="text-[9px] font-body text-[#54C7BE] tracking-widest uppercase mt-1">
                  AI EVOLUTION
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="hidden md:flex p-1.5 rounded-lg text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#1D2735] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === 'Migrations'
              ? location.pathname.startsWith('/migrations') || (location.pathname === '/history' && location.search.includes('active'))
              : item.label === 'History' ? location.pathname === '/history' && !location.search.includes('active')
              : location.pathname === item.path || (item.path === '/projects' && location.pathname.startsWith('/projects/'));

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onMobileClose}
                className={`flex items-center gap-3.5 px-3.5 h-11 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#151D2A] text-[#54C7BE] border border-[#54C7BE]/30 shadow-[0_0_15px_rgba(84,199,190,0.1)]'
                    : 'text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#151D2A]'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="pt-4 border-t border-[#2B3544]">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1D2735] border border-[#54C7BE]/30 flex items-center justify-center font-bold text-xs text-[#F2F0EA] shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F2F0EA] truncate">
                  {user?.name || 'Your account'}
                </p>
                <p className="text-[11px] font-body text-[#9AA7B5] truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-[#9AA7B5] hover:text-[#E47979] hover:bg-[#1D2735] transition-colors"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block h-screen sticky top-0 shrink-0 z-40 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[248px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
