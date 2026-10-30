import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { DependencyVisualization } from '../three/DependencyVisualization';

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (55% desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Technical Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-elevated/80 border border-border/80 w-fit mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wider text-champagne uppercase">
                OPEN-WEIGHT SOFTWARE INTELLIGENCE
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-ivory tracking-tight leading-[1.1]"
            >
              Upgrade With <br className="hidden sm:inline" />
              <span className="gradient-text">Confidence.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-secondary-text max-w-2xl leading-relaxed font-body"
            >
              VERYNTH transforms risky dependency upgrades into explainable, AI-assisted
              migrations with test-backed verification. Powered by open-weight AI.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link to="/signup">
                <Button variant="primary" size="lg" icon={<ChevronRight size={18} />}>
                  Start a Migration
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="secondary" size="lg" icon={<ArrowUpRight size={18} />}>
                  Explore the Workflow
                </Button>
              </Link>
            </motion.div>

            {/* Capabilities Pill Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center text-teal">
                  <Cpu size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ivory">AI-Powered</p>
                  <p className="text-xs text-secondary-text">Qwen2.5-Coder model</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ivory">Test-Backed</p>
                  <p className="text-xs text-secondary-text">Sandboxed pytest suites</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-ivory">
                  <Code2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ivory">Human-Controlled</p>
                  <p className="text-xs text-secondary-text">Explicit patch review</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (45% desktop) 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <DependencyVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
