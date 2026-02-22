import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Users, Info, ShieldCheck, Activity, Target, ArrowLeft, ArrowRight, Copy, Play, UserPlus, Settings2, CheckCircle2, BarChart2, HelpCircle } from 'lucide-react';

type Screen = "home" | "enterName" | "multiplayerLobby" | "soloSettings";
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

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  expert: "Expert"
};

const contentTypeLabels: Record<ContentType, string> = {
  charts: "Graphiques TradingView",
  quiz: "Questions simples"
};

function EnterNameScreen({ mode, onBack, onSubmit }: { mode: Mode, onBack: () => void, onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");
  const isValid = name.trim().length > 0;

  const handleSubmit = () => {
    if (isValid) onSubmit(name.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit();
    }
  };

  return (
    <motion.div 
      key="enterName"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center flex-1 w-full p-6 relative z-10"
    >
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-xl font-medium px-4 py-2 rounded-xl hover:bg-slate-800/50 active:bg-slate-800"
        >
          <ArrowLeft className="w-6 h-6" />
          Retour
        </button>
      </div>

      <div className="w-full max-w-2xl bg-slate-800/40 border border-slate-700 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {mode === 'solo' ? 'Mode Solo : entrez votre nom' : 'Mode Multijoueur : entrez votre nom'}
          </h2>
          <p className="text-xl text-slate-400">
            Ce nom sera affiché sur le tableau des scores.
          </p>
        </div>

        <div className="space-y-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre prénom ou pseudo"
            className="w-full bg-slate-900/80 border-2 border-slate-600 focus:border-emerald-500 rounded-2xl px-6 py-6 text-2xl text-white placeholder-slate-500 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            autoFocus
          />

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:cursor-not-allowed text-white text-2xl font-bold py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-transparent"
          >
            Continuer
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-center px-6 w-full">
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          Apex privilégie la qualité des trades plutôt que la fréquence et sait quand ne pas agir pour protéger le capital.
        </p>
      </div>
    </motion.div>
  );
}

function SoloSettingsScreen({
  playerName,
  gameSettings,
  onUpdateSettings,
  onStartSolo,
  onBack
}: {
  playerName: string,
  gameSettings: GameSettings,
  onUpdateSettings: (settings: GameSettings) => void,
  onStartSolo: () => void,
  onBack: () => void
}) {
  const handleUpdate = (partial: Partial<GameSettings>) => {
    onUpdateSettings({ ...gameSettings, ...partial });
  };

  const PillButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex-1 text-center text-lg ${
        isActive 
          ? 'bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02] border-transparent' 
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
      }`}
    >
      {label}
    </button>
  );

  const CardButton = ({ title, description, isActive, onClick, icon: Icon }: { title: string, description: string, isActive: boolean, onClick: () => void, icon?: React.ElementType }) => (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl text-left transition-all duration-200 flex-1 border relative overflow-hidden group ${
        isActive 
          ? 'bg-emerald-900/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
      }`}
    >
      {isActive && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`} />}
          <h4 className={`text-xl font-bold ${isActive ? 'text-emerald-400' : 'text-slate-200 group-hover:text-white'}`}>
            {title}
          </h4>
        </div>
        <p className={`text-base mt-2 ${isActive ? 'text-emerald-100/80' : 'text-slate-400 group-hover:text-slate-300'}`}>
          {description}
        </p>
      </div>
    </button>
  );

  return (
    <motion.div 
      key="soloSettings"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center flex-1 w-full p-6 relative z-10 overflow-y-auto"
    >
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 mt-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-xl font-medium px-4 py-2 rounded-xl hover:bg-slate-800/50 active:bg-slate-800"
        >
          <ArrowLeft className="w-6 h-6" />
          Retour
        </button>
      </div>

      <div className="w-full max-w-5xl bg-slate-800/40 border border-slate-700 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl mb-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Paramètres de votre partie solo
          </h2>
          <p className="text-xl text-slate-400">
            Bonjour, <span className="text-emerald-400 font-semibold">{playerName}</span> 👋 Configurez votre session de jeu, puis comparez vos décisions à celles d'Apex.
          </p>
        </div>

        <div className="space-y-12">
          {/* Scenarios Count */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-sm font-bold">1</span>
              Combien de scénarios souhaitez-vous jouer ?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <PillButton label="5 scénarios" isActive={gameSettings.scenariosCount === 5} onClick={() => handleUpdate({ scenariosCount: 5 })} />
              <PillButton label="10 scénarios" isActive={gameSettings.scenariosCount === 10} onClick={() => handleUpdate({ scenariosCount: 10 })} />
              <PillButton label="20 scénarios" isActive={gameSettings.scenariosCount === 20} onClick={() => handleUpdate({ scenariosCount: 20 })} />
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-sm font-bold">2</span>
              Choisissez votre niveau
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CardButton 
                title="Débutant" 
                description="Scénarios clairs, explications très pédagogiques." 
                isActive={gameSettings.difficulty === "beginner"} 
                onClick={() => handleUpdate({ difficulty: "beginner" })} 
              />
              <CardButton 
                title="Intermédiaire" 
                description="Plus de volatilité et de zones d'incertitude." 
                isActive={gameSettings.difficulty === "intermediate"} 
                onClick={() => handleUpdate({ difficulty: "intermediate" })} 
              />
              <CardButton 
                title="Expert" 
                description="Situations complexes, discipline d'Apex mise en avant." 
                isActive={gameSettings.difficulty === "expert"} 
                onClick={() => handleUpdate({ difficulty: "expert" })} 
              />
            </div>
          </div>

          {/* Content Type */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-sm font-bold">3</span>
              Type de contenu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardButton 
                icon={BarChart2}
                title="Graphiques TradingView" 
                description="Analysez de vrais graphiques et prédisez le mouvement." 
                isActive={gameSettings.contentType === "charts"} 
                onClick={() => handleUpdate({ contentType: "charts" })} 
              />
              <CardButton 
                icon={HelpCircle}
                title="Questions simples en trading" 
                description="Quiz courts pour découvrir les principes d'Apex." 
                isActive={gameSettings.contentType === "quiz"} 
                onClick={() => handleUpdate({ contentType: "quiz" })} 
              />
            </div>
          </div>
        </div>

        {/* Summary & Start */}
        <div className="mt-12 pt-10 border-t border-slate-700/50">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 mb-8 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="text-slate-300 text-lg">
                Vous allez jouer : <strong className="text-white">{gameSettings.scenariosCount} scénarios</strong> - Niveau <strong className="text-white">{difficultyLabels[gameSettings.difficulty]}</strong> - <strong className="text-white">{contentTypeLabels[gameSettings.contentType]}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onStartSolo}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white text-2xl font-bold py-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-transparent shadow-xl shadow-emerald-900/20"
          >
            <Play className="w-8 h-8" />
            Lancer la partie solo
          </button>
        </div>
      </div>

      <div className="text-center px-6 w-full pb-8">
        <p className="text-slate-500 text-sm md:text-base max-w-3xl mx-auto">
          Apex orchestre plusieurs réseaux spécialisés (tendance, momentum, structure) et sait quand ne pas agir pour préserver le capital.
        </p>
      </div>
    </motion.div>
  );
}

function MultiplayerLobbyScreen({ 
  roomCode, 
  players, 
  playerName,
  currentPlayerId,
  gameSettings,
  votes,
  onUpdateVote,
  onLockSettings,
  onBack, 
  onSimulateGuest 
}: { 
  roomCode: string, 
  players: Player[], 
  playerName: string,
  currentPlayerId: string,
  gameSettings: GameSettings,
  votes: PlayerVotes,
  onUpdateVote: (playerId: string, vote: GameSettings) => void,
  onLockSettings: (settings: GameSettings) => void,
  onBack: () => void,
  onSimulateGuest: () => void
}) {
  const [tipIndex, setTipIndex] = useState(0);
  const tips = [
    "Astuce : ne tradez pas si vous ne comprenez pas le contexte du marché.",
    "Astuce : Apex privilégie la qualité plutôt que la quantité de trades.",
    "Astuce : savoir ne pas agir est parfois la meilleure décision pour protéger le capital."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    console.log("copy room link");
  };

  const isHost = players.find(p => p.id === currentPlayerId)?.isHost;
  const currentVote = votes[currentPlayerId] || gameSettings;

  const handleVote = (partial: Partial<GameSettings>) => {
    onUpdateVote(currentPlayerId, { ...currentVote, ...partial });
  };

  const SettingButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 text-center ${
        isActive 
          ? 'bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02] border-transparent' 
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <motion.div 
      key="multiplayerLobby"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center flex-1 w-full p-6 relative z-10 overflow-y-auto"
    >
      <div className="w-full max-w-7xl flex justify-between items-center mb-8 mt-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-xl font-medium px-4 py-2 rounded-xl hover:bg-slate-800/50 active:bg-slate-800"
        >
          <ArrowLeft className="w-6 h-6" />
          Quitter la salle
        </button>
        
        <button 
          onClick={onSimulateGuest}
          disabled={players.length >= 4}
          className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 transition-colors duration-200 text-sm md:text-base font-medium px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700"
        >
          <UserPlus className="w-5 h-5" />
          Simuler un joueur
        </button>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
            <div className="space-y-2 mb-6">
              <h2 className="text-3xl font-bold text-white">Salle d'attente multijoueur</h2>
              <p className="text-lg text-slate-400">Partagez ce code avec 2 à 4 joueurs pour rejoindre la partie.</p>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-3">Code de la salle</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-5xl font-mono font-bold text-emerald-400 tracking-widest">
                  {roomCode}
                </div>
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl transition-colors duration-200 font-medium shrink-0"
                >
                  <Copy className="w-5 h-5" />
                  Copier le lien
                </button>
              </div>
              <p className="text-slate-500 mt-4 text-sm break-all">
                Lien : <span className="text-slate-400">https://demo-aethera.app/join?code={roomCode}</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Settings2 className="w-7 h-7 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">Paramètres de la partie (vote)</h3>
            </div>
            <p className="text-slate-400 mb-8">Votez pour les paramètres de la partie. La valeur la plus votée est appliquée à tous.</p>

            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-slate-300 font-medium">Nombre de scénarios</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <SettingButton label="5 scénarios" isActive={gameSettings.scenariosCount === 5} onClick={() => handleVote({ scenariosCount: 5 })} />
                  <SettingButton label="10 scénarios" isActive={gameSettings.scenariosCount === 10} onClick={() => handleVote({ scenariosCount: 10 })} />
                  <SettingButton label="20 scénarios" isActive={gameSettings.scenariosCount === 20} onClick={() => handleVote({ scenariosCount: 20 })} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-slate-300 font-medium">Niveau de difficulté</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <SettingButton label="Débutant" isActive={gameSettings.difficulty === "beginner"} onClick={() => handleVote({ difficulty: "beginner" })} />
                  <SettingButton label="Intermédiaire" isActive={gameSettings.difficulty === "intermediate"} onClick={() => handleVote({ difficulty: "intermediate" })} />
                  <SettingButton label="Expert" isActive={gameSettings.difficulty === "expert"} onClick={() => handleVote({ difficulty: "expert" })} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-slate-300 font-medium">Type de contenu</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <SettingButton label="Graphiques TradingView" isActive={gameSettings.contentType === "charts"} onClick={() => handleVote({ contentType: "charts" })} />
                  <SettingButton label="Questions simples" isActive={gameSettings.contentType === "quiz"} onClick={() => handleVote({ contentType: "quiz" })} />
                </div>
              </div>
            </div>

            <div className="mt-8 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-400 font-semibold mb-1">Paramètres retenus</p>
                <p className="text-slate-300">
                  {gameSettings.scenariosCount} scénarios • {difficultyLabels[gameSettings.difficulty]} • {contentTypeLabels[gameSettings.contentType]}
                </p>
              </div>
            </div>
          </div>

          {isHost && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4"
            >
              <button
                onClick={() => onLockSettings(gameSettings)}
                disabled={players.length < 2}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:cursor-not-allowed text-white text-2xl font-bold py-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-transparent shadow-xl shadow-emerald-900/20"
              >
                <Play className="w-8 h-8" />
                Valider ces paramètres et démarrer la partie
              </button>
              {players.length < 2 && (
                <p className="text-center text-slate-400 text-sm mt-4">
                  Attendez au moins un autre joueur pour commencer.
                </p>
              )}
            </motion.div>
          )}

        </div>

        <div className="lg:col-span-5 space-y-8 flex flex-col h-full">
          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-500" />
              Joueurs présents ({players.length}/4)
            </h3>
            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="text-xl text-white font-medium">{player.name}</span>
                  </div>
                  {player.isHost && (
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-sm font-semibold border border-emerald-500/30">
                      Hôte
                    </span>
                  )}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-4 bg-slate-800/20 border border-slate-700/30 border-dashed rounded-xl p-4 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="text-lg text-slate-500 italic">En attente d'un joueur...</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden min-h-[250px]">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Info className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Conseil d'expert</h3>
            </div>
            
            <div className="relative flex-1 z-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl text-slate-300 leading-relaxed font-light absolute inset-0"
                >
                  {tips[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <div className="flex gap-2 mt-8 relative z-10">
              {tips.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === tipIndex ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
                />
              ))}
            </div>
          </div>
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

  const handleAboutApex = () => {
    alert("À propos d'Apex : Ce module sera disponible prochainement.");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setSelectedMode(null);
    setPlayerName("");
    setRoomCode("");
    setPlayers([]);
    setVotes({});
    setGameSettings({
      scenariosCount: 5,
      difficulty: "beginner",
      contentType: "charts"
    });
  };

  const handleBackToEnterName = () => {
    setCurrentScreen("enterName");
    setGameSettings({
      scenariosCount: 5,
      difficulty: "beginner",
      contentType: "charts"
    });
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const calculateMajority = (votesObj: PlayerVotes, currentSettings: GameSettings): GameSettings => {
    if (Object.keys(votesObj).length === 0) return currentSettings;

    const counts = {
      scenariosCount: { 5: 0, 10: 0, 20: 0 },
      difficulty: { beginner: 0, intermediate: 0, expert: 0 },
      contentType: { charts: 0, quiz: 0 }
    };

    Object.values(votesObj).forEach(vote => {
      counts.scenariosCount[vote.scenariosCount]++;
      counts.difficulty[vote.difficulty]++;
      counts.contentType[vote.contentType]++;
    });

    const getMajority = <T extends string | number>(countObj: Record<string, number>, currentVal: T): T => {
      let maxCount = -1;
      let majorityVal = currentVal;
      let tie = false;

      for (const [valStr, count] of Object.entries(countObj)) {
        const val = (typeof currentVal === 'number' ? Number(valStr) : valStr) as T;
        if (count > maxCount) {
          maxCount = count;
          majorityVal = val;
          tie = false;
        } else if (count === maxCount) {
          tie = true;
        }
      }
      return tie ? currentVal : majorityVal;
    };

    return {
      scenariosCount: getMajority(counts.scenariosCount, currentSettings.scenariosCount),
      difficulty: getMajority(counts.difficulty, currentSettings.difficulty),
      contentType: getMajority(counts.contentType, currentSettings.contentType),
    };
  };

  const handleUpdateVote = (playerId: string, newVote: GameSettings) => {
    setVotes(prev => {
      const newVotes = { ...prev, [playerId]: newVote };
      const newSettings = calculateMajority(newVotes, gameSettings);
      setGameSettings(newSettings);
      return newVotes;
    });
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    
    if (selectedMode === "multiplayer") {
      const code = generateRoomCode();
      setRoomCode(code);
      const hostId = "host";
      setPlayers([{ id: hostId, name, isHost: true }]);
      
      // Initialize host vote with default settings
      handleUpdateVote(hostId, gameSettings);
      
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

  const handleSimulateGuest = () => {
    if (players.length >= 4) return;
    const guestNumber = players.length;
    const guestId = `guest-${guestNumber}`;
    
    setPlayers(prev => [
      ...prev,
      { id: guestId, name: `Guest ${guestNumber}`, isHost: false }
    ]);

    // Give the guest a random vote to simulate real voting
    const randomScenarios = [5, 10, 20][Math.floor(Math.random() * 3)] as 5 | 10 | 20;
    const randomDiff = ["beginner", "intermediate", "expert"][Math.floor(Math.random() * 3)] as Difficulty;
    const randomContent = ["charts", "quiz"][Math.floor(Math.random() * 2)] as ContentType;
    
    handleUpdateVote(guestId, {
      scenariosCount: randomScenarios,
      difficulty: randomDiff,
      contentType: randomContent
    });
  };

  const handleLockSettings = (finalSettings: GameSettings) => {
    console.log("Final game settings", finalSettings);
    console.log("start multiplayer game");
  };

  const handleStartSolo = () => {
    console.log("start solo game", gameSettings, playerName);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ['0%', '5%', '0%'],
            y: ['0%', '-5%', '0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/20 blur-[100px] will-change-transform"
        />
        <motion.div
          animate={{
            x: ['0%', '-5%', '0%'],
            y: ['0%', '5%', '0%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[100px] will-change-transform"
        />
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === "home" && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col flex-1 w-full z-10"
          >
            <header className="relative z-10 w-full p-8 md:p-12 flex flex-col items-center text-center space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Activity className="w-7 h-7 text-slate-900" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Aethera <span className="text-slate-400 font-light">| Apex Trading Demo</span>
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light"
              >
                Découvrez comment Apex décide quand agir… et quand ne pas agir.
              </motion.p>
            </header>

            <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-7 flex flex-col space-y-10"
              >
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                    Choisissez votre mode de jeu
                  </h2>
                  <p className="text-slate-400 text-xl">
                    Testez vos instincts face au marché et comparez vos choix à ceux de l'IA.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <button 
                    onClick={handleSelectSolo}
                    className="group relative flex items-center p-6 md:p-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] active:bg-slate-900 text-left overflow-hidden min-h-[140px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-20 h-20 rounded-full bg-slate-700/50 group-hover:bg-emerald-500/20 flex items-center justify-center mr-6 shrink-0 transition-colors duration-300">
                      <User className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                        Mode Solo
                      </h3>
                      <p className="text-slate-400 text-xl">
                        Jouez seul, 5 à 20 scénarios guidés.
                      </p>
                    </div>
                  </button>

                  <button 
                    onClick={handleSelectMultiplayer}
                    className="group relative flex items-center p-6 md:p-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] active:bg-slate-900 text-left overflow-hidden min-h-[140px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-20 h-20 rounded-full bg-slate-700/50 group-hover:bg-emerald-500/20 flex items-center justify-center mr-6 shrink-0 transition-colors duration-300">
                      <Users className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                        Mode Multijoueur <span className="text-slate-500 text-2xl font-normal">(2–4 joueurs)</span>
                      </h3>
                      <p className="text-slate-400 text-xl">
                        Affrontez vos collègues et comparez-vous à Apex.
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-4 text-slate-300 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 w-fit">
                  <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                  <p className="text-lg">Aucun compte requis. Niveau débutant bienvenu.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-5 flex flex-col h-full justify-center"
              >
                <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-slate-700/50 rounded-xl">
                        <Target className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-3xl font-bold text-white">Apex en 3 points</h3>
                    </div>
                    
                    <ul className="space-y-8">
                      <li className="flex items-start gap-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <p className="text-slate-300 text-xl leading-relaxed">
                          <strong className="text-white font-medium">Orchestre plusieurs réseaux spécialisés</strong> (tendance, momentum, structure).
                        </p>
                      </li>
                      <li className="flex items-start gap-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <p className="text-slate-300 text-xl leading-relaxed">
                          <strong className="text-white font-medium">Privilégie la qualité des trades</strong> plutôt que la fréquence.
                        </p>
                      </li>
                      <li className="flex items-start gap-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <p className="text-slate-300 text-xl leading-relaxed">
                          <strong className="text-white font-medium">Sait quand ne PAS agir</strong> pour protéger le capital.
                        </p>
                      </li>
                    </ul>

                    <div className="mt-12 pt-8 border-t border-slate-700/50">
                      <button 
                        onClick={handleAboutApex}
                        className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 active:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-200 text-xl font-medium -ml-4"
                      >
                        <Info className="w-6 h-6" />
                        À propos d'Apex
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </main>
          </motion.div>
        )}

        {currentScreen === "enterName" && (
          <EnterNameScreen 
            key="enterName"
            mode={selectedMode} 
            onBack={handleBackToHome} 
            onSubmit={handleNameSubmit} 
          />
        )}

        {currentScreen === "soloSettings" && (
          <SoloSettingsScreen
            key="soloSettings"
            playerName={playerName}
            gameSettings={gameSettings}
            onUpdateSettings={setGameSettings}
            onStartSolo={handleStartSolo}
            onBack={handleBackToEnterName}
          />
        )}

        {currentScreen === "multiplayerLobby" && (
          <MultiplayerLobbyScreen
            key="multiplayerLobby"
            roomCode={roomCode}
            players={players}
            playerName={playerName}
            currentPlayerId="host"
            gameSettings={gameSettings}
            votes={votes}
            onUpdateVote={handleUpdateVote}
            onLockSettings={handleLockSettings}
            onBack={handleBackToHome}
            onSimulateGuest={handleSimulateGuest}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
