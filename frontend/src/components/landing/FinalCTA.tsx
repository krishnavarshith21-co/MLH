import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Github } from 'lucide-react';
import { Button } from '../ui/Button';

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-obsidian to-midnight-slate/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-teal/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-bold font-heading text-ivory tracking-tight leading-tight">
          Modernize Your Code. <br />
          <span className="gradient-text">Preserve Your Confidence.</span>
        </h2>
        <p className="mt-5 text-base sm:text-lg text-secondary-text max-w-xl mx-auto leading-relaxed">
          Upgrade dependencies without fear. Run our AST scanner, generate Qwen2.5-Coder patches, and verify in isolated sandboxes.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/signup">
            <Button variant="primary" size="lg" icon={<ChevronRight size={18} />}>
              Launch VERYNTH
            </Button>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-elevated/80 border border-border text-ivory hover:bg-elevated transition-colors text-sm font-medium"
          >
            <Github size={18} />
            <span>Open Source Repository</span>
          </a>
        </div>
      </div>
    </section>
  );
}
