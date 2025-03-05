"use client";

import React, { useEffect } from "react";
import useWritingStore from "@/store/useWritingStore";
import { format } from "date-fns";

const EntriesList: React.FC = () => {
  const { entries, fetchEntries } = useWritingStore();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  if (entries.length === 0) {
    return (
      <div className="mt-8 text-center text-muted">
        <p>No entries yet. Start writing to see your entries here!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-bold">Your Entries</h2>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-card-background p-4 rounded-lg border border-border-color">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-muted">
                  {entry.wordCount} words
                  {entry.isCompleted && (
                    <span className="ml-2 text-primary">✓ Completed</span>
                  )}
                </p>
              </div>
              <p className="text-sm text-muted">
                {format(new Date(entry.lastModified), "h:mm a")}
              </p>
            </div>
            <p className="whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntriesList;
