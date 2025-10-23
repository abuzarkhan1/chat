'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles } from 'lucide-react';

interface Model {
  id: string;
  tag: string;
  name: string;
  description: string | null;
}

interface ModelSelectorProps {
  models: Model[];
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  const selectedModel = models.find((m) => m.tag === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[240px] h-12 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white dark:text-black" />
          </div>
          <SelectValue placeholder="Select model" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl">
        {models.map((model) => (
          <SelectItem
            key={model.id}
            value={model.tag}
            className="text-black dark:text-white focus:bg-gray-50 dark:focus:bg-gray-900 rounded-lg my-1 mx-1"
          >
            <div className="flex flex-col py-1">
              <span className="font-semibold text-base">{model.name}</span>
              {model.description && (
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {model.description}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}