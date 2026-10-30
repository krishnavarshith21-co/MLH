import React from 'react';
import { Cpu, Terminal, Layers, Code, TestTube, Container, GitFork } from 'lucide-react';

const technologies = [
  {
    name: 'Qwen2.5-Coder-7B-Instruct',
    category: 'AI Engine',
    desc: 'Open-weight foundation model with code synthesis capabilities.',
    license: 'Apache 2.0',
    icon: Cpu,
    highlight: true,
  },
  {
    name: 'Python 3.12 + AST',
    category: 'Static Analysis',
    desc: 'Syntax tree parsing to pinpoint deprecated API attributes.',
    license: 'PSF License',
    icon: Terminal,
  },
  {
    name: 'FastAPI + SQLAlchemy',
    category: 'Backend Architecture',
    desc: 'Asynchronous REST APIs with SQLite transactional persistence.',
    license: 'MIT License',
    icon: Layers,
  },
  {
    name: 'React 19 + TypeScript',
    category: 'Frontend & 3D',
    desc: 'Component architecture with React Three Fiber dependency graphs.',
    license: 'MIT License',
    icon: Code,
  },
  {
    name: 'Pytest Subprocess Sandbox',
    category: 'Verification Runner',
    desc: 'Isolated test execution with timeout and output capture.',
    license: 'MIT License',
    icon: TestTube,
  },
  {
    name: 'Ollama Inference Runtime',
    category: 'Model Serving',
    desc: 'Local Apple Silicon / CUDA inference endpoint with low latency.',
    license: 'MIT License',
    icon: Container,
  },
];

export function TechSection() {
  return (
    <section className="py-24 bg-midnight-slate/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-xs font-mono text-teal uppercase mb-3">
            Open-Source Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-ivory tracking-tight">
            Built on Open Standards
          </h2>
          <p className="mt-3 text-secondary-text text-sm sm:text-base">
            Engineered exclusively with transparent, open-weight tooling and verifiable execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className={`rounded-2xl p-6 border transition-all ${
                  tech.highlight
                    ? 'bg-elevated/90 border-teal/40 shadow-lg shadow-teal/5'
                    : 'bg-midnight-slate border-border hover:border-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tech.highlight ? 'bg-teal/20 text-teal' : 'bg-elevated text-secondary-text'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-obsidian text-champagne border border-border">
                    {tech.license}
                  </span>
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-teal mb-1">
                  {tech.category}
                </p>
                <h3 className="text-base font-bold font-heading text-ivory">
                  {tech.name}
                </h3>
                <p className="text-xs text-secondary-text mt-2 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
