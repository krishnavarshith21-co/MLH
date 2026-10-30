import { useEffect,useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import { api } from '../services/api';
export function VerificationResultsPage() {
const { id }=useParams(); const [report,setReport]=useState<any>(null),[error,setError]=useState(''); useEffect(() => { api.get<any>(`/migrations/${id}/report`).then(r => setReport(r.data)).catch(e => setError(e.message)) },[id]); return <div className="workspace">
    <Link to={`/migrations/${id}`} className="text-teal text-sm">← Migration workspace</Link>
    <div className="page-heading">
      <div>
        <h1>Test Results</h1>
        <p>Actual pytest output for each verification attempt.</p>
      </div>
    </div>{error&&<p className="notice error" role="alert">{error}</p>}{report?.verifications.map((v: any) =>
      <section className="panel" key={v.id}>
        <div className="panel-header">
          <h2>Attempt {v.attempt_number}</h2>
          <span className="status" data-status={v.status}>{v.status}</span>
        </div>
        <p>{v.tests_passed} passed · {v.tests_failed} failed · {new Date(v.created_at).toLocaleString()}</p>
        <pre className="overflow-auto p-6 bg-obsidian rounded-xl mt-6 text-sm">{v.output||v.error||'No output returned.'}</pre>
      </section>)}{!report?.verifications.length&&<div className="panel empty-state">{report? 'No verification runs yet. Run tests from the migration workspace.':error? 'Report unavailable.':'Loading results…'}</div>}</div>
}
