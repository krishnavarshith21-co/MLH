import { useEffect,useState } from 'react';
import { Link,useNavigate,useSearchParams } from 'react-router-dom';
import { FolderGit2,ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
export function ProjectsPage() {
  const [projects,setProjects]=useState<any[]>([]),[name,setName]=useState(''),[source,setSource]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
  const [params]=useSearchParams(); const [query,setQuery]=useState(params.get('q')||''); const navigate=useNavigate();
  useEffect(() => { setQuery(params.get('q')||'') },[params]);
  useEffect(() => { api.get<any[]>('/projects').then(r => setProjects(r.data)).catch(e => setError(e.message)).finally(() => setLoading(false)) },[]);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(''); try { const { data }=await api.post<any>('/projects/import',{ name,source }); navigate(`/projects/${data.id}`) } catch(e: any) { setError(e.message) } finally { setBusy(false) } }
  return <div className="workspace">
    <div>
      <Link to="/dashboard" className="text-teal text-sm">Workspace / Projects</Link>
      <div className="page-heading mt-4">
        <div>
          <h1>Import Project</h1>
          <p>Connect your Python project to analyze and migrate dependencies.</p>
        </div>
      </div>
    </div>
    {error&&<p className="notice error" role="alert">{error}</p>}
    <div className="grid xl:grid-cols-[2fr_1fr] gap-8">
      <section className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-3">
            <FolderGit2 className="text-teal" />
            <h2>Local project</h2>
          </div>
          <span className="status">Filesystem import</span>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <label className="field">Project name<input required value={name} onChange={e => setName(e.target.value)} placeholder="My Python project" />
          </label>
          <label className="field">Project folder path<input required value={source} onChange={e => setSource(e.target.value)} placeholder="/absolute/path/to/project" />
          </label>
          <p className="text-sm">Enter a folder accessible to the backend. Your project files stay on your machine.</p>
          <div>
            <Button type="submit" loading={busy} icon={<ArrowRight size={18} />} iconPosition="right">Import Project</Button>
          </div>
        </form>
      </section>
      <aside className="panel">
        <h2>Before you import</h2>
        <p className="mt-6 leading-relaxed">Choose the root folder of your Python project, including its source files and dependency manifest.</p>
        <p className="mt-6 leading-relaxed">Browser uploads and Git cloning are not available on this server. Clone your repository locally, then import its folder.</p>
      </aside>
    </div>
    <section className="panel">
      <div className="panel-header">
        <h2>Recently Imported Projects</h2>
        <input aria-label="Filter projects" className="search-field sm:!w-72" value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter projects…" />
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project name</th>
              <th>Language</th>
              <th>Source files</th>
              <th>Status</th>
              <th>Imported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).map(p =>
            <tr key={p.id}>
              <td>
                <Link className="text-ivory font-semibold" to={`/projects/${p.id}`}>{p.name}</Link>
              </td>
              <td>{p.language}</td>
              <td>{p.file_count}</td>
              <td>
                <span className="status">{p.status}</span>
              </td>
              <td>{new Date(p.created_at).toLocaleDateString()}</td>
              <td>
                <Link className="text-teal" to={`/projects/${p.id}`}>Open project →</Link>
              </td>
            </tr>)}</tbody>
        </table>{!projects.length&&<div className="empty-state">{loading? 'Loading projects…':'Your imported projects will appear here.'}</div>}</div>
    </section>
  </div>
}
