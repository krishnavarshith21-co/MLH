import { useEffect,useState } from 'react';
import { Link,useParams,useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
export function ProjectDetailPage() {
  const { id }=useParams(); const navigate=useNavigate(); const [project,setProject]=useState<any>(null),[analysis,setAnalysis]=useState<any>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  useEffect(() => { api.get<any>(`/projects/${id}`).then(r => setProject(r.data)).catch(e => setError(e.message)) },[id]);
  async function analyze() { setBusy(true); setError(''); try { const r=await api.post<any>(`/projects/${id}/analyze`); setAnalysis(r.data) } catch(e: any) { setError(e.message) } finally { setBusy(false) } }
  async function migrate(dependency_id: string) { setBusy(true); setError(''); try { const r=await api.post<any>('/migrations',{ project_id: id,dependency_id }); navigate(`/migrations/${r.data.id}`) } catch(e: any) { setError(e.message) } finally { setBusy(false) } }
  return <div className="workspace">
    <Link className="text-teal text-sm" to="/projects">← Projects</Link>
    <div className="page-heading">
      <div>
        <h1>{project?.name||'Project analysis'}</h1>
        <p>Understand dependencies and review compatibility issues.</p>
      </div>
      <Button onClick={analyze} loading={busy} disabled={!project}>Analyze Dependencies</Button>
    </div>{error&&<p role="alert" className="notice error">{error}</p>}
    {!analysis? <div className="panel empty-state">Run an analysis to inspect this project's dependencies.</div>:<>
      <div className="grid sm:grid-cols-3 gap-6">{[['Source files',analysis.file_count],['Dependencies',analysis.dependencies.length],['Compatibility issues',analysis.total_issues]].map(([label,value]) =>
        <div className="panel" key={label}>
          <p>{label}</p>
          <strong className="text-3xl block mt-4">{value}</strong>
        </div>)}</div>
      <section className="panel">
        <h2 className="mb-6">Dependency Intelligence</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Installed</th>
                <th>Latest</th>
                <th>Compatibility</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{analysis.dependencies.map((d: any) =>
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.current_version||'—'}</td>
                <td>{d.latest_version||'Unknown'}</td>
                <td>{d.has_breaking_changes? 'Review required':d.is_outdated? 'Update available':'Current'}</td>
                <td>
                  <Button size="sm" disabled={busy||!d.is_outdated} onClick={() => migrate(d.id)}>Start Migration</Button>
                </td>
              </tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="panel">
        <h2 className="mb-6">Compatibility Analysis</h2>{analysis.issues.map((issue: any,i: number) =>
          <div key={i} className="py-6 border-t border-border">
            <code className="text-teal text-sm break-all">{issue.file}:{issue.line}</code>
            <pre className="overflow-auto my-4 text-sm">{issue.code}</pre>
            <p>{issue.suggestion}</p>
          </div>)}{!analysis.issues.length&&<p>No known breaking patterns detected.</p>}</section>
    </>}
  </div>
}
