'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, FileText, MapPin, Activity, AlertTriangle, Building, Wind, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCity } from '@/context/CityContext';
import { SystemState } from '@/lib/ai/ruleEngine';
import { AIRecommendation } from '@/context/AIDecisionContext';
import { ThreatLevel } from '@/data/simulationScenario';

interface SituationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemState: SystemState;
  threatLevel: ThreatLevel;
  recommendations: AIRecommendation[];
}

export function SituationReportModal({ isOpen, onClose, systemState, threatLevel, recommendations }: SituationReportModalProps) {
  const { currentCity } = useCity();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      const originalElement = document.getElementById('sitrep-printable');
      if (!originalElement) return;

      // Dynamically import to prevent SSR issues
      const htmlToImage = await import('html-to-image');
      // @ts-ignore
      const jsPDF = (await import('jspdf')).default;
      
      // html-to-image natively uses SVG <foreignObject>, which means the browser renders
      // the CSS (including Tailwind v4 lab/oklch colors) perfectly without a custom JS parser.
      const dataUrl = await htmlToImage.toPng(originalElement, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0A0E1A',
        width: originalElement.scrollWidth,
        height: originalElement.scrollHeight,
        style: {
          margin: '0',
          padding: '24px',
          overflow: 'hidden', // Hide scrollbars in export
          maxHeight: 'none',
          height: `${originalElement.scrollHeight}px`
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const availableWidth = pdfWidth - margin * 2;
      
      // Calculate image dimensions to fit the PDF
      const imgProps = pdf.getImageProperties(dataUrl);
      const ratio = imgProps.width / imgProps.height;
      const imgHeight = availableWidth / ratio;
      
      // If the report is very long, it will be scaled down to fit on one page
      // To prevent it from becoming unreadably small on a single page, 
      // we might want to let it span multiple pages, but for now we fit it to width
      // and let the height be whatever it is. Wait, if imgHeight > pdfHeight, it will be clipped!
      // The user said: "Bottom content is clipped."
      // Ah! jsPDF clips anything that goes beyond the page height!
      // We must add new pages if imgHeight exceeds page height!
      let heightLeft = imgHeight;
      let position = margin;
      let pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(dataUrl, 'PNG', margin, position, availableWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight; // Shift the image up
        pdf.addPage();
        // We render the same image shifted up by the page height
        pdf.addImage(dataUrl, 'PNG', margin, position + margin, availableWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }
      
      pdf.save(`SituationReport-${currentCity.name}.pdf`);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm custom-scrollbar">
        <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl my-auto flex flex-col bg-[#050810] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white/90">EOC Situation Report</h2>
                  <div className="text-[11px] text-white/40 font-mono mt-0.5">
                    Generated: {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm" className="h-8 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white/70">
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button onClick={handleExportPDF} variant="outline" size="sm" className="h-8 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white/70">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export PDF</span>
                </Button>
                <button 
                  onClick={onClose}
                  className="ml-2 p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Body */}
            <div id="sitrep-printable" className="p-6 space-y-6 bg-[#0A0E1A]">
            
            {/* Header Block */}
            <div className="flex justify-between items-start border-b border-white/10 pb-6">
              <div>
                <h1 className="text-xl font-black text-white tracking-wide uppercase mb-1">
                  Situation Report
                </h1>
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentCity.name} Sector</span>
                  <span className="text-sm font-medium mx-2 opacity-50">•</span>
                  <span className="text-xs font-mono opacity-60">Generated: {new Date().toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Threat Level</div>
                <div className={`inline-flex px-3 py-1 rounded border text-sm font-bold tracking-widest uppercase ${
                  threatLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  threatLevel === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  threatLevel === 'MODERATE' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  {threatLevel}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-white/40 mb-2 text-[11px] uppercase tracking-wider font-bold">
                  <Activity className="w-3.5 h-3.5" /> Risk Score
                </div>
                <div className="text-2xl font-mono text-white/90">{systemState.riskScore.toFixed(0)}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-white/40 mb-2 text-[11px] uppercase tracking-wider font-bold">
                  <Wind className="w-3.5 h-3.5" /> Weather
                </div>
                <div className="text-sm font-medium text-white/90 mt-1 line-clamp-2">{systemState.weatherLabel}</div>
                <div className="text-[10px] text-white/50 mt-1">
                  {systemState.rainfall} mm/h | {systemState.windSpeed} km/h | {systemState.humidity}% RH
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-white/40 mb-2 text-[11px] uppercase tracking-wider font-bold">
                  <Building className="w-3.5 h-3.5" /> Incidents
                </div>
                <div className="text-2xl font-mono text-white/90">{systemState.activeIncidents}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-white/40 mb-2 text-[11px] uppercase tracking-wider font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" /> Resources
                </div>
                <div className="text-2xl font-mono text-white/90">{systemState.deployedUnits}</div>
              </div>
            </div>

            {/* Status Section */}
            <div>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Infrastructure Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                  <span className="text-xs text-white/60">Roads Closed</span>
                  <span className="font-mono text-sm text-red-400">{systemState.roadsClosed}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                  <span className="text-xs text-white/60">Hospital Cap.</span>
                  <span className={`font-mono text-sm ${systemState.hospitalCapacityPercent < 30 ? 'text-orange-400' : 'text-green-400'}`}>
                    {systemState.hospitalCapacityPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                  <span className="text-xs text-white/60">Shelter Avail.</span>
                  <span className={`font-mono text-sm ${systemState.shelterAvailabilityPercent < 30 ? 'text-orange-400' : 'text-green-400'}`}>
                    {systemState.shelterAvailabilityPercent.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations List */}
            <div>
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 border-b border-white/5 pb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> AI Prescriptions
              </h3>
              <div className="space-y-3">
                {recommendations.length > 0 ? recommendations.map(rec => (
                  <div key={rec.id} className="flex flex-col h-auto min-h-min p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="flex flex-row items-start justify-between gap-4 mb-3">
                      <h4 className="text-sm font-semibold text-white/90 leading-snug break-words flex-1 m-0">{rec.title}</h4>
                      <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        rec.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        rec.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        rec.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed mb-3 break-words m-0">{rec.recommendation}</p>
                    <ul className="flex flex-col gap-1.5 m-0 p-0">
                      {rec.reasoning.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-white/40 leading-snug">
                          <span className="w-1 h-1 rounded-full bg-white/20 shrink-0 mt-1.5" /> 
                          <span className="flex-1 break-words">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )) : (
                  <div className="text-sm text-white/40 p-4 italic text-center">No active recommendations.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
