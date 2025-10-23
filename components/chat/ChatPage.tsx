'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Moon, Sun, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';

export function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: models = [], isLoading: modelsLoading } = trpc.models.getAvailable.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: messages = [], refetch: refetchMessages } = trpc.chat.history.useQuery(
    undefined,
    { enabled: !!user }
  );

  const sendMessageMutation = trpc.chat.send.useMutation({
    onSuccess: () => {
      refetchMessages();
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].tag);
    }
  }, [models, selectedModel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (message: string) => {
    if (!selectedModel) {
      toast({
        title: 'Error',
        description: 'Please select a model',
        variant: 'destructive',
      });
      return;
    }

    setIsTyping(true);
    await sendMessageMutation.mutateAsync({
      modelTag: selectedModel,
      prompt: message,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully',
    });
  };

  if (!user || modelsLoading) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black transition-colors">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-black dark:text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight hidden sm:block">
                   Chat
                </h1>
              </div>
              <div className="flex-1 max-w-xs">
                <ModelSelector
                  models={models}
                  value={selectedModel}
                  onChange={setSelectedModel}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-black" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <LogOut className="h-5 w-5 text-black dark:text-white" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-white dark:text-black" />
                </div>
                <h2 className="text-3xl font-bold text-black dark:text-white">
                  Start a conversation
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Select a model and send a message to begin chatting with AI
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.created_at}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={scrollRef} />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80 sticky bottom-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping || !selectedModel}
          />
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Abuzar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
