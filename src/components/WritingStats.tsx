"use client";

import React from "react";
import useWritingStore from "@/store/useWritingStore";
import { FaPencilAlt, FaCalendarAlt, FaFire } from "react-icons/fa";

const WritingStats: React.FC = () => {
  const { stats } = useWritingStore();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Your Writing Stats</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-background p-4 rounded-lg border border-border-color">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-900 text-blue-400 mr-4">
              <FaPencilAlt size={20} />
            </div>
            <div>
              <p className="text-sm text-muted">Total Words</p>
              <p className="text-2xl font-bold">
                {stats.totalWordCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card-background p-4 rounded-lg border border-border-color">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-900 text-green-400 mr-4">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <p className="text-sm text-muted">Total Entries</p>
              <p className="text-2xl font-bold">{stats.totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-card-background p-4 rounded-lg border border-border-color">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-900 text-orange-400 mr-4">
              <FaFire size={20} />
            </div>
            <div>
              <p className="text-sm text-muted">Current Streak</p>
              <p className="text-2xl font-bold">{stats.streakDays} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card-background p-4 rounded-lg border border-border-color">
        <h3 className="text-lg font-semibold mb-2">Writing Insights</h3>
        <p className="text-muted">
          {stats.totalWordCount > 0
            ? `You've written an average of ${Math.round(
                stats.totalWordCount / (stats.totalEntries || 1)
              )} words per entry.`
            : "Start writing to see your insights!"}
        </p>

        {stats.streakDays > 0 && (
          <p className="text-muted mt-2">
            Keep up your {stats.streakDays}-day streak! Consistency is key to
            building a writing habit.
          </p>
        )}
      </div>
    </div>
  );
};

export default WritingStats;
