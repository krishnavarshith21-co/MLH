import React, { useState } from 'react';
import { Settings as SettingsIcon, Cpu, Shield, Database, Save, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function SettingsPage() {
  const [model, setModel] = useState('qwen2.5-coder:1.5b-instruct');
  const [timeout, setTimeoutVal] = useState('60');
  const [attempts, setAttempts] = useState('3');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="pb-6 border-b border-border/80">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-ivory">
          Platform Configuration
        </h1>
        <p className="text-sm text-secondary-text mt-1">
          Inference settings, sandbox timeout limits, and AI self-correction parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Model Selection Card */}
        <div className="rounded-2xl bg-midnight-slate border border-border p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/60">
            <Cpu className="text-teal" size={20} />
            <h3 className="text-base font-bold font-heading text-ivory">
              AI Inference Engine
            </h3>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-secondary-text mb-1.5">
              Active Open-Weight Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-obsidian border border-border text-sm text-ivory font-mono focus:outline-none focus:border-champagne"
            >
              <option value="qwen2.5-coder:1.5b-instruct">qwen2.5-coder:1.5b-instruct (Fast Local Apple Silicon)</option>
              <option value="qwen2.5-coder:7b-instruct">qwen2.5-coder:7b-instruct (Recommended Full Precision)</option>
            </select>
            <p className="text-[11px] text-secondary-text mt-1.5">
              Connected via Ollama API on <code className="text-teal font-mono">http://localhost:11434</code>.
            </p>
          </div>
        </div>

        {/* Sandbox Limits Card */}
        <div className="rounded-2xl bg-midnight-slate border border-border p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/60">
            <Shield className="text-champagne" size={20} />
            <h3 className="text-base font-bold font-heading text-ivory">
              Subprocess Sandbox Security
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-secondary-text mb-1.5">
                Pytest Timeout (Seconds)
              </label>
              <input
                type="number"
                value={timeout}
                onChange={(e) => setTimeoutVal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian border border-border text-sm text-ivory font-mono focus:outline-none focus:border-champagne"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-secondary-text mb-1.5">
                Max AI Correction Loops
              </label>
              <input
                type="number"
                value={attempts}
                onChange={(e) => setAttempts(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian border border-border text-sm text-ivory font-mono focus:outline-none focus:border-champagne"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-mono text-success flex items-center gap-1.5">
              <Check size={14} /> Preferences persisted
            </span>
          ) : <span />}
          <Button type="submit" variant="primary" icon={<Save size={16} />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

