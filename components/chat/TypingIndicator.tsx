'use client';

import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-2xl bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 shadow-lg">
        <Bot className="h-5 w-5 text-black dark:text-white" />
      </div>
      <div className="flex flex-col gap-2 max-w-[75%] sm:max-w-[70%]">
        <div className="rounded-2xl px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="flex gap-2">
            <span
              className="w-2.5 h-2.5 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '1s' }}
            />
            <span
              className="w-2.5 h-2.5 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms', animationDuration: '1s' }}
            />
            <span
              className="w-2.5 h-2.5 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms', animationDuration: '1s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}