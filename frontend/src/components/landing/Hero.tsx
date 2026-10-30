import { Link } from 'react-router-dom';
import { ArrowRight, Play, Cpu, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { DependencyVisualization } from '../three/DependencyVisualization';

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden border-b border-[#2B3544]">
      {/* Background subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[480px] h-[240px] sm:h-[480px] bg-[#54C7BE]/8 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none overflow-hidden" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/3 -translate-y-1/2 w-[220px] sm:w-[440px] h-[220px] sm:h-[440px] bg-[#C6B99A]/8 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none overflow-hidden" />

      <div className="container-enterprise relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_1fr] gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: 52% on desktop (col-span-12 min-w-0) */}
          <div className="min-w-0 flex flex-col justify-center">
            {/* Small uppercase product eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151D2A] border border-[#2B3544] w-fit mb-6 shadow-sm max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#54C7BE] animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-body font-semibold tracking-wider text-[#C6B99A] uppercase truncate">
                OPEN-WEIGHT SOFTWARE INTELLIGENCE
              </span>
            </div>

            {/* Large Heading: Solid Ivory White (#F2F0EA) */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] font-extrabold font-heading text-[#F2F0EA] tracking-tight leading-[1.1] break-words">
              Upgrade With <br className="hidden sm:inline" />
              Confidence.
            </h1>

            {/* Concise Product Description */}
            <p className="mt-5 sm:mt-6 text-sm sm:text-lg lg:text-xl text-[#9AA7B5] max-w-2xl leading-relaxed font-body">
              VERYNTH transforms risky dependency upgrades into explainable,
              AI-assisted migrations with test-backed verification. Powered by open-weight AI.
            </p>

            {/* Primary and Secondary CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  Start a Migration
                </Button>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Play size={14} className="fill-current" />}
                >
                  Explore the Workflow
                </Button>
              </Link>
            </div>

            {/* Three Compact Product Capabilities */}
            <div className="mt-10 sm:mt-12 pt-8 border-t border-[#2B3544] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                <div className="w-10 h-10 rounded-lg bg-[#54C7BE]/15 border border-[#54C7BE]/30 flex items-center justify-center text-[#54C7BE] shrink-0">
                  <Cpu size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F2F0EA] font-heading">
                    AI-Powered
                  </p>
                  <p className="text-xs text-[#9AA7B5] font-body">
                    Qwen2.5-Coder model
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                <div className="w-10 h-10 rounded-lg bg-[#C6B99A]/15 border border-[#C6B99A]/30 flex items-center justify-center text-[#C6B99A] shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F2F0EA] font-heading">
                    Test-Backed
                  </p>
                  <p className="text-xs text-[#9AA7B5] font-body">
                    Sandboxed pytest verification
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#151D2A] border border-[#2B3544]">
                <div className="w-10 h-10 rounded-lg bg-[#49B994]/15 border border-[#49B994]/30 flex items-center justify-center text-[#49B994] shrink-0">
                  <UserCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F2F0EA] font-heading">
                    Developer Controlled
                  </p>
                  <p className="text-xs text-[#9AA7B5] font-body">
                    Review & approve changes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 48% on desktop (col-span-12 min-w-0) */}
          <div className="min-w-0 w-full flex items-center justify-center">
            <DependencyVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}
