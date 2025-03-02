export interface WritingEntry {
  id: string;
  content: string;
  date: string; // ISO string
  wordCount: number;
  targetWordCount: number;
  isCompleted: boolean;
  lastModified: string; // ISO string
}

export interface DailyContribution {
  date: string; // ISO string
  wordCount: number;
}

export interface WritingStats {
  totalWordCount: number;
  totalEntries: number;
  streakDays: number;
  contributions: DailyContribution[];
}
