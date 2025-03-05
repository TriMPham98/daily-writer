import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { WritingEntry, WritingStats, DailyContribution } from "@/types";

interface WritingStore {
  entries: WritingEntry[];
  currentEntry: WritingEntry | null;
  stats: WritingStats;

  // Actions
  createEntry: (targetWordCount: number) => void;
  updateEntry: (content: string) => void;
  completeEntry: () => void;
  getEntryById: (id: string) => WritingEntry | undefined;
  getEntriesByDate: (date: string) => WritingEntry[];
  getContributionsByMonth: (month: number, year: number) => DailyContribution[];
  fetchEntries: () => Promise<void>;
}

const DEFAULT_TARGET_WORD_COUNT = 50;

const calculateWordCount = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const useWritingStore = create<WritingStore>()(
  persist(
    (set, get) => ({
      entries: [],
      currentEntry: null,
      stats: {
        totalWordCount: 0,
        totalEntries: 0,
        streakDays: 0,
        contributions: [],
      },

      createEntry: async (targetWordCount = DEFAULT_TARGET_WORD_COUNT) => {
        const today = new Date();
        const todayStr = format(today, "yyyy-MM-dd");

        const newEntry: WritingEntry = {
          id: uuidv4(),
          content: "",
          date: todayStr,
          wordCount: 0,
          targetWordCount,
          isCompleted: false,
          lastModified: new Date().toISOString(),
        };

        try {
          const response = await fetch("/api/entries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEntry),
          });

          if (!response.ok) {
            throw new Error("Failed to create entry");
          }

          const savedEntry = await response.json();

          set((state) => ({
            entries: [...state.entries, savedEntry],
            currentEntry: savedEntry,
            stats: {
              ...state.stats,
              totalEntries: state.stats.totalEntries + 1,
            },
          }));
        } catch (error) {
          console.error("Failed to create entry:", error);
        }
      },

      updateEntry: async (content: string) => {
        const { currentEntry } = get();
        if (!currentEntry) return;

        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        const updatedEntry = {
          ...currentEntry,
          content,
          wordCount,
          lastModified: new Date().toISOString(),
        };

        try {
          const response = await fetch(`/api/entries/${currentEntry.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEntry),
          });

          if (!response.ok) {
            throw new Error("Failed to update entry");
          }

          const savedEntry = await response.json();

          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === currentEntry.id ? savedEntry : entry
            ),
            currentEntry: savedEntry,
          }));
        } catch (error) {
          console.error("Failed to update entry:", error);
        }
      },

      completeEntry: async () => {
        const { currentEntry } = get();
        if (!currentEntry) return;

        const updatedEntry = {
          ...currentEntry,
          isCompleted: true,
          lastModified: new Date().toISOString(),
        };

        try {
          const response = await fetch(`/api/entries/${currentEntry.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEntry),
          });

          if (!response.ok) {
            throw new Error("Failed to complete entry");
          }

          const savedEntry = await response.json();

          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === currentEntry.id ? savedEntry : entry
            ),
            currentEntry: savedEntry,
          }));
        } catch (error) {
          console.error("Failed to complete entry:", error);
        }
      },

      getEntryById: (id: string) => {
        return get().entries.find((entry) => entry.id === id);
      },

      getEntriesByDate: (date: string) => {
        return get().entries.filter((entry) => entry.date === date);
      },

      getContributionsByMonth: (month: number, year: number) => {
        const { contributions } = get().stats;
        return contributions.filter((contribution) => {
          const contributionDate = new Date(contribution.date);
          return (
            contributionDate.getMonth() === month &&
            contributionDate.getFullYear() === year
          );
        });
      },

      fetchEntries: async () => {
        try {
          const response = await fetch("/api/entries");
          if (!response.ok) {
            throw new Error("Failed to fetch entries");
          }

          const entries = await response.json();
          const totalWordCount = entries.reduce(
            (sum: number, entry: WritingEntry) => sum + entry.wordCount,
            0
          );

          set((state) => ({
            entries,
            stats: {
              ...state.stats,
              totalWordCount,
              totalEntries: entries.length,
            },
          }));
        } catch (error) {
          console.error("Failed to fetch entries:", error);
        }
      },
    }),
    {
      name: "writing-store",
    }
  )
);

export default useWritingStore;
