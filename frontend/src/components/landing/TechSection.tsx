import React from 'react';
import { Cpu, Terminal, Zap, Code2, FlaskConical, Box } from 'lucide-react';

const technologies = [
  {
    name: 'Qwen2.5-Coder-7B',
    desc: 'Open-weight model for code understanding.',
    license: 'Apache 2.0',
    icon: Cpu,
  },
  {
    name: 'Python 3.12 + AST',
    desc: 'Static analysis to find deprecated APIs.',
    license: 'PSF License',
    icon: Terminal,
  },
  {
    name: 'FastAPI + SQLAlchemy',
    desc: 'Robust backend with SQLite persistence.',
    license: 'MIT License',
    icon: Zap,
  },
  {
    name: 'React + TypeScript',
    desc: 'Modern, responsive frontend with Three.js visualizations.',
    license: 'MIT / Apache 2.0',
    icon: Code2,
  },
  {
    name: 'Pytest Sandbox',
    desc: 'Isolated test execution with timeout and output capture.',
    license: 'MIT License',
    icon: FlaskConical,
  },
  {
    name: 'Ollama',
    desc: 'Local inference runtime with low latency.',
    license: 'MIT License',
    icon: Box,
  },
];

export function TechSection() {
  return (
    <section id="open-source" className="py-24 lg:py-24 bg-[#090D14] border-b border-[#2B3544]">
      <div className="container-enterprise">
        {/* Eyebrow and Heading matching Image 1 & 7 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151D2A] border border-[#2B3544] text-[10px] sm:text-[11px] font-body tracking-widest text-[#54C7BE] uppercase mb-4 shadow-sm">
            <span>• BUILT ON OPEN SOURCE •</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[38px] font-extrabold font-heading text-[#F2F0EA] tracking-tight">
            Transparent. Open Source. Built for Real Developers.
          </h2>
          <p className="text-base sm:text-lg text-[#9AA7B5] mt-4 leading-relaxed font-body">
            We build on trusted open-source tools to deliver transparent, reliable, and verifiable results.
          </p>
        </div>

        {/* 6 Technology Cards in 3x2 Grid matching Image 1 & 7 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="rounded-2xl bg-[#151D2A] border border-[#2B3544] p-7 flex flex-col justify-between hover:border-[#54C7BE]/50 hover:bg-[#151D2A]/90 transition-all duration-300 shadow-md h-full group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#1D2735] border border-[#2B3544] flex items-center justify-center text-[#54C7BE] group-hover:scale-105 transition-transform duration-200">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-body px-2.5 py-1 rounded-md bg-[#090D14] text-[#9AA7B5] border border-[#2B3544]">
                      {tech.license}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-[#F2F0EA] mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-[#9AA7B5] leading-relaxed font-body">
                    {tech.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
