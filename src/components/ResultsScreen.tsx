import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, CheckCircle2, RefreshCw, Mail, ArrowRight, 
  Share2, Target, Shield, Activity, Lock
} from 'lucide-react';

type ResultsScreenProps = {
  playerName: string;
  score: number;
  totalScenarios: number;
  alignCount: number;
  disciplineCount: number;
  onRestart: () => void;
};

export default function ResultsScreen({
  playerName,
  score,
  totalScenarios,
  alignCount,
  disciplineCount,
  onRestart
}: ResultsScreenProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const alignPercent = totalScenarios > 0 ? Math.round((alignCount / totalScenarios) * 100) : 0;
  
  // Determine rank based on score/alignment
  let rank = "Novice";
  let rankColor = "text-slate-400";
  if (alignPercent >= 80) { rank = "Apex Trader"; rankColor = "text-emerald-400"; }
  else if (alignPercent >= 50) { rank = "Initié"; rankColor = "text-blue-400"; }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log("Lead captured:", { email, playerName, score, rank });
      setIsSubmitted(true);
      // In a real app, you would send this to your backend/CRM here
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-6xl mx-auto p-6 md:p-8 relative z-10 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex p-4 rounded-full bg-slate-800/50 border border-slate-700 mb-4"
        >
          <Trophy className="w-12 h-12 text-yellow-500" />
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
          Session Terminée
        </h2>
        <p className="text-xl text-slate-400">
          Rapport de mission pour <span className="text-white font-bold">{playerName}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl text-center backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Score Final</p>
          <p className="text-6xl font-black text-white relative z-10">{score}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase relative z-10">
            <Activity className="w-3 h-3" /> Performance
          </div>
        </motion.div>

        {/* Alignment Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl text-center backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Alignement Apex</p>
          <p className={`text-6xl font-black ${rankColor} relative z-10`}>{alignPercent}%</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase relative z-10">
            <Target className="w-3 h-3" /> Précision
          </div>
        </motion.div>

        {/* Discipline Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl text-center backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Bonus Discipline</p>
          <p className="text-6xl font-black text-purple-400 relative z-10">+{disciplineCount * 50}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase relative z-10">
            <Shield className="w-3 h-3" /> Protection
          </div>
        </motion.div>
      </div>

      {/* Call to Action & Lead Gen */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Rank & Context */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Votre Rang : <span className={rankColor}>{rank}</span></h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              {alignPercent > 75 
                ? "Vos instincts s'alignent avec les algorithmes institutionnels. Vous avez compris que la préservation du capital est la clé."
                : "Vous avez du potentiel, mais le marché vous piège encore parfois. Apex peut vous aider à filtrer le bruit."}
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={onRestart} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5" /> Rejouer
            </button>
            <button className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed" title="Bientôt disponible">
              <Share2 className="w-5 h-5" /> Partager
            </button>
          </div>
        </div>

        {/* Right: Lead Capture */}
        <div className="bg-blue-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4 flex items-center gap-3">
              Rejoignez l'Elite <Lock className="w-6 h-6 text-blue-200" />
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Recevez votre analyse détaillée et accédez à la liste d'attente pour la bêta privée d'Apex.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input 
                    type="email" 
                    required
                    placeholder="votre@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-blue-800/50 border border-blue-400/30 focus:border-white rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-blue-300/50 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-blue-600 rounded-xl font-black text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
                >
                  Obtenir mon Accès
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/20 border border-white/30 rounded-xl p-6 flex flex-col items-center text-center gap-4"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Inscription Validée !</h4>
                  <p className="text-blue-100 text-sm mt-1">Surveillez votre boîte mail pour votre rapport.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-600 text-sm uppercase tracking-widest font-bold">
          Propulsé par Aethera Apex Engine v1.0
        </p>
      </div>
    </motion.div>
  );
}
