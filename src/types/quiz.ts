export type CharacterId =
  | 'twilight_sparkle'
  | 'rainbow_dash'
  | 'pinkie_pie'
  | 'fluttershy'
  | 'rarity'
  | 'applejack';

export interface Character {
  characterId: CharacterId;
  name: string;
  displayName: string;
  thaiName: string;
  element: string; // Element of Harmony
  elementThai: string;
  species: string;
  image: string;
  themeColor: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  quote: string;
  personality: string;
  generalTraits: string[];
  strengths: string[];
  weaknesses: string[];
  description: string;
  howYouThink: string;
  socialAndFriendship: string;
  coreValues: string;
  suitableActivities: {
    category: string;
    items: string[];
  }[];
  thingsToWatchOutFor: string[];
  friendshipAdvice: string;
}

export type QuestionCategory =
  | 'personality'
  | 'friendship'
  | 'decision'
  | 'work'
  | 'dreams'
  | 'emotions'
  | 'problem_solving'
  | 'courage'
  | 'creativity'
  | 'social'
  | 'responsibility';

export interface QuestionOption {
  id: string;
  text: string;
  scores: Record<CharacterId, number>;
  primaryTrait: string;
  traitDescription: string;
}

export interface Question {
  id: number;
  category: QuestionCategory;
  categoryLabel: string;
  text: string;
  situation?: string;
  options: QuestionOption[];
  isScored?: boolean; // defaults to true. If false, this question does not count towards score calculation
}

export interface UserAnswerRecord {
  questionId: number;
  questionText: string;
  optionId: string;
  optionText: string;
  primaryTrait: string;
  traitDescription: string;
  scores: Record<CharacterId, number>;
  isScored?: boolean; // indicates whether this answer counted towards score calculation
}

export interface CharacterMatchScore {
  characterId: CharacterId;
  name: string;
  displayName: string;
  thaiName: string;
  image: string;
  score: number;
  percentage: number;
}

export interface DynamicQuizAnalysis {
  whyYouAreLikeThis: string;
  userPersona: string;
  customAdvice: string;
  dominantTraits: string[];
}

export interface QuizResultRecord {
  id: string;
  userId: string;
  createdAt: string; // ISO string
  formattedDate: string;
  answers: UserAnswerRecord[];
  rawScores: Record<CharacterId, number>;
  rankedCharacters: CharacterMatchScore[];
  topCharacter: CharacterMatchScore;
  secondCharacter: CharacterMatchScore;
  thirdCharacter: CharacterMatchScore;
  dynamicAnalysis: DynamicQuizAnalysis;
}

export interface UserAccount {
  userId: string;
  displayName: string;
  email: string;
  passwordHash: string;
  salt: string;
  birthday?: string;
  createdAt: string;
}
