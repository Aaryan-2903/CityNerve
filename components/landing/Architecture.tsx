'use client';

import { motion } from 'framer-motion';
import { Database, Server, Cpu, Globe, ArrowRight, Zap, Cloud, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const architectureNodes = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Next.js App Router, React 18, Tailwind CSS, MapLibre GL for GIS',
    icon: Globe,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'FastAPI for high-performance async processing and data ingestion',
    icon: Server,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  {
    id: 'ai',
    title: 'AI Engine',
    description: 'Rules-based threat assessment and LLM-powered decision support',
    icon: Cpu,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    id: 'database',
    title: 'Database',
    description: 'SQLite/PostgreSQL for persistent incident and resource state',
    icon: Database,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  }
];

const dataSources = [
  { name: 'Weather APIs', icon: Cloud },
  { name: 'Citizen Reports', icon: Activity },
  { name: 'Emergency Resources', icon: Zap }
];

export function Architecture() {
  return (
    <section id="architecture" className="relative py-24 bg-[#070B14] overflow-hidden border-t border-slate-800/50 scroll-mt-24">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            System Architecture
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            A resilient, real-time data pipeline designed to process urban emergencies at scale.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-5xl mx-auto">
          
          {/* Data Sources (Left) */}
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <h3 className="text-sm font-semibold tracking-widest text-slate-500 uppercase mb-2 text-center lg:text-left">
              Data Flow
            </h3>
            {dataSources.map((source, idx) => {
              const Icon = source.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-300"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{source.name}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Flow Arrows */}
          <div className="hidden lg:flex items-center justify-center text-slate-700">
            <ArrowRight className="w-8 h-8 animate-pulse" />
          </div>

          {/* Core System (Right) */}
          <div className="grid sm:grid-cols-2 gap-6 w-full lg:flex-1">
            {architectureNodes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className={cn(
                    "p-6 rounded-2xl border bg-[#0B0F1C]/80 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-colors",
                    node.border
                  )}
                >
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", node.bg)} />
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 border", node.bg, node.border)}>
                    <Icon className={cn("w-5 h-5", node.color)} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{node.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {node.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
