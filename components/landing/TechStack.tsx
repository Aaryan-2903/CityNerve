'use client';
import { motion } from 'framer-motion';

const tech = [
  "Next.js App Router",
  "React 18",
  "TypeScript",
  "Tailwind CSS",
  "MapLibre GL",
  "Framer Motion",
  "shadcn/ui",
  "Node.js"
];

export function TechStack() {
  return (
    <section className="py-24 bg-[#070B14] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-sm font-semibold tracking-widest text-slate-500 uppercase mb-8">
          Built with Modern Enterprise Technologies
        </h3>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {tech.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="px-6 py-3 rounded-full bg-[#0F172A] border border-slate-800 text-slate-300 font-medium shadow-sm hover:border-slate-600 transition-colors cursor-default"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
