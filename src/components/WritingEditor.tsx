"use client";

import React, { useState, useEffect, useRef } from "react";
import useWritingStore from "@/store/useWritingStore";

interface WritingEditorProps {
  targetWordCount?: number;
}

const WritingEditor: React.FC<WritingEditorProps> = ({
  targetWordCount = 500,
}) => {
  const { currentEntry, createEntry, updateEntry, completeEntry } =
    useWritingStore();
  const [content, setContent] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Create a new entry if there's no current entry
  useEffect(() => {
    if (!currentEntry) {
      createEntry(targetWordCount);
    } else {
      setContent(currentEntry.content);

      // Check if the entry is already completed
      if (currentEntry.isCompleted) {
        setIsEditable(false);
      }
    }
  }, [currentEntry, createEntry, targetWordCount]);

  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    // Prevent deletion if word count is below target
    if (currentEntry && !currentEntry.isCompleted) {
      const currentWordCount = currentEntry.wordCount;
      const newWordCount = newContent
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

      // Only allow adding content, not deleting, if below target
      if (
        newWordCount < currentWordCount &&
        currentWordCount < targetWordCount
      ) {
        return;
      }

      setContent(newContent);
      updateEntry(newContent);

      // Check if target is reached
      if (newWordCount >= targetWordCount && !currentEntry.isCompleted) {
        completeEntry();
        setIsEditable(false);
      }
    }
  };

  // Handle key down to prevent deletion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!currentEntry || currentEntry.isCompleted) return;

    const currentWordCount = currentEntry.wordCount;

    // Prevent deletion keys if below target word count
    if (currentWordCount < targetWordCount) {
      if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        (e.ctrlKey && e.key === "x") ||
        (e.metaKey && e.key === "x")
      ) {
        const selection = window.getSelection();
        const hasSelection = selection && selection.toString().length > 0;

        // Allow deletion only if no text is selected
        if (hasSelection) {
          e.preventDefault();
        }
      }
    }
  };

  // Handle paste to prevent deletion
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!currentEntry || currentEntry.isCompleted) return;

    const currentWordCount = currentEntry.wordCount;

    // Prevent paste if it would replace selected text and we're below target
    if (currentWordCount < targetWordCount) {
      const selection = window.getSelection();
      const hasSelection = selection && selection.toString().length > 0;

      if (hasSelection) {
        e.preventDefault();

        // Get the clipboard text and insert it without replacing selection
        const clipboardText = e.clipboardData.getData("text");
        const textarea = textareaRef.current;

        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent =
            content.substring(0, start) +
            clipboardText +
            content.substring(end);

          setContent(newContent);
          updateEntry(newContent);

          // Set cursor position after pasted text
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              start + clipboardText.length;
          }, 0);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Daily Writing</h2>
          {currentEntry && (
            <p className="text-sm text-gray-600">
              Word Count: {currentEntry.wordCount} /{" "}
              {currentEntry.targetWordCount}
              {currentEntry.isCompleted && (
                <span className="ml-2 text-green-600">✓ Completed</span>
              )}
            </p>
          )}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={!isEditable}
        className="w-full h-96 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Start writing here... You won't be able to delete text until you reach your word count goal."
      />

      {!isEditable && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          <p>
            Congratulations! You've reached your word count goal. Your entry is
            now locked.
          </p>
        </div>
      )}
    </div>
  );
};

export default WritingEditor;
