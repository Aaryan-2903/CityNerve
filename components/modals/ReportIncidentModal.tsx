'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertTriangle, MapPin, Camera, User, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCity } from '@/context/CityContext';
import { useAIDecisionContext } from '@/context/AIDecisionContext';
import { useIncidents } from '@/hooks/useIncidents';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INCIDENT_TYPES = [
  { id: 'fire', label: 'Fire', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'flood', label: 'Flood', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'medical', label: 'Medical', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'road_block', label: 'Road Block', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'power_outage', label: 'Power Outage', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'fallen_tree', label: 'Fallen Tree', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'building_damage', label: 'Building Damage', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'civil_unrest', label: 'Civil Unrest', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
];

export function ReportIncidentModal({ isOpen, onClose }: ReportIncidentModalProps) {
  const { currentCity } = useCity();
  const { addCustomRecommendation, addTimelineEvent } = useAIDecisionContext();
  const { updateFilter } = useIncidents(); // Just to re-trigger a fetch if we needed, though we can't easily refetch without a custom hook. For now, rely on standard refresh or mutate if we had SWR. 
  
  const [type, setType] = useState('fire');
  const [description, setDescription] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [reporterName, setReporterName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !locationStr) {
      setError('Please provide description and location.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const payload = {
        cityId: currentCity.id,
        type,
        description,
        location: {
          lat: currentCity.latitude + (Math.random() - 0.5) * 0.05,
          lng: currentCity.longitude + (Math.random() - 0.5) * 0.05,
          address: locationStr,
          district: 'Reported Area'
        },
        reporterName: reporterName || 'Anonymous Citizen'
      };

      const res = await fetch('http://127.0.0.1:8000/api/v1/incidents/citizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit report');
      const data = await res.json();
      
      // Inject AI recommendation to context
      if (data.aiRecommendation) {
        addCustomRecommendation({
          id: `ai-rec-${Date.now()}`,
          title: data.aiRecommendation.title,
          recommendation: data.aiRecommendation.recommendation,
          confidence: data.aiRecommendation.confidence,
          reasoning: data.aiRecommendation.reasoning,
          priority: data.aiRecommendation.priority,
          status: 'Pending'
        });
      }
      
      // Inject timeline event
      if (data.timelineEventText) {
        addTimelineEvent({
          id: `feed-evt-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.timelineEventText,
          dotColor: '#F59E0B',
          category: 'report',
          severity: data.incident?.severity === 'critical' ? 'Critical' : 'High'
        });
      }

      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setType('fire');
        setDescription('');
        setLocationStr('');
        setReporterName('');
        onClose();
        // Force refresh of incidents by updating filter back and forth (hack for now since we don't have mutate)
        updateFilter('search', ' ');
        setTimeout(() => updateFilter('search', ''), 100);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-lg bg-[#0A0E1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {isSuccess ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Report Submitted</h2>
              <p className="text-white/60 text-sm">Emergency services have been notified and AI triage is processing your report.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20 flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white/90">Report Incident</h2>
                    <div className="text-[11px] text-white/40 uppercase tracking-widest mt-0.5">
                      Citizen Reporting Portal
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {error}
                  </div>
                )}
                
                {/* Type Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-3">
                    Incident Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {INCIDENT_TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`py-2 px-2 rounded-lg border text-[11px] font-semibold transition-all duration-200 ${
                          type === t.id 
                            ? t.color + ' shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                            : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05] hover:text-white/70'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Enter address, landmark, or coordinates..."
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      className="w-full bg-[#050810] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe what you see. Are there injuries? Is it spreading?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-[#050810] border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Optional Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">
                      Photo (Optional)
                    </label>
                    <button type="button" className="w-full flex items-center justify-center gap-2 bg-[#050810] border border-dashed border-white/20 rounded-lg py-2.5 text-xs text-white/40 hover:bg-white/[0.02] hover:text-white/70 transition-colors">
                      <Camera className="w-4 h-4" /> Upload Image
                    </button>
                  </div>

                  {/* Optional Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">
                      Your Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="Anonymous"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        className="w-full bg-[#050810] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                  <Button type="button" variant="ghost" onClick={onClose} className="text-white/50 hover:text-white hover:bg-white/5">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !description || !locationStr}
                    className="bg-blue-600 hover:bg-blue-500 text-white gap-2 min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Report</>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
