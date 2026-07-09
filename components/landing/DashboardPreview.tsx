'use client';
import { motion } from 'framer-motion';

export function DashboardPreview() {
  return (
    <section className="py-16 sm:py-24 bg-[#0A101C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Unified Command Center</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Experience complete situational awareness through an interface designed for clarity and speed.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)] bg-[#070B14]"
        >
          {/* Top window bar to look like a desktop app */}
          <div className="h-8 sm:h-10 bg-[#0F172A] border-b border-slate-800 flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
          </div>
          <img
            src="docs/screenshots/dashboard.png"
            alt="CityNerve Dashboard Preview"
            className="w-full max-w-full h-auto object-cover border-b border-slate-800"
          />
        </motion.div>
      </div>
    </section>
  );
}

