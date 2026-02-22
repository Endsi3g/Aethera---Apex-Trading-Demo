import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Users, Info, ShieldCheck, Activity, Target, 
  ArrowLeft, ArrowRight, Copy, Play, UserPlus, 
  Settings2, CheckCircle2, BarChart2, HelpCircle,
  TrendingUp, TrendingDown, Minus, Zap, RefreshCw,
  Trophy, Mail, ExternalLink, Shield, ChevronRight,
  ClipboardList, Check
} from 'lucide-react';
import { mockScenarios, Scenario, Decision } from './data/mockScenarios';
import TradingViewChart from './components/TradingViewChart';

type Screen = "home" | "enterName" | "multiplayerLobby" | "soloSettings" | "game" | "apexExplanation" | "results";
type Mode = "solo" | "multiplayer" | null;
type Player = { id: string; name: string; isHost: boolean };

type Difficulty = "beginner" | "intermediate" | "expert";
type ContentType = "charts" | "quiz";
type GameSettings = {
  scenariosCount: 5 | 10 | 20;
  difficulty: Difficulty;
  contentType: ContentType;
};

type PlayerVotes = {
  [playerId: string]: GameSettings;
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  expert: "Expert"
};

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  charts: "Graphiques TradingView",
  quiz: "Quiz Interactif"
};

function SettingButton({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 rounded-xl text-lg font-bold transition-all duration-200 border-2 ${
        isSelected 
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
      }`}
    >
      {label}
    </button>
  );
}

function PillButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-8 py-5 rounded-2xl text-xl font-bold transition-all duration-300 border-2 ${
        isActive 
          ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
          : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      {label}
    </button>
  );
}

function CardButton({ icon: Icon, title, description, isActive, onClick }: { icon?: any, title: string, description: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-8 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden ${
        isActive 
          ? 'bg-blue-50 border-blue-600 shadow-lg' 
          : 'bg-white border-slate-200 hover:border-blue-300'
      }`}
    >
      <div className="flex flex-col h-full relative z-10">
        {Icon && <Icon className={`w-10 h-10 mb-6 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />}
        <h4 className={`text-2xl font-bold mb-3 transition-colors ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>{title}</h4>
        <p className={`text-lg leading-relaxed ${isActive ? 'text-blue-700/80' : 'text-slate-500'}`}>{description}</p>
      </div>
      {isActive && (
        <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg">
          <Check className="w-5 h-5" />
        </div>
      )}
    </button>
  );
}

function EnterNameScreen({ mode, onBack, onSubmit }: { mode: Mode, onBack: () => void, onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");
  const isValid = name.trim().length > 0;

  const handleSubmit = () => {
    if (isValid) onSubmit(name.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) handleSubmit();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-xl w-full mx-auto bg-white p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-2xl space-y-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest text-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <div className="space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-blue-900 leading-none">Votre Identité</h2>
        <p className="text-xl text-slate-500">Comment Apex doit-il vous appeler ?</p>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            autoFocus
            type="text" 
            placeholder="Ex: Alexander Elder"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white text-slate-900 px-16 py-6 rounded-2xl text-2xl font-bold outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full group py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:shadow-none"
        >
          {mode === "solo" ? "Lancer Apex" : "Rejoindre le salon"}
          <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

function SoloSettingsScreen({ playerName, gameSettings, onUpdateSettings, onStartSolo, onBack }: { playerName: string, gameSettings: GameSettings, onUpdateSettings: (s: GameSettings) => void, onStartSolo: () => void, onBack: () => void }) {
  const handleUpdate = (update: Partial<GameSettings>) => {
    onUpdateSettings({ ...gameSettings, ...update });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full flex flex-col items-center space-y-16 py-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest text-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-blue-900 leading-tight">Configuration <span className="text-blue-600">Solo</span></h2>
        <p className="text-xl text-slate-500 max-w-lg">Préparez votre entraînement, {playerName}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Scenarios Count */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4 text-blue-600">
            <ClipboardList className="w-8 h-8" />
            <h3 className="text-xl font-bold uppercase tracking-wider">Scénarios</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[5, 10, 20].map(count => (
              <SettingButton 
                key={count}
                label={`${count} Scénarios`}
                isSelected={gameSettings.scenariosCount === count}
                onClick={() => handleUpdate({ scenariosCount: count as 5|10|20})}
              />
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4 text-blue-600">
            <Target className="w-8 h-8" />
            <h3 className="text-xl font-bold uppercase tracking-wider">Difficulté</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {(["beginner", "intermediate", "expert"] as const).map(diff => (
              <SettingButton 
                key={diff}
                label={DIFFICULTY_LABELS[diff]}
                isSelected={gameSettings.difficulty === diff}
                onClick={() => handleUpdate({ difficulty: diff})}
              />
            ))}
          </div>
        </div>

        {/* Content Type */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4 text-blue-600">
            <Trophy className="w-8 h-8" />
            <h3 className="text-xl font-bold uppercase tracking-wider">Contenu</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {(["charts", "quiz"] as const).map(type => (
              <SettingButton 
                key={type}
                label={CONTENT_TYPE_LABELS[type]}
                isSelected={gameSettings.contentType === type}
                onClick={() => handleUpdate({ contentType: type})}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onStartSolo}
        className="group px-16 py-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl font-black transition-all duration-300 shadow-2xl shadow-blue-600/30 flex items-center gap-6 hover:scale-105"
      >
        Lancer la partie solo
        <ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
      </button>
    </motion.div>
  );
}

function MultiplayerLobbyScreen({ 
  roomCode, players, playerName, currentPlayerId, gameSettings, votes, onUpdateVote, onLockSettings, onBack, onSimulateGuest 
}: { 
  roomCode: string, players: Player[], playerName: string, currentPlayerId: string, gameSettings: GameSettings, votes: PlayerVotes, onUpdateVote: (playerId: string, vote: GameSettings) => void, onLockSettings: (settings: GameSettings) => void, onBack: () => void, onSimulateGuest: () => void 
}) {
  const [tipIndex, setTipIndex] = useState(0);
  const tips = [
    "Apex analyse 45 indicateurs en temps réel pour chaque décision.",
    "La discipline bat la cupidité : savoir ne pas cliquer est une force.",
    "Le 'Golden Cross' (croisement MA50/MA200) est un signal de tendance majeur.",
    "Ne risquez jamais plus de 1% de votre capital total sur un seul trade.",
    "Le RSI (Relative Strength Index) aide à identifier les zones de sur-achat.",
    "Les volumes confirment la force d'un breakout : pas de volume, pas d'achat.",
    "Le DCA (Dollar Cost Averaging) réduit l'impact de la volatilité court terme.",
    "Gardez un journal de trading : vos erreurs sont vos meilleures leçons.",
    "La patience est la compétence la plus rentable sur les marchés.",
    "Apex détecte les manipulations de baleines (whales) avant qu'elles n'arrivent."
  ];

  useEffect(() => {
    const timer = setInterval(() => setTipIndex((prev) => (prev + 1) % tips.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const isHost = players[0]?.id === currentPlayerId;
  const myVote = votes[currentPlayerId] || gameSettings;

  const copyLink = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Code copié !");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-3 h-full bg-blue-600" />
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-4xl font-black text-blue-900 mb-2">Salon Multijoueur</h2>
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold animate-pulse">
                    <Activity className="w-4 h-4" /> Live
                  </span>
                  Code : <span className="font-mono font-bold text-blue-600">{roomCode}</span>
                  <button onClick={copyLink} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-100 px-6 py-4 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-black text-blue-900">{players.length}/4</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {players.map((p) => (
                <div key={p.id} className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${p.id === currentPlayerId ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black ${p.id === currentPlayerId ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{p.name[0]}</div>
                    <div>
                      <p className="text-xl font-bold text-blue-900">{p.name}</p>
                      <p className="text-xs uppercase tracking-widest font-black text-slate-400">{p.isHost ? 'Hôte' : 'Trader'}</p>
                    </div>
                  </div>
                  {p.id === currentPlayerId && <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md">Moi</span>}
                </div>
              ))}
            </div>

            {isHost && (
              <div className="mt-12 p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm"><UserPlus className="w-8 h-8 text-blue-600" /></div>
                  <p className="text-lg text-slate-600 font-bold italic">Simulez des rivaux pour tester la room.</p>
                </div>
                <button onClick={onSimulateGuest} disabled={players.length >= 4} className="px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-black hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30">Ajouter Invité</button>
              </div>
            )}
          </div>

          <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            <div className="relative z-10 space-y-4">
              <div className="inline-block px-4 py-2 bg-white/20 rounded-full backdrop-blur-md text-xs font-black uppercase tracking-widest">Conseil d'Apex</div>
              <motion.p key={tipIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-medium leading-relaxed italic">"{tips[tipIndex]}"</motion.p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl h-full flex flex-col">
            <h3 className="text-2xl font-black text-blue-900 mb-10 flex items-center gap-3"><Settings2 className="w-8 h-8 text-blue-600" /> Votes</h3>
            <div className="space-y-10 flex-1">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest font-black text-slate-400">Difficulté</p>
                <div className="flex flex-col gap-2">
                  {(["beginner", "intermediate", "expert"] as const).map(d => (
                    <SettingButton key={d} label={DIFFICULTY_LABELS[d]} isSelected={myVote.difficulty === d} onClick={() => onUpdateVote(currentPlayerId, {...myVote, difficulty: d})} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest font-black text-slate-400">Contenu</p>
                <div className="flex flex-col gap-2">
                  {(["charts", "quiz"] as const).map(t => (
                    <SettingButton key={t} label={CONTENT_TYPE_LABELS[t]} isSelected={myVote.contentType === t} onClick={() => onUpdateVote(currentPlayerId, {...myVote, contentType: t})} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100">
              {isHost ? (
                <button onClick={() => onLockSettings(myVote)} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-2xl font-black shadow-xl transition-all active:scale-95">Démarrer</button>
              ) : (
                <p className="text-center text-slate-400 font-bold italic">L'hôte prépare le lancement...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GameScreen({ playerName, scenario, index, total, onDecision }: { playerName: string, scenario: Scenario, index: number, total: number, onDecision: (d: Decision) => void }) {
  const [selected, setSelected] = useState<Decision | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">{playerName[0]}</div>
          <div>
            <p className="text-xl font-black text-blue-900">{playerName}</p>
            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Trader en mission</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Progression</p>
            <p className="text-2xl font-black text-blue-600">{index + 1} / {total}</p>
          </div>
          <div className="w-24 h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${((index + 1) / total) * 100}%` }} className="h-full bg-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[500px]">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col min-h-[500px]">
          {scenario.contentType === 'charts' ? (
            <div className="flex-1 w-full relative bg-slate-50">
              <TradingViewChart symbol={scenario.chartSymbol || "BINANCE:BTCUSDT"} theme="light" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200 shadow-xl max-w-sm z-10">
                <h4 className="text-xl font-bold text-blue-900 mb-1">{scenario.title}</h4>
                <p className="text-sm text-slate-500 italic">"{scenario.description}"</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 bg-slate-50">
              <div className="p-8 bg-white rounded-full shadow-2xl animate-pulse"><HelpCircle className="w-24 h-24 text-blue-600" /></div>
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-4xl font-black text-blue-900 leading-tight">{scenario.description}</h3>
                <div className="grid grid-cols-1 gap-4 text-left">
                  {scenario.options?.map((opt, i) => (
                    <button key={i} onClick={() => setSelected(i === 0 ? "buy" : i === 1 ? "hold" : "sell")} className={`p-6 rounded-2xl border-2 text-xl font-bold transition-all ${selected === (i === 0 ? "buy" : i === 1 ? "hold" : "sell") ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'}`}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl flex-1 flex flex-col">
            <h3 className="text-2xl font-black text-blue-900 mb-12 flex items-center gap-3"><Zap className="w-8 h-8 text-blue-600" /> Votre Décision</h3>
            <div className="flex-1 flex flex-col gap-4">
              <button onClick={() => setSelected('buy')} className={`group relative p-8 rounded-3xl border-2 transition-all flex items-center gap-6 overflow-hidden ${selected === 'buy' ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 hover:border-emerald-400 text-slate-800'}`}>
                <div className={`p-4 rounded-2xl ${selected === 'buy' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'} transition-colors`}><TrendingUp className="w-10 h-10" /></div>
                <div className="text-left"><p className="text-2xl font-black uppercase">Acheter</p><p className={selected === 'buy' ? 'text-emerald-50 text-sm' : 'text-slate-400 text-sm'}>Prendre position Long</p></div>
              </button>
              <button onClick={() => setSelected('hold')} className={`group relative p-8 rounded-3xl border-2 transition-all flex items-center gap-6 overflow-hidden ${selected === 'hold' ? 'bg-blue-600 border-blue-600 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 hover:border-blue-400 text-slate-800'}`}>
                <div className={`p-4 rounded-2xl ${selected === 'hold' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'} transition-colors`}><Minus className="w-10 h-10" /></div>
                <div className="text-left"><p className="text-2xl font-black uppercase">Attendre</p><p className={selected === 'hold' ? 'text-blue-50 text-sm' : 'text-slate-400 text-sm'}>Neutralité active</p></div>
              </button>
              <button onClick={() => setSelected('sell')} className={`group relative p-8 rounded-3xl border-2 transition-all flex items-center gap-6 overflow-hidden ${selected === 'sell' ? 'bg-rose-600 border-rose-600 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 hover:border-rose-400 text-slate-800'}`}>
                <div className={`p-4 rounded-2xl ${selected === 'sell' ? 'bg-white/20' : 'bg-rose-50 text-rose-600'} transition-colors`}><TrendingDown className="w-10 h-10" /></div>
                <div className="text-left"><p className="text-2xl font-black uppercase">Vendre</p><p className={selected === 'sell' ? 'text-rose-50 text-sm' : 'text-slate-400 text-sm'}>Prendre position Short</p></div>
              </button>
            </div>
            <div className="mt-12">
              <button onClick={() => selected && onDecision(selected)} disabled={!selected} className="w-full py-6 bg-blue-900 border-4 border-blue-900 text-white rounded-[2rem] text-2xl font-black transition-all hover:bg-blue-700 disabled:opacity-20 disabled:grayscale">Valider la position</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ApexExplanationScreen({ userDecision, scenario, onComplete }: { userDecision: Decision, scenario: Scenario, onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(10);
  useEffect(() => {
    if (timeLeft <= 0) { onComplete(); return; }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const isAligned = userDecision === scenario.apexGroundTruth.decision;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto space-y-12 py-12">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-8 transition-colors ${isAligned ? 'bg-emerald-600 border-emerald-100' : 'bg-blue-600 border-blue-100'} shadow-2xl shadow-blue-500/10`}>
          {isAligned ? <Check className="w-16 h-16 text-white" /> : <Activity className="w-16 h-16 text-white" />}
        </div>
        <h2 className="text-5xl font-black text-blue-900 leading-none">{isAligned ? "Aligné avec Apex" : "Divergence Tactique"}</h2>
        <p className="text-2xl text-slate-500 font-medium italic">"{scenario.title}"</p>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
           <div className="flex items-center gap-3 bg-slate-100 px-6 py-4 rounded-2xl border border-slate-200">
             <span className="text-2xl font-black text-blue-600">{timeLeft}s</span>
             <p className="text-xs uppercase font-black text-slate-400 w-20 leading-tight">Analyse tactique</p>
           </div>
        </div>

        <div className="space-y-12 relative z-10">
          <div className="flex flex-wrap gap-4">
            {scenario.apexGroundTruth.activatedNetworks.map(net => (
              <span key={net} className="px-5 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4" /> Réseau {net}
              </span>
            ))}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] font-black text-slate-400">La Rationale d'Apex</p>
              <p className="text-3xl font-bold text-blue-900 leading-relaxed max-w-3xl">{scenario.apexGroundTruth.rationale}</p>
            </div>
            <div className="p-8 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200">
              <p className="text-lg font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Shield className="w-6 h-6" /> Note de Vigilance</p>
              <p className="text-2xl font-medium text-blue-900 leading-relaxed italic">{scenario.apexGroundTruth.riskComment}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-3 bg-blue-600" style={{ width: `${(timeLeft / 10) * 100}%`, transition: 'width 1s linear' }} />
      </div>
    </motion.div>
  );
}

function ResultsScreen({ playerName, score, total, alignCount, disciplineCount, onRestart }: { playerName: string, score: number, total: number, alignCount: number, disciplineCount: number, onRestart: () => void }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const alignPercent = Math.round((alignCount / total) * 100);

  return (
    <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl mx-auto space-y-12 py-12">
      <div className="flex flex-col items-center text-center space-y-6">
        <h2 className="text-7xl font-black text-blue-900 leading-none">Rapport de <span className="text-blue-600">Mission</span></h2>
        <p className="text-2xl text-slate-500 font-medium">Analyse des performances pour {playerName}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-4 hover:scale-105 transition-transform">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Score Final</p>
          <p className="text-7xl font-black text-blue-900">{score}</p>
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">Points Tactiques</div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-4 hover:scale-105 transition-transform">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Alignement Apex</p>
          <p className="text-7xl font-black text-emerald-600">{alignPercent}%</p>
          <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">Stratégie GAGNANTE</div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-4 hover:scale-105 transition-transform">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bonus Discipline</p>
          <p className="text-7xl font-black text-blue-600">{disciplineCount}</p>
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">Non-actions Utiles</div>
        </div>
      </div>

      <div className="bg-blue-900 text-white p-12 md:p-20 rounded-[4rem] shadow-3xl shadow-blue-500/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full -mr-64 -mt-64 blur-[150px]" />
        <div className="relative z-10 space-y-8 flex-1">
          <h3 className="text-5xl md:text-6xl font-black leading-tight">Accédez à la puissance d'Apex.</h3>
          <p className="text-xl text-blue-100/80 leading-relaxed max-w-xl">Inscrivez-vous pour rejoindre la version Beta et trader avec l'intelligence de pointe d'Aethera Apex.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {!isSubmitted ? (
               <>
                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email professionnel" className="flex-1 bg-white/10 border-2 border-white/20 focus:border-white focus:bg-white/20 rounded-2xl px-8 py-5 text-xl outline-none transition-all placeholder:text-white/30" />
                 <button onClick={() => setIsSubmitted(true)} className="px-10 py-5 bg-white text-blue-900 text-xl font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3">Accès Prioritaire <ArrowRight className="w-8 h-8" /></button>
               </>
            ) : (
               <div className="bg-emerald-500/20 border-2 border-emerald-500/50 p-6 rounded-3xl flex items-center gap-6">
                 <div className="p-3 bg-emerald-500 rounded-full shadow-lg"><Check className="w-8 h-8 text-white" /></div>
                 <p className="text-2xl font-bold">Inscription validée ! À bientôt sur Apex.</p>
               </div>
            )}
          </div>
        </div>
        <div className="relative z-10 w-full md:w-fit">
           <button onClick={onRestart} className="group flex items-center gap-4 text-blue-300 hover:text-white text-xl font-black uppercase tracking-widest transition-all">Refaire une mission <RefreshCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" /></button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedMode, setSelectedMode] = useState<Mode>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userDecisions, setUserDecisions] = useState<{ [index: number]: Decision }>({});
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [alignCount, setAlignCount] = useState<number>(0);
  const [disciplineCount, setDisciplineCount] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    scenariosCount: 5,
    difficulty: "beginner",
    contentType: "charts"
  });
  const [votes, setVotes] = useState<PlayerVotes>({});

  const handleSelectSolo = () => {
    setSelectedMode("solo");
    setCurrentScreen("enterName");
  };

  const handleSelectMultiplayer = () => {
    setSelectedMode("multiplayer");
    setCurrentScreen("enterName");
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    if (selectedMode === "solo") {
      setCurrentScreen("soloSettings");
    } else {
      setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase());
      setPlayers([{ id: "p1", name: name, isHost: true }]);
      setCurrentScreen("multiplayerLobby");
    }
  };

  const handleUpdateVote = (pid: string, vote: GameSettings) => {
    setVotes(prev => ({ ...prev, [pid]: vote }));
  };

  const handleSimulateGuest = () => {
    const names = ["Jordan", "Morgan", "Sam", "Alex"];
    const id = "p" + (players.length + 1);
    setPlayers(prev => [...prev, { id: id, name: names[players.length], isHost: false }]);
  };

  const handleStartSolo = () => {
    const filtered = mockScenarios.filter(s => s.difficulty === gameSettings.difficulty && s.contentType === gameSettings.contentType);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setScenarios(shuffled.slice(0, gameSettings.scenariosCount));
    setCurrentScenarioIndex(0);
    setCurrentScreen("game");
  };

  const handleLockSettings = (settings: GameSettings) => {
    setGameSettings(settings);
    const filtered = mockScenarios.filter(s => s.difficulty === settings.difficulty && s.contentType === settings.contentType);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setScenarios(shuffled.slice(0, settings.scenariosCount));
    setCurrentScenarioIndex(0);
    setCurrentScreen("game");
  };

  const handleGameDecision = (decision: Decision) => {
    setUserDecisions(prev => ({ ...prev, [currentScenarioIndex]: decision }));
    const scenario = scenarios[currentScenarioIndex];
    const isAligned = decision === scenario.apexGroundTruth.decision;
    
    let points = 0;
    if (isAligned) {
      points = 100 + (streak * 20);
      setStreak(prev => prev + 1);
      setAlignCount(prev => prev + 1);
    } else {
      setStreak(0);
      points = -50;
    }

    if (decision === 'hold' && scenario.apexGroundTruth.decision === 'hold') {
      setDisciplineCount(prev => prev + 1);
      points += 50;
    }

    setScore(prev => prev + points);
    setCurrentScreen("apexExplanation");
  };

  const handleExplanationComplete = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setCurrentScreen("game");
    } else {
      setCurrentScreen("results");
    }
  };

  const handleRestart = () => {
    setCurrentScreen("home");
    setSelectedMode(null);
    setPlayerName("");
    setPlayers([]);
    setUserDecisions({});
    setScore(0);
    setStreak(0);
    setAlignCount(0);
    setDisciplineCount(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen p-4 py-12 md:py-20 justify-center">
        <AnimatePresence mode="wait">
          {currentScreen === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-16 md:gap-24">
              <div className="text-center space-y-8">
                <div className="inline-flex p-6 rounded-[2.5rem] bg-blue-600 text-white shadow-3xl shadow-blue-500/20 mb-8 transform hover:rotate-3 transition-transform">
                  <Activity className="w-16 h-16 md:w-24 md:h-24" />
                </div>
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-blue-900 flex flex-col md:flex-row items-center justify-center md:gap-8">
                  APEX <span className="text-blue-600">TRADING</span>
                </h1>
                <p className="text-2xl md:text-3xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                  L'Intelligence Artificielle de pointe pour une précision de marché absolue.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                <button 
                  onClick={handleSelectSolo}
                  className="group p-10 md:p-14 bg-white border border-slate-200 rounded-[4rem] text-left hover:border-blue-500 hover:shadow-3xl transition-all duration-500 relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="p-4 bg-blue-50 w-fit rounded-2xl mb-8 group-hover:scale-110 transition-transform"><User className="w-12 h-12 text-blue-600" /></div>
                    <h2 className="text-4xl font-black text-blue-900 mb-4">Mode Solo</h2>
                    <p className="text-xl text-slate-500 leading-relaxed">Affrontez l'IA en face-à-face sur des scénarios réels en temps fractionné.</p>
                  </div>
                  <ChevronRight className="absolute bottom-10 right-10 w-12 h-12 text-blue-100 group-hover:text-blue-300 transition-colors" />
                </button>

                <button 
                   onClick={handleSelectMultiplayer}
                   className="group p-10 md:p-14 bg-blue-600 rounded-[4rem] text-left hover:bg-blue-700 hover:shadow-3xl transition-all duration-500 relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="p-4 bg-white/20 w-fit rounded-2xl mb-8 group-hover:scale-110 transition-transform"><Users className="w-12 h-12 text-white" /></div>
                    <h2 className="text-4xl font-black text-white mb-4">Multijoueur</h2>
                    <p className="text-xl text-blue-100 leading-relaxed">Défiez d'autres traders et comparez votre discipline à celle d'Apex.</p>
                  </div>
                  <ChevronRight className="absolute bottom-10 right-10 w-12 h-12 text-blue-100/20 group-hover:text-white/40 transition-colors" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4 bg-white px-8 py-5 rounded-full border border-slate-200 shadow-sm animate-bounce-slow">
                   <ShieldCheck className="w-6 h-6 text-emerald-500" />
                   <p className="font-bold text-slate-600 tracking-wide">Optimisé pour Bornes 4K</p>
                </div>
                <button onClick={() => alert("Apex v1.0 - IA de Trading Institutionnelle")} className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest text-sm transition-all"><Info className="w-6 h-6" /> À propos du moteur Apex</button>
              </div>
            </motion.div>
          )}

          {currentScreen === "enterName" && <EnterNameScreen mode={selectedMode} onBack={() => setCurrentScreen("home")} onSubmit={handleNameSubmit} />}
          {currentScreen === "soloSettings" && <SoloSettingsScreen playerName={playerName} gameSettings={gameSettings} onUpdateSettings={setGameSettings} onStartSolo={handleStartSolo} onBack={() => setCurrentScreen("enterName")} />}
          {currentScreen === "multiplayerLobby" && <MultiplayerLobbyScreen roomCode={roomCode} players={players} playerName={playerName} currentPlayerId="p1" gameSettings={gameSettings} votes={votes} onUpdateVote={handleUpdateVote} onLockSettings={handleLockSettings} onBack={() => setCurrentScreen("home")} onSimulateGuest={handleSimulateGuest} />}
          {currentScreen === "game" && <GameScreen playerName={playerName} scenario={scenarios[currentScenarioIndex]} index={currentScenarioIndex} total={scenarios.length} onDecision={handleGameDecision} />}
          {currentScreen === "apexExplanation" && <ApexExplanationScreen userDecision={userDecisions[currentScenarioIndex]} scenario={scenarios[currentScenarioIndex]} onComplete={handleExplanationComplete} />}
          {currentScreen === "results" && <ResultsScreen playerName={playerName} score={score} total={scenarios.length} alignCount={alignCount} disciplineCount={disciplineCount} onRestart={handleRestart} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
