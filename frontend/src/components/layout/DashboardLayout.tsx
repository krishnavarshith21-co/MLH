import { useState,useEffect } from 'react';
import { Outlet,Navigate,Link,useLocation,useNavigate } from 'react-router-dom';
import { Menu,Search } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
export function DashboardLayout() {
  const [collapsed,setCollapsed]=useState(false),[mobileOpen,setMobileOpen]=useState(false),[query,setQuery]=useState('');
  const { isAuthenticated,user,logout }=useAuthStore(); const location=useLocation(); const navigate=useNavigate();
  useEffect(() => { let active=true; if(isAuthenticated) api.get<any>('/auth/me').then(r => { if(active) useAuthStore.setState({ user: r.data }) }).catch(e => { if(active&&e.message==='Unauthorized') logout() }); return () => { active=false } },[isAuthenticated,logout]);
  if(!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />;
  return <div className="min-h-screen bg-obsidian text-ivory flex">
    <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
    <div className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-30 min-h-[76px] bg-obsidian/95 backdrop-blur-xl border-b border-border flex items-center justify-between gap-4 px-5 lg:px-10">
        <button className="md:hidden" aria-label="Open sidebar menu" onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>
        <form className="relative flex-1 max-w-xl" onSubmit={e => { e.preventDefault(); navigate(`/projects?q=${encodeURIComponent(query)}`) }}>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text" />
          <input aria-label="Search projects" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…" className="w-full pl-12 pr-4 rounded-xl bg-midnight-slate border border-border text-sm" />
        </form>
        <Link to="/settings" aria-label="Account settings" className="w-10 h-10 shrink-0 rounded-full border border-teal/40 bg-teal/10 flex items-center justify-center">{user?.name?.[0]?.toUpperCase()||'V'}</Link>
      </header>
      <main className="flex-1 min-w-0 w-full p-5 sm:p-8 xl:p-10">
        <Outlet />
      </main>
    </div>
  </div>
}
