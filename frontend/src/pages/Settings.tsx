import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
export function SettingsPage() {
const { user }=useAuthStore(); const [tab,setTab]=useState('Profile'); return <div className="workspace max-w-5xl">
    <div className="page-heading">
      <div>
        <h1>Settings</h1>
        <p>Your account and platform configuration.</p>
      </div>
    </div>
    <div className="tabs" role="tablist" aria-label="Settings">{['Profile','API Settings','Model Configuration'].map(t =>
      <button key={t} role="tab" aria-selected={t===tab} onClick={() => setTab(t)}>{t}</button>)}</div>
    <section className="panel" role="tabpanel">
      <h2 className="mb-8">{tab}</h2>{tab==='Profile'? <div className="form-grid">
        <label className="field">Full name<input readOnly value={user?.name||''} />
        </label>
        <label className="field">Email<input readOnly value={user?.email||''} />
        </label>
        <p className="text-sm">Profile editing is not available on this server.</p>
      </div>:tab==='API Settings'? <div className="form-grid">
        <label className="field">API endpoint<input readOnly value="/api" />
        </label>
        <p>Requests use your authenticated session. Session credentials are never displayed here.</p>
      </div>:<div className="form-grid">
        <p>Qwen inference is configured on the backend. Each generated migration records the model used.</p>
        <p className="text-sm">Model and temperature changes are not available through this server's API.</p>
      </div>}</section>
  </div>
}
