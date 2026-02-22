export type Difficulty = "beginner" | "intermediate" | "expert";
export type ContentType = "charts" | "quiz";

export type GameSettings = {
  scenariosCount: 5 | 10 | 20;
  difficulty: Difficulty;
  contentType: ContentType;
};

export type UserDecision = "up" | "down" | "flat";

export type ApexGroundTruth = {
  decision: UserDecision;
  activatedNetworks: string[];
  rationale: string;
  riskComment: string;
};

export interface GameScenario {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  chartPlaceholderText?: string;
  quizQuestionText?: string;
  chartSymbol?: string;
  apexGroundTruth: ApexGroundTruth;
}
