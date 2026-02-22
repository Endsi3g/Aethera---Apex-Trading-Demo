export type Decision = 'buy' | 'hold' | 'sell';
export type ScenarioContentType = 'charts' | 'quiz';

export interface Scenario {
  id: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  contentType: ScenarioContentType;
  title: string;
  description: string;
  chartSymbol?: string;
  options?: string[]; // For quiz
  correctOption?: number; // For quiz
  apexGroundTruth: {
    decision: Decision;
    activatedNetworks: string[];
    rationale: string;
    riskComment: string;
  };
}

export const mockScenarios: Scenario[] = [
  // CHARTS Scenarios
  {
    id: "chart-1",
    difficulty: "beginner",
    contentType: "charts",
    title: "Tendance Haussière Saine",
    description: "Le prix progresse au-dessus de sa moyenne mobile 50 jours. Que faites-vous ?",
    chartSymbol: "BINANCE:BTCUSDT",
    apexGroundTruth: {
      decision: "buy",
      activatedNetworks: ["tendance", "momentum"],
      rationale: "La structure de marché est saine avec des creux ascendants.",
      riskComment: "Faible risque. Alignement avec la tendance primaire."
    }
  },
  {
    id: "chart-2",
    difficulty: "intermediate",
    contentType: "charts",
    title: "Double Sommet Potentiel",
    description: "Le prix teste une résistance majeure pour la deuxième fois avec une divergence RSI.",
    chartSymbol: "BINANCE:ETHUSDT",
    apexGroundTruth: {
      decision: "sell",
      activatedNetworks: ["résistance", "divergence"],
      rationale: "Le momentum faiblit alors que le prix stagne sur un niveau psychologique.",
      riskComment: "Risque modéré. Un breakout est possible si le volume augmente."
    }
  },
  {
    id: "chart-3",
    difficulty: "expert",
    contentType: "charts",
    title: "Fakeout de Support",
    description: "Le prix a cassé le support avant de réintégrer rapidement la zone avec un fort volume.",
    chartSymbol: "BINANCE:SOLUSDT",
    apexGroundTruth: {
      decision: "buy",
      activatedNetworks: ["liquidation", "réintégration"],
      rationale: "Les stops ont été balayés sous le support. C'est un signal d'achat puissant.",
      riskComment: "Risque élevé. Nécessite une confirmation sur l'unité de temps supérieure."
    }
  },
  {
    id: "chart-4",
    difficulty: "beginner",
    contentType: "charts",
    title: "Consolidation Latérale",
    description: "Le marché est dans un range étroit depuis 48h. Aucune direction claire.",
    chartSymbol: "BINANCE:BNBUSDT",
    apexGroundTruth: {
      decision: "hold",
      activatedNetworks: ["neutralité", "congestion"],
      rationale: "Il n'y a pas d'avantage statistique à entrer en position ici.",
      riskComment: "Discipline requise : attendre la sortie du range."
    }
  },
  {
    id: "chart-5",
    difficulty: "intermediate",
    contentType: "charts",
    title: "Breakout de Triangle Ascendant",
    description: "Le prix compresse sous une résistance horizontale. Le triangle est complet à 75%.",
    chartSymbol: "BINANCE:LINKUSDT",
    apexGroundTruth: {
      decision: "buy",
      activatedNetworks: ["compression", "accumulation"],
      rationale: "La pression acheteuse s'intensifie. Un mouvement explosif est imminent.",
      riskComment: "Anticipation saine, mais placer le stop sous l'hypoténuse."
    }
  },
  {
    id: "chart-6",
    difficulty: "expert",
    contentType: "charts",
    title: "Retournement sur RSI Sur-vendu",
    description: "Après une chute de 20%, le RSI 4h est à 12. Une bougie de retournement se forme.",
    chartSymbol: "BINANCE:AVAXUSDT",
    apexGroundTruth: {
      decision: "buy",
      activatedNetworks: ["épuisement", "rebond"],
      rationale: "Vente émotionnelle extrême. Rebond technique attendu vers la EMA 20.",
      riskComment: "Contre-tendance. Gestion rigoureuse du risque obligatoire."
    }
  },
  // QUIZ Scenarios
  {
    id: "quiz-1",
    difficulty: "beginner",
    contentType: "quiz",
    title: "Gestion du Risque",
    description: "Quelle part de votre capital devriez-vous risquer sur un seul trade ?",
    options: ["10-20%", "1-2%", "50%", "Tout dépend du levier"],
    correctOption: 1,
    apexGroundTruth: {
      decision: "hold",
      activatedNetworks: ["gestion-risque", "survie"],
      rationale: "La survie du trader dépend de sa capacité à encaisser une série de pertes.",
      riskComment: "La discipline est le premier réseau activé par Apex."
    }
  },
  {
    id: "quiz-2",
    difficulty: "intermediate",
    contentType: "quiz",
    title: "Sortie de Position",
    description: "Votre cible est atteinte mais le momentum est encore très fort. Que suggère Apex ?",
    options: ["Fermer tout", "Prendre 50% et monter le stop", "Doubler la position", "Attendre que ça baisse"],
    correctOption: 1,
    apexGroundTruth: {
      decision: "hold",
      activatedNetworks: ["optimisation", "r-ratio"],
      rationale: "Sécuriser les profits tout en laissant courir les gagnants est optimal.",
      riskComment: "Éviter la cupidité tout en exploitant la tendance."
    }
  },
  {
    id: "quiz-3",
    difficulty: "expert",
    contentType: "quiz",
    title: "Analyse de Sentiment",
    description: "L'indice Fear & Greed est à 85. Les réseaux sociaux sont euphoriques.",
    options: ["Acheter plus", "Vendre partiellement", "Ignorer et regarder le prix", "Tout vendre"],
    correctOption: 1,
    apexGroundTruth: {
      decision: "sell",
      activatedNetworks: ["sentiment", "contrarien"],
      rationale: "L'euphorie précède souvent les corrections majeures de marché.",
      riskComment: "Ne soyez pas la liquidité de sortie des institutions."
    }
  }
];
