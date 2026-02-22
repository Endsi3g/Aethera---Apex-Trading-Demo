import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart2, HelpCircle, TrendingUp, TrendingDown, Minus, ArrowRight, XCircle 
} from 'lucide-react';
import { GameSettings, UserDecision, GameScenario } from '../types';

type GameScreenProps = {
  playerName: string;
  selectedMode: "solo" | "multiplayer" | null;
  gameSettings: GameSettings;
  scenarios: GameScenario[];
  currentScenarioIndex: number;
  onSubmitDecision: (scenarioId: string, decision: UserDecision) => void;
  onExitGame: () => void;
};

export default function GameScreen({
  playerName,
  selectedMode,
  gameSettings,
  scenarios,
  currentScenarioIndex,
  onSubmitDecision,
  onExitGame
}: GameScreenProps) {
  const [selectedDecision, setSelectedDecision] = useState<UserDecision | null>(null);

  const scenario = scenarios[currentScenarioIndex];
  const progressText = `Scénario ${currentScenarioIndex + 1} / ${gameSettings.scenariosCount}`;
  const modeLabel = selectedMode === 'solo' ? 'Solo' : 'Multijoueur';

  const handleDecisionClick = (decision: UserDecision) => {
    setSelectedDecision(decision);
  };

  const handleValidation = () => {
    if (selectedDecision && scenario) {
      onSubmitDecision(scenario.id, selectedDecision);
      setSelectedDecision(null); // Reset for next scenario (though parent might unmount)
    }
  };

  if (!scenario) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <p>Erreur : Scénario introuvable.</p>
        <button onClick={onExitGame} className="ml-4 underline text-emerald-400">Retour</button>
      </div>
    );
  }

  return (
    <motion.div
      key={`game-${scenario.id}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 relative z-10 h-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Mode</span>
            <span className="text-white font-bold text-lg">{modeLabel}</span>
          </div>
          <div className="w-px h-10 bg-slate-700 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Joueur</span>
            <span className="text-blue-600 font-bold text-lg truncate max-w-[150px]">{playerName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <span className="text-slate-600 font-mono font-medium">{progressText}</span>
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${((currentScenarioIndex + 1) / gameSettings.scenariosCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Main Content Area (Chart/Quiz) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-sm flex-1 flex flex-col relative overflow-hidden group">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-blue-900 mb-1">{scenario.title}</h2>
              <p className="text-slate-500 text-sm md:text-base">{scenario.description}</p>
            </div>

            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center relative overflow-hidden p-8">
              {gameSettings.contentType === 'charts' ? (
                <div className="text-center space-y-4 max-w-lg">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                    <BarChart2 className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600">
                    {scenario.chartPlaceholderText || "Zone graphique TradingView"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Aperçu historique du prix. Analysez la structure, le momentum et la tendance pour prendre votre décision.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-6 max-w-2xl">
                  <div className="w-16 h-16 bg-white rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-lg">
                    <HelpCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-900 leading-relaxed">
                    {scenario.quizQuestionText || "Question du scénario..."}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prediction Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-sm flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"/>
              Votre prédiction
            </h3>
            
            <div className="flex flex-col gap-3 flex-1">
              <button
                onClick={() => handleDecisionClick('up')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden ${
                  selectedDecision === 'up' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'bg-slate-50 border-slate-100 hover:border-blue-300 hover:bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-lg transition-colors ${selectedDecision === 'up' ? 'bg-white/20' : 'bg-white text-blue-600'}`}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className={`block font-bold text-lg ${selectedDecision === 'up' ? 'text-white' : 'text-slate-900'}`}>MONTER</span>
                  <span className={`text-xs ${selectedDecision === 'up' ? 'text-blue-100' : 'text-slate-500'} font-medium`}>Position Longue (Achat)</span>
                </div>
              </button>

              <button
                onClick={() => handleDecisionClick('flat')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden ${
                  selectedDecision === 'flat' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'bg-slate-50 border-slate-100 hover:border-blue-300 hover:bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-lg transition-colors ${selectedDecision === 'flat' ? 'bg-white/20' : 'bg-white text-blue-600'}`}>
                  <Minus className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className={`block font-bold text-lg ${selectedDecision === 'flat' ? 'text-white' : 'text-slate-900'}`}>RESTER STABLE</span>
                  <span className={`text-xs ${selectedDecision === 'flat' ? 'text-blue-100' : 'text-slate-500'} font-medium`}>Incertain / Ne rien faire</span>
                </div>
              </button>

              <button
                onClick={() => handleDecisionClick('down')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden ${
                  selectedDecision === 'down' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'bg-slate-50 border-slate-100 hover:border-blue-300 hover:bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-lg transition-colors ${selectedDecision === 'down' ? 'bg-white/20' : 'bg-white text-blue-600'}`}>
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className={`block font-bold text-lg ${selectedDecision === 'down' ? 'text-white' : 'text-slate-900'}`}>BAISSER</span>
                  <span className={`text-xs ${selectedDecision === 'down' ? 'text-blue-100' : 'text-slate-500'} font-medium`}>Position Courte (Vente)</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={handleValidation}
              disabled={!selectedDecision}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-xl font-bold transition-all duration-300 ${
                selectedDecision
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              Valider ma décision
              <ArrowRight className={`w-6 h-6 ${selectedDecision ? 'animate-pulse' : ''}`} />
            </button>

            <button
              onClick={onExitGame}
              className="w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-slate-700"
            >
              <XCircle className="w-4 h-4" />
              Quitter la partie
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-2">
              Vous comparerez votre décision à celle d’Apex à l’écran suivant.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
