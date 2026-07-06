'use client';
import { motion } from 'framer-motion';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export function ProblemSolution() {
  return (
    <section className="py-24 bg-[#070B14]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-red-950/20 border border-red-900/30"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Problem</h3>
            <p className="text-slate-400 leading-relaxed">
              During active disasters, coordination between agencies breaks down because data is fragmented across disconnected systems. Responders waste critical minutes reconciling conflicting information instead of acting on it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-900/30"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The CityNerve Solution</h3>
            <p className="text-slate-400 leading-relaxed">
              We centralize all incident, weather, and resource data into a single operations view. Combined with an interactive geospatial map and AI-generated recommendations, responders get clarity instantly.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
