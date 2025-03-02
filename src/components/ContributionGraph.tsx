"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import useWritingStore from "@/store/useWritingStore";
import { DailyContribution } from "@/types";

const ContributionGraph: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const { stats } = useWritingStore();

  // Get all days in the current month
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });
    setDays(daysInMonth);
  }, [currentMonth]);

  // Get the color intensity based on word count
  const getColorIntensity = (date: Date): string => {
    const contribution = stats.contributions.find((c) =>
      isSameDay(new Date(c.date), date)
    );

    if (!contribution) return "bg-gray-800";

    const wordCount = contribution.wordCount;

    if (wordCount === 0) return "bg-gray-800";
    if (wordCount < 100) return "bg-blue-900";
    if (wordCount < 300) return "bg-blue-700";
    if (wordCount < 500) return "bg-blue-500";
    return "bg-blue-400";
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Get contribution details for a specific day
  const getContributionDetails = (
    date: Date
  ): DailyContribution | undefined => {
    return stats.contributions.find((c) => isSameDay(new Date(c.date), date));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Writing Contributions</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-card-background text-foreground">
            ←
          </button>
          <span className="font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-card-background text-foreground">
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-muted">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const contribution = getContributionDetails(day);
          return (
            <div key={day.toISOString()} className="aspect-square">
              <div
                className={`w-full h-full rounded-sm ${getColorIntensity(
                  day
                )} cursor-pointer`}
                title={
                  contribution
                    ? `${format(day, "MMM d, yyyy")}: ${
                        contribution.wordCount
                      } words`
                    : `${format(day, "MMM d, yyyy")}: No writing`
                }
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-end text-xs text-muted">
        <span className="mr-2">Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-900 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
        </div>
        <span className="ml-2">More</span>
      </div>
    </div>
  );
};

export default ContributionGraph;
