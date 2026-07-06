'use client';
import { motion } from 'framer-motion';
import { Activity, Map, CloudRain, Truck, Brain, ActivitySquare } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Live Incident Monitoring',
    description: 'Track active emergencies, severity levels, and response status in real-time with automated impact aggregation.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Map,
    title: 'Interactive Risk Map',
    description: 'High-performance vector maps plotting incidents, flood zones, and response routes across multiple cities.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    icon: Truck,
    title: 'Resource Tracking',
    description: 'Deploy, track, and manage emergency response assets and shelter capacities directly from the dashboard.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: CloudRain,
    title: 'Weather Intelligence',
    description: 'Real-time localized weather conditions, forecasts, and extreme weather alerts mapped to affected zones.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  },
  {
    icon: ActivitySquare,
    title: 'Disaster Simulation',
    description: 'Run realistic, multi-stage emergency scenarios for training, planning, and preparedness modeling.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    icon: Brain,
    title: 'AI Command Center',
    description: 'Intelligent decision support providing resource allocation recommendations and threat prioritization.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-[#0A101C]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Mission-Critical Capabilities</h2>
          <p className="text-slate-400 text-lg">
            Purpose-built tools for emergency operations with a UI optimized for high-pressure decision making.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feat.bg}`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
