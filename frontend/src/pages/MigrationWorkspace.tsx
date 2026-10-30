import { useEffect,useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import { DiffEditor } from '@monaco-editor/react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
export function MigrationWorkspacePage() {
  const { id }=useParams(); const [migration,setMigration]=useState<any>(null),[project,setProject]=useState<any>(null),[result,setResult]=useState<any>(null),[error,setError]=useState(''),[action,setAction]=useState('');
  useEffect(() => { api.get<any>(`/migrations/${id}`).then(async r => { setMigration(r.data); const p=await api.get<any>(`/projects/${r.data.project_id}`); setProject(p.data); const report=await api.get<any>(`/migrations/${id}/report`); setResult(report.data.verifications.at(-1) || null) }).catch(e => setError(e.message)) },[id]);
  function downloadPatch() { if(!migration?.diff) return; const url=URL.createObjectURL(new Blob([migration.diff],{ type: 'text/plain' })); const link=document.createElement('a'); link.href=url; link.download=`verynth-${id}.diff`; link.click(); URL.revokeObjectURL(url); }
  async function run(kind: string) { setAction(kind); setError(''); try { const r=await api.post<any>(`/migrations/${id}/${kind}`); if(kind==='verify') { setResult(r.data); const m=await api.get<any>(`/migrations/${id}`); setMigration(m.data) } else { setMigration(r.data); if(kind==='generate') setResult(null) } } catch(e: any) { setError(e.message) } finally { setAction('') } }
  return <div className="workspace">
    <Link className="text-teal text-sm" to={migration? `/projects/${migration.project_id}`:'/projects'}>← {project?.name||'Projects'}</Link>
    <div className="page-heading">
      <div>
        <h1>Migration Workspace</h1>
        <p>{migration? `${migration.from_version||'Current'} → ${migration.to_version||'Target'}`:'Loading migration…'}</p>
      </div>{migration&&<span className="status" data-status={migration.status}>{migration.status}</span>}</div>{error&&<p className="notice error" role="alert">{error}</p>}
    {migration&&<>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Code intelligence</h2>
            <p className="mt-2">Model: {migration.ai_model||'Not run yet'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={downloadPatch} disabled={!migration.diff}>Download Patch</Button>
            <Button onClick={() => run('generate')} loading={action==='generate'} disabled={!!action}>Generate Patch</Button>
            <Button variant="secondary" onClick={() => run('verify')} loading={action==='verify'} disabled={!!action||!migration.migrated_code}>Run Tests</Button>
            <Button variant="secondary" onClick={() => run('approve')} loading={action==='approve'} disabled={!!action||migration.status!=='verified'}>Approve Patch</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-secondary-text mb-4">
          <span>Original code</span>
          <span>AI-generated patch</span>
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          <DiffEditor height="500px" language="python" theme="vs-dark" original={migration.original_code||''} modified={migration.migrated_code||''} options={{ readOnly: true,fontSize: 14,fontFamily: 'JetBrains Mono, monospace',minimap: { enabled: false },scrollBeyondLastLine: false,automaticLayout: true,renderSideBySide: true,useInlineViewWhenSpaceIsLimited: true }} />
        </div>{!migration.migrated_code&&<p className="mt-6">Generate a patch to compare proposed changes.</p>}</section>
      {migration.explanation&&<section className="panel">
        <h2 className="mb-4">Migration explanation</h2>
        <p className="whitespace-pre-wrap">{migration.explanation}</p>
      </section>}
      <section className="panel">
        <div className="panel-header">
          <h2>Verification</h2>
          <Link className="text-teal text-sm" to={`/migrations/${id}/verification`}>View all test results →</Link>
        </div>{result? <>
          <span className="status" data-status={result.status}>{result.status} · {result.tests_passed} passed · {result.tests_failed} failed</span>
          <pre className="overflow-auto text-sm mt-6">{result.output||result.error||'No output returned.'}</pre>
        </>:<p>Run tests to verify the generated patch. Approval becomes available after verification.</p>}{migration.status==='approved'&&<p className="mt-4">Approval recorded. Review the patch before applying it to your repository.</p>}</section>
    </>}
  </div>
}
