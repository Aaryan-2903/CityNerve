'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Activity, ShieldAlert, CheckCircle2, XCircle, Clock, History, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimulationContext } from '@/context/SimulationContext';
import { useAIDecisionContext, AIRecommendation, AIPriority } from '@/context/AIDecisionContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { generateDynamicStageConfig, SystemState } from '@/lib/ai/ruleEngine';
import type { ThreatLevel } from '@/data/simulationScenario';
import { SituationReportModal } from '@/components/ai/SituationReportModal';
import { AI_COMMANDER_CONFIG } from '@/data/aiCommanderConfig';

const THREAT_STYLES: Record<ThreatLevel, { color: string; bg: string; border: string; glow: string }> = {
  LOW: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.15)' },
  MODERATE: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', glow: 'rgba(245,158,11,0.15)' },
  HIGH: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', glow: 'rgba(239,68,68,0.2)' },
  CRITICAL: { color: '#DC2626', bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.3)', glow: 'rgba(220,38,38,0.3)' },
};

const PRIORITY_STYLES: Record<AIPriority, { text: string; bg: string; border: string }> = {
  Critical: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  High: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  Low: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
};

const THINKING_STEPS = [
  'Scanning weather...',
  'Checking hospitals...',
  'Calculating flood spread...',
  'Optimizing resources...',
  'Generating recommendations...'
];

export function AIIncidentCommander() {
  const sim = useSimulationContext();
  const { statuses, approve, reject, decisionHistory, customRecommendations } = useAIDecisionContext();
  const { metricsData, liveWeather } = useDashboardData();
  
  const phase = sim?.phase ?? 0;
  
  const activeIncidents = parseInt(metricsData?.incidents?.value || '0');
  const roadsClosed = parseInt(metricsData?.roads?.value || '0');
  const deployedUnits = parseInt(metricsData?.deployed?.value || '0');
  
  const hospitalCapacityPercent = Math.max(0, 100 - (sim?.phase ?? 0) * 15);
  const shelterAvailabilityPercent = Math.max(0, 100 - (sim?.phase ?? 0) * 18);

  const systemState: SystemState = useMemo(() => ({
    riskScore: 0,
    activeIncidents,
    roadsClosed,
    hospitalCapacityPercent,
    shelterAvailabilityPercent,
    weatherLabel: liveWeather?.label ?? 'Clear',
    rainfall: Number(liveWeather?.rainfall) || 0,
    windSpeed: Number(liveWeather?.wind_speed) || 0,
    humidity: Number(liveWeather?.humidity) || 0,
    temperature: Number(liveWeather?.temperature) || 0,
    deployedUnits
  }), [activeIncidents, roadsClosed, hospitalCapacityPercent, shelterAvailabilityPercent, liveWeather, deployedUnits]);

  const stageConfig = useMemo(() => {
    return generateDynamicStageConfig(systemState, phase);
  }, [systemState, phase]);

  const threatLevel = stageConfig.threatLevel;

  const rawRecommendations = useMemo(() => {
    return [...customRecommendations, ...stageConfig.recommendations];
  }, [stageConfig.recommendations, customRecommendations]);
  
  const recommendations = rawRecommendations.map(rec => ({
    ...rec,
    status: statuses[rec.id] || 'Pending'
  })) as AIRecommendation[];

  const [lastAnalysisTime, setLastAnalysisTime] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [thinkingStepIndex, setThinkingStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'actions' | 'history'>('actions');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    setIsAnalyzing(true);
    setThinkingStepIndex(0);
    
    // Cycle through thinking steps
    const interval = setInterval(() => {
      setThinkingStepIndex(prev => {
        if (prev >= THINKING_STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setLastAnalysisTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 400 * THINKING_STEPS.length + 200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [phase]); // Re-analyze when phase changes

  useEffect(() => {
    if (!lastAnalysisTime) {
      setLastAnalysisTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [lastAnalysisTime]);

  const style = THREAT_STYLES[threatLevel] || THREAT_STYLES.LOW;

  return (
    <>
      <SituationReportModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)} 
        systemState={systemState}
        threatLevel={threatLevel}
        recommendations={recommendations}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full flex-col bg-[#050810] relative overflow-hidden rounded-2xl border border-white/[0.05]"
      >
        <div 
          className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-40 blur-3xl"
          style={{ background: `radial-gradient(circle at top right, ${style.glow}, transparent 60%)` }}
        />
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.05] px-4 py-3 shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
              <BrainCircuit className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-white/90">AI Incident Commander</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-white/40" />
                <span className="text-[10px] text-white/50 tracking-wide font-mono">
                  {isAnalyzing ? (
                    <motion.span
                      key={thinkingStepIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-cyan-400 font-semibold"
                    >
                      {THINKING_STEPS[thinkingStepIndex]}
                    </motion.span>
                  ) : `LAST ANALYSIS: ${lastAnalysisTime}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setReportModalOpen(true)}
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white/90 hover:bg-white/[0.05]"
              title="Generate Situation Report"
            >
              <FileText className="w-3.5 h-3.5" />
            </Button>
            
            <motion.div
              key={threatLevel}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-end"
            >
              <span className="text-[9px] uppercase tracking-wider text-white/40 mb-1 font-semibold">Threat Level</span>
              <div 
                className="flex items-center gap-1.5 rounded-md px-2 py-0.5 border"
                style={{ backgroundColor: style.bg, borderColor: style.border }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }} />
                <span className="text-[10px] font-bold tracking-widest" style={{ color: style.color }}>
                  {threatLevel}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-white/[0.05] bg-white/[0.01]">
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2 text-[11px] font-bold tracking-widest uppercase transition-colors ${activeTab === 'actions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/30 hover:text-white/50'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-3 h-3" /> Actions
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-[11px] font-bold tracking-widest uppercase transition-colors ${activeTab === 'history' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/30 hover:text-white/50'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <History className="w-3 h-3" /> History
            </span>
          </button>
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col flex-1 min-h-0 overflow-y-auto p-4 gap-4 custom-scrollbar">
          
          <AnimatePresence mode="wait">
            {activeTab === 'actions' ? (
              <motion.div 
                key="actions"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Situation Analysis */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400/80" />
                    <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Situation Analysis</h3>
                  </div>
                  
                  <motion.div
                    key={phase + 'analysis'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm flex flex-col gap-3"
                  >
                    <p className="text-xs text-white/80 leading-relaxed font-light">
                      {stageConfig.situationSummary}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col p-2 bg-black/20 rounded-lg border border-white/5">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Risk Score</span>
                        <span className="text-sm font-semibold text-white/90">{stageConfig.riskScore.toFixed(0)}/100</span>
                      </div>
                      
                      <div className="flex flex-col p-2 bg-black/20 rounded-lg border border-white/5">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Confidence</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-white/90 leading-none">{stageConfig.confidence}%</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${stageConfig.confidence}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col p-2 bg-black/20 rounded-lg border border-white/5">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Priority</span>
                        <div>
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[stageConfig.priority].bg} ${PRIORITY_STYLES[stageConfig.priority].border} ${PRIORITY_STYLES[stageConfig.priority].text}`}>
                            {stageConfig.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col p-2 bg-black/20 rounded-lg border border-white/5">
                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Est. Response</span>
                        <span className="text-sm font-semibold text-white/90">{stageConfig.estimatedResponseTime}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1 border-t border-white/5 pt-3">
                      <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Resource Allocation</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(stageConfig.resources).map(([name, count]) => (
                          <div key={name} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                            <span className="text-[10px] text-white/60">{name}</span>
                            <span className="text-xs font-semibold text-white">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Recommended Actions */}
                <div className="space-y-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-400/80" />
                    <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Action Items</h3>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {recommendations.map((rec) => {
                        const prioStyle = PRIORITY_STYLES[rec.priority];
                        
                        return (
                          <motion.div
                            key={rec.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex flex-col gap-1">
                                <div className="font-semibold text-sm text-white/90">
                                  {rec.title}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${prioStyle.bg} ${prioStyle.border} ${prioStyle.text}`}>
                                    {rec.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-white/70 mb-3 font-light">
                              {rec.recommendation}
                            </p>
                            
                            <div className="space-y-1.5 border-t border-white/[0.04] pt-3 mb-3">
                              {rec.reasoning.map((point, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[10px] text-white/40">
                                  <div className="w-1 h-1 rounded-full bg-white/20 mt-1.5 shrink-0" />
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>

                            {/* Status Actions */}
                            <div className="flex items-center mt-2">
                              {rec.status === 'Pending' ? (
                                <div className="flex gap-2 w-full">
                                  <Button
                                    onClick={() => approve(rec)}
                                    disabled={isAnalyzing}
                                    className="flex-1 h-8 rounded-lg text-[11px] font-bold transition-all duration-300 bg-blue-600/90 hover:bg-blue-500 text-white shadow-lg border-0 disabled:opacity-50"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => reject(rec)}
                                    disabled={isAnalyzing}
                                    variant="outline"
                                    className="h-8 px-3 rounded-lg text-[11px] font-semibold border-white/[0.08] bg-white/[0.02] text-white/50 hover:text-white/90 hover:bg-white/[0.05] disabled:opacity-50"
                                  >
                                    Dismiss
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                                  {rec.status === 'Approved' ? (
                                    <><CheckCircle2 className="w-3.5 h-3.5 text-green-400/60" /> <span className="text-[11px] font-semibold text-white/40">Approved</span></>
                                  ) : (
                                    <><XCircle className="w-3.5 h-3.5 text-red-400/60" /> <span className="text-[11px] font-semibold text-white/40">Dismissed</span></>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3 pb-4"
              >
                {decisionHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-white/30 gap-2">
                    <History className="w-6 h-6 mb-2" />
                    <span className="text-[11px] tracking-widest uppercase">No history available</span>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {decisionHistory.map((entry, index) => {
                      const prioStyle = PRIORITY_STYLES[entry.priority];
                      return (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                        >
                          <div className="flex justify-between items-start mb-2 border-b border-white/[0.05] pb-2">
                            <span className="text-[10px] font-mono text-white/40">{entry.timestamp}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${prioStyle.bg} ${prioStyle.border} ${prioStyle.text}`}>
                                {entry.priority}
                              </span>
                              {entry.status === 'Approved' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-red-400" />
                              )}
                            </div>
                          </div>
                          <div className="font-semibold text-[13px] text-white/80 mb-1">{entry.title}</div>
                          <div className="text-[11px] text-white/50 line-clamp-2">{entry.recommendation}</div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

