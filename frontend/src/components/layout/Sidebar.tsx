import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  GitBranch,
  CheckCircle2,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: FolderGit2, label: 'Projects', path: '/projects' },
  { icon: GitBranch, label: 'Migrations', path: '/projects' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-midnight-slate/90 backdrop-blur-xl border-r border-border p-4 select-none">
      {/* Top Header & Logo */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-border/60">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne to-teal flex items-center justify-center shadow-lg shadow-teal/10">
              <span className="text-obsidian font-bold text-sm font-heading">V</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold font-heading text-ivory tracking-wide group-hover:text-champagne transition-colors">
                  VERYNTH
                </span>
                <span className="text-[10px] text-teal tracking-wider font-mono uppercase">
                  v1.0.0 Enterprise
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="hidden md:flex p-1.5 rounded-lg text-secondary-text hover:text-ivory hover:bg-elevated transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onMobileClose}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-elevated text-champagne border border-champagne/30 shadow-sm shadow-champagne/5'
                    : 'text-secondary-text hover:text-ivory hover:bg-elevated/50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className={isActive ? 'text-champagne' : 'text-secondary-text'} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & footer */}
      <div className="pt-4 border-t border-border/60 space-y-3">
        {!collapsed && user && (
          <div className="px-2 py-1.5 rounded-lg bg-elevated/40 border border-border/40">
            <p className="text-xs font-semibold text-ivory truncate">{user.name}</p>
            <p className="text-[11px] text-secondary-text truncate font-mono">{user.email}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-error/90 hover:text-error hover:bg-error/10 transition-colors"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative w-64 max-w-[80%] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

