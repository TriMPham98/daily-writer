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
}

const DEFAULT_TARGET_WORD_COUNT = 500;

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

      createEntry: (targetWordCount = DEFAULT_TARGET_WORD_COUNT) => {
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

        set((state) => ({
          entries: [...state.entries, newEntry],
          currentEntry: newEntry,
          stats: {
            ...state.stats,
            totalEntries: state.stats.totalEntries + 1,
          },
        }));
      },

      updateEntry: (content: string) => {
        const { currentEntry } = get();
        if (!currentEntry) return;

        const wordCount = calculateWordCount(content);

        set((state) => {
          // Find the entry in the entries array
          const updatedEntries = state.entries.map((entry) => {
            if (entry.id === currentEntry.id) {
              return {
                ...entry,
                content,
                wordCount,
                lastModified: new Date().toISOString(),
              };
            }
            return entry;
          });

          // Update the current entry
          const updatedCurrentEntry = {
            ...currentEntry,
            content,
            wordCount,
            lastModified: new Date().toISOString(),
          };

          // Calculate the word count difference for stats
          const wordCountDiff = wordCount - currentEntry.wordCount;

          // Update contributions for today
          const today = format(new Date(), "yyyy-MM-dd");
          let contributions = [...state.stats.contributions];
          const todayContributionIndex = contributions.findIndex(
            (c) => c.date === today
          );

          if (todayContributionIndex >= 0) {
            contributions[todayContributionIndex] = {
              ...contributions[todayContributionIndex],
              wordCount:
                contributions[todayContributionIndex].wordCount + wordCountDiff,
            };
          } else {
            contributions.push({
              date: today,
              wordCount,
            });
          }

          return {
            entries: updatedEntries,
            currentEntry: updatedCurrentEntry,
            stats: {
              ...state.stats,
              totalWordCount: state.stats.totalWordCount + wordCountDiff,
              contributions,
            },
          };
        });
      },

      completeEntry: () => {
        const { currentEntry } = get();
        if (!currentEntry) return;

        set((state) => {
          const updatedEntries = state.entries.map((entry) => {
            if (entry.id === currentEntry.id) {
              return {
                ...entry,
                isCompleted: true,
                lastModified: new Date().toISOString(),
              };
            }
            return entry;
          });

          return {
            entries: updatedEntries,
            currentEntry: {
              ...currentEntry,
              isCompleted: true,
              lastModified: new Date().toISOString(),
            },
          };
        });
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
    }),
    {
      name: "writing-store",
    }
  )
);

export default useWritingStore;
