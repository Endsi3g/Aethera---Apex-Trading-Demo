import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, TrendingUp, TrendingDown, Minus, Zap, Shield, ArrowRight,
  ChevronRight, BrainCircuit, Activity
} from 'lucide-react';
import { UserDecision, GameScenario } from '../types';

type ApexExplanationScreenProps = {
  userDecision: UserDecision;
  scenario: GameScenario;
  onNext: () => void;
};

// Helper for display labels
const DECISION_LABELS: Record<UserDecision, string> = {
  up: "MONTER",
  down: "BAISSER",
  flat: "STABLE"
};

const DecisionIcon = ({ decision, className }: { decision: UserDecision, className?: string }) => {
  switch (decision) {
    case 'up': return <TrendingUp className={className} />;
    case 'down': return <TrendingDown className={className} />;
    case 'flat': return <Minus className={className} />;
  }
};

export default function ApexExplanationScreen({
  userDecision,
  scenario,
  onNext
}: ApexExplanationScreenProps) {
  const [progress, setProgress] = useState(0);
  const DURATION_MS = 10000;
  const UPDATE_INTERVAL_MS = 50;

  useEffect(() => {
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += UPDATE_INTERVAL_MS;
      const newProgress = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        onNext();
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [onNext]);

  const apexDecision = scenario.apexGroundTruth.decision;
  const isMatch = userDecision === apexDecision;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-full w-full max-w-6xl mx-auto p-6 md:p-8 relative z-10"
    >
      {/* Zone 1: Verdict */}
      <div className="flex flex-col items-center justify-center mb-8 relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`px-8 py-4 rounded-full border-2 text-2xl md:text-4xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl backdrop-blur-md mb-8 bg-blue-600 border-blue-100 text-white shadow-blue-500/20`}
        >
          {isMatch ? <Check className="w-8 h-8 md:w-10 md:h-10" /> : <X className="w-8 h-8 md:w-10 md:h-10" />}
          {isMatch ? "ACCORD AVEC APEX" : "DIVERGENCE TACTIQUE"}
        </motion.div>

        <div className="flex items-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Votre Choix</span>
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 bg-white border-slate-200 shadow-sm`}>
              <DecisionIcon decision={userDecision} className={`w-10 h-10 md:w-12 md:h-12 text-blue-600`} />
            </div>
            <span className={`font-bold text-blue-900`}>{DECISION_LABELS[userDecision]}</span>
          </div>

          <div className="text-slate-600 font-black text-2xl">VS</div>

          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1">
              <BrainCircuit className="w-3 h-3" /> Choix Apex
            </span>
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 bg-blue-600 border-blue-200 shadow-lg shadow-blue-500/20`}>
              <DecisionIcon decision={apexDecision} className={`w-10 h-10 md:w-12 md:h-12 text-white`} />
            </div>
            <span className={`font-bold text-blue-600`}>{DECISION_LABELS[apexDecision]}</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Analyse Apex */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 mb-8">
        {/* Networks & Rationale */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
           
           <div className="flex flex-wrap gap-3 relative z-10">
             {scenario.apexGroundTruth.activatedNetworks.map((net, i) => (
               <div key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm font-bold uppercase tracking-wider">
                 <Activity className="w-4 h-4" />
                 {net}
               </div>
             ))}
           </div>
           
           <div className="space-y-4 relative z-10">
             <div className="flex items-center gap-3 text-blue-600">
               <Zap className="w-6 h-6" />
               <h3 className="text-lg font-bold uppercase tracking-widest">Analyse IA</h3>
             </div>
             <p className="text-xl md:text-2xl text-blue-900 leading-relaxed font-light">
               "{scenario.apexGroundTruth.rationale}"
             </p>
           </div>
        </div>

        {/* Protection / Discipline */}
        <div className="lg:col-span-1 bg-blue-50 border border-blue-100 rounded-3xl p-8 shadow-inner flex flex-col justify-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Shield className="w-6 h-6" />
              <h3 className="text-lg font-bold uppercase tracking-widest">Protection</h3>
            </div>
            <div className="pl-4 border-l-2 border-emerald-500/30">
              <p className="text-lg text-emerald-100/80 italic leading-relaxed">
                {scenario.apexGroundTruth.riskComment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 3: Timer & Action */}
      <div className="mt-auto w-full max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          <span>Prochain Scénario</span>
          <span className="text-blue-600">{(DURATION_MS / 1000) - Math.floor((progress / 100) * (DURATION_MS / 1000))}s</span>
        </div>
        
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <motion.div 
            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button 
          onClick={onNext}
          className="w-full py-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm group"
        >
          Passer l'explication
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
