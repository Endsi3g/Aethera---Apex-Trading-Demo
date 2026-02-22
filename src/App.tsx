import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Users, Info, ShieldCheck, Activity, Target, 
  ArrowLeft, ArrowRight, Copy, Play, UserPlus, 
  Settings2, CheckCircle2, BarChart2, HelpCircle,
  TrendingUp, TrendingDown, Minus, Zap, RefreshCw,
  Trophy, Mail, ExternalLink, Shield, Check, ChevronRight, ClipboardList
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import GameScreen from './components/GameScreen';
import ApexExplanationScreen from './components/ApexExplanationScreen';
import { GameSettings, Difficulty, ContentType, UserDecision, GameScenario } from './types';
import { mockScenarios, Scenario, Decision } from './data/mockScenarios';

// Socket connection (mocking for now if server not running, but keeping the code)
const socket: Socket = io('http://localhost:3001', { autoConnect: false });

// Shared Types Mapping
const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  expert: "Expert"
};

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  charts: "Graphiques TradingView",
  quiz: "Quiz Interactif"
};

type Screen = "home" | "enterName" | "multiplayerLobby" | "soloSettings" | "game" | "apexExplanation" | "results";
type Mode = "solo" | "multiplayer" | null;
type Player = { id: string; name: string; isHost: boolean };
type PlayerVotes = { [playerId: string]: GameSettings };

// --- Internal Components ---

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

  const isHost = players.find(p => p.id === currentPlayerId)?.isHost || false;
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
                  <button onClick={copyLink} title="Copier le code" aria-label="Copier le code" className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all">
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
              {Array.isArray(players) ? players.map((p) => (
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
              )) : (
                <div className="col-span-2 text-center py-10">
                  <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-500">Initialisation de la flotte...</p>
                </div>
              )}
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

function ResultsScreen({ playerName, score, total, alignCount, disciplineCount, onRestart }: { playerName: string, score: number, total: number, alignCount: number, disciplineCount: number, onRestart: () => void }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const alignPercent = total > 0 ? Math.round((alignCount / total) * 100) : 0;

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
          <p className="text-7xl font-black text-blue-600">{alignPercent}%</p>
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">Stratégie GAGNANTE</div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-4 hover:scale-105 transition-transform">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bonus Discipline</p>
          <p className="text-7xl font-black text-blue-700">{disciplineCount}</p>
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest">Non-actions Utiles</div>
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


// --- Main App Component ---

// Helper to generate scenarios for the new GameScreen
const generateMockScenarios = (settings: GameSettings): GameScenario[] => {
  const count = settings.scenariosCount;
  // In a real implementation, we would filter mockScenarios by difficulty and type.
  // For now, we cycle through the available mock data to fill the requested count.
  const filteredMocks = mockScenarios.filter(
    s => s.difficulty === settings.difficulty && s.contentType === settings.contentType
  );
  
  // Fallback if no specific mocks match (e.g. quiz expert) - just use what we have or cycle
  const sourcePool = filteredMocks.length > 0 ? filteredMocks : mockScenarios;

  const scenarios: GameScenario[] = [];
  for (let i = 0; i < count; i++) {
    const mock = sourcePool[i % sourcePool.length];
    // We map the mock scenario to GameScenario to ensure type safety if there are differences
    scenarios.push({
      id: mock.id || `gen-${i}`,
      title: mock.title,
      description: mock.description,
      contentType: settings.contentType,
      chartPlaceholderText: settings.contentType === 'charts' ? `Graphique ${settings.difficulty}` : undefined,
      quizQuestionText: settings.contentType === 'quiz' ? mock.quizQuestion : undefined,
      chartSymbol: mock.chartSymbol,
      apexGroundTruth: {
        decision: mock.apexGroundTruth.decision === 'buy' ? 'up' : mock.apexGroundTruth.decision === 'sell' ? 'down' : 'flat',
        activatedNetworks: mock.apexGroundTruth.activatedNetworks,
        rationale: mock.apexGroundTruth.rationale,
        riskComment: mock.apexGroundTruth.riskComment
      }
    });
  }
  return scenarios;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedMode, setSelectedMode] = useState<Mode>(null);
  
  const [playerName, setPlayerName] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    scenariosCount: 5,
    difficulty: "beginner",
    contentType: "charts"
  });
  const [votes, setVotes] = useState<PlayerVotes>({});

  // Game state
  const [scenarios, setScenarios] = useState<GameScenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [userDecisions, setUserDecisions] = useState<{ [index: number]: UserDecision }>({});
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [alignCount, setAlignCount] = useState<number>(0);
  const [disciplineCount, setDisciplineCount] = useState<number>(0);
  
  // Socket.io integration
  useEffect(() => {
    socket.connect();
    
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('roomUpdated', (room) => {
      if (room && Array.isArray(room.players)) {
        setPlayers(room.players);
        if (room.settings) setGameSettings(room.settings);
      }
    });

    socket.on('allDecided', ({ roomCode }) => {
      // Sync synchronized transition
      setCurrentScreen("apexExplanation");
    });

    socket.on('nextScenario', (room) => {
      setCurrentScenarioIndex(room.currentScenarioIndex);
      setCurrentScreen("game");
    });

    socket.on('gameFinished', (room) => {
       const finalPlayer = room.players.find(p => p.id === socket.id);
       if (finalPlayer) {
          setScore(finalPlayer.score);
          setAlignCount(finalPlayer.alignCount || 0);
          setDisciplineCount(finalPlayer.disciplineCount || 0);
       }
       setCurrentScreen("results");
    });

    return () => {
      socket.off('connect');
      socket.off('allDecided');
      socket.off('nextScenario');
      socket.off('gameFinished');
      socket.off('gameStarted');
      socket.disconnect();
    };
  }, []);

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
    
    if (selectedMode === "multiplayer") {
      const code = generateRoomCode();
      setRoomCode(code);
      const myId = socket.id || "host-" + Math.random().toString(36).substr(2, 9);
      const hostPlayer = { id: myId, name, isHost: true };
      setPlayers([hostPlayer]);
      
      socket.emit('createRoom', { roomCode: code, player: hostPlayer, settings: gameSettings });
      handleUpdateVote(myId, gameSettings);
      
      setCurrentScreen("multiplayerLobby");
    } else if (selectedMode === "solo") {
      setGameSettings({
        scenariosCount: 5,
        difficulty: "beginner",
        contentType: "charts"
      });
      setCurrentScreen("soloSettings");
    }
  };

  const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleUpdateVote = (pid: string, vote: GameSettings) => {
    setVotes(prev => ({ ...prev, [pid]: vote }));
  };

  const handleSimulateGuest = () => {
    if (players.length >= 4) return;
    const guestId = `guest-${players.length}-` + Math.random().toString(36).substr(2, 9);
    setPlayers(prev => [...prev, { id: guestId, name: `Guest ${players.length}`, isHost: false }]);
  };

  const handleLockSettings = (finalSettings: GameSettings) => {
    const generated = generateMockScenarios(finalSettings);
    setScenarios(generated);
    setCurrentScenarioIndex(0);
    setCurrentScreen("game");
    
    if (selectedMode === 'multiplayer') {
       socket.emit('startGame', { roomCode, settings: finalSettings });
    }
  };

  const handleStartSolo = () => {
    handleLockSettings(gameSettings);
  };

  const handleSubmitDecision = (scenarioId: string, decision: UserDecision) => {
    console.log("User decision", { 
      scenarioId, 
      decision, 
      playerName, 
      mode: selectedMode,
      playerId: socket.id
    });

    setUserDecisions(prev => ({ ...prev, [currentScenarioIndex]: decision }));
    
    // Scoring Logic
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

    if (decision === 'flat' && scenario.apexGroundTruth.decision === 'flat') {
      setDisciplineCount(prev => prev + 1);
      points += 50;
    }

    setScore(prev => prev + points);
    
    // Transition to Explanation
    setCurrentScreen("apexExplanation");
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      if (selectedMode === "multiplayer") {
        socket.emit("requestNextScenario", roomCode);
      } else {
        setCurrentScenarioIndex(prev => prev + 1);
        setCurrentScreen("game");
      }
    } else {
      if (selectedMode === "multiplayer") {
        socket.emit("finishGame", roomCode);
      } else {
        setCurrentScreen("results");
      }
    }
  };

  const handleExitGame = () => {
    setCurrentScreen("home");
    setPlayers([]);
    setScenarios([]);
  };

  const handleRestart = () => {
    handleExitGame();
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 flex flex-col overflow-hidden">
      {/* Background and AnimatePresence Logic */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: ['0%', '5%', '0%'], y: ['0%', '-5%', '0%'] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/50 blur-[100px]" />
        <motion.div animate={{ x: ['0%', '-5%', '0%'], y: ['0%', '5%', '0%'] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-slate-200/50 blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 w-full z-10">
              <header className="p-12 text-center space-y-4">
                <h1 className="text-5xl font-black text-blue-900">Aethera | <span className="text-blue-600">Apex</span></h1>
                <p className="text-xl text-slate-500">Décryptez les mouvements de marché avec l'IA.</p>
             </header>
             <main className="flex-1 flex flex-col items-center gap-8 p-12">
                <button 
                  onClick={handleSelectSolo} 
                  className="w-full max-w-sm px-8 py-6 bg-white border-2 border-slate-200 text-blue-900 rounded-3xl text-2xl font-black hover:border-blue-600 hover:shadow-xl transition-all flex items-center justify-between group"
                >
                  Mode Solo
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
                <button 
                  onClick={handleSelectMultiplayer} 
                  className="w-full max-w-sm px-8 py-6 bg-blue-600 text-white rounded-3xl text-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-between group"
                >
                  Multijoueur
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center transition-all">
                    <Users className="w-6 h-6" />
                  </div>
                </button>
             </main>
          </motion.div>
        )}

        {currentScreen === "enterName" && <EnterNameScreen mode={selectedMode} onBack={() => setCurrentScreen("home")} onSubmit={handleNameSubmit} />}
        
        {currentScreen === "soloSettings" && <SoloSettingsScreen playerName={playerName} gameSettings={gameSettings} onUpdateSettings={setGameSettings} onStartSolo={handleStartSolo} onBack={() => setCurrentScreen("enterName")} />}
        
        {currentScreen === "multiplayerLobby" && <MultiplayerLobbyScreen roomCode={roomCode} players={players} playerName={playerName} currentPlayerId={socket.id || players[0]?.id} gameSettings={gameSettings} votes={votes} onUpdateVote={handleUpdateVote} onLockSettings={handleLockSettings} onBack={() => setCurrentScreen("enterName")} onSimulateGuest={handleSimulateGuest} />}
        
        {currentScreen === "game" && (
          <GameScreen
            key="game"
            playerName={playerName}
            selectedMode={selectedMode}
            gameSettings={gameSettings}
            scenarios={scenarios}
            currentScenarioIndex={currentScenarioIndex}
            onSubmitDecision={handleSubmitDecision}
            onExitGame={handleExitGame}
          />
        )}
        
        {currentScreen === "apexExplanation" && (
          <ApexExplanationScreen
            key="explanation"
            userDecision={userDecisions[currentScenarioIndex]}
            scenario={scenarios[currentScenarioIndex]}
            onNext={handleNextScenario}
          />
        )}
        
        {currentScreen === "results" && <ResultsScreen playerName={playerName} score={score} total={scenarios.length} alignCount={alignCount} disciplineCount={disciplineCount} onRestart={handleRestart} />}
      </AnimatePresence>
    </div>
  );
}
