'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-2xl shadow-lg',
          isUser
            ? 'bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300'
            : 'bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white dark:text-black" />
        ) : (
          <Bot className="h-5 w-5 text-black dark:text-white" />
        )}
      </div>
      <div className={cn('flex flex-col gap-2 max-w-[75%] sm:max-w-[70%]', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-6 py-4 break-words shadow-lg',
            isUser
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-50 dark:bg-gray-900 text-black dark:text-white border-2 border-gray-100 dark:border-gray-800'
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500 px-2 font-medium">
          {format(new Date(timestamp), 'h:mm a')}
        </span>
      </div>
    </div>
  );
}