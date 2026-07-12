'use client';
import { motion } from 'framer-motion';
import { Database, Activity, Brain, LayoutDashboard } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: "1. Data Sources",
    description: "Ingests weather APIs, citizen reports, and government data."
  },
  {
    icon: Activity,
    title: "2. Simulation Engine",
    description: "Models disaster progression and updates situational context."
  },
  {
    icon: Brain,
    title: "3. AI Decision Engine",
    description: "Analyzes threats and generates response recommendations."
  },
  {
    icon: LayoutDashboard,
    title: "4. Operations Dashboard",
    description: "Visualizes intelligence for human commanders to act upon."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#070B14] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-base">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">System Workflow</h2>
          <p className="text-slate-400 text-lg">How raw data is transformed into actionable intelligence.</p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-slate-800" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex flex-col items-center text-center w-full md:w-1/4"
            >
              <div className="w-24 h-24 rounded-full bg-[#0F172A] border-4 border-[#070B14] flex items-center justify-center mb-6 z-base relative">
                <div className="absolute inset-0 rounded-full border border-slate-700 animate-[spin_4s_linear_infinite]" />
                <step.icon className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
