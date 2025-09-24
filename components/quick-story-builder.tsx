"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Clock, ArrowRight } from "lucide-react";

interface QuickStoryBuilderProps {
  onGenerate: (data: any) => void;
  isGenerating?: boolean;
}

const QUICK_GENRES = [
  { id: 'adventure', name: 'Adventure', icon: '🏔️', desc: 'Exciting journeys and quests' },
  { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♀️', desc: 'Magic and mythical creatures' },
  { id: 'mystery', name: 'Mystery', icon: '🔍', desc: 'Puzzles and detective stories' },
  { id: 'romance', name: 'Romance', icon: '💕', desc: 'Love and relationships' },
  { id: 'scifi', name: 'Sci-Fi', icon: '🚀', desc: 'Future technology and space' },
  { id: 'kids', name: 'Kids', icon: '🧸', desc: 'Fun stories for children' }
];

const QUICK_CHARACTERS = [
  { id: 'alex', name: 'Alex the Adventurer', avatar: 'A', color: 'from-blue-400 to-purple-500' },
  { id: 'maya', name: 'Maya the Magician', avatar: 'M', color: 'from-pink-400 to-rose-500' },
  { id: 'rex', name: 'Rex the Robot', avatar: 'R', color: 'from-green-400 to-emerald-500' },
  { id: 'luna', name: 'Luna the Explorer', avatar: 'L', color: 'from-indigo-400 to-cyan-500' }
];

export function QuickStoryBuilder({ onGenerate, isGenerating = false }: QuickStoryBuilderProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [storyIdea, setStoryIdea] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  const handleQuickGenerate = () => {
    if (!selectedGenre || !storyIdea.trim()) return;

    const quickData = {
      genre: selectedGenre,
      idea: storyIdea.trim(),
      character: selectedCharacter || null,
      mode: 'quick'
    };

    onGenerate(quickData);
  };

  const isFormValid = selectedGenre && storyIdea.trim().length > 10;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Quick Story Builder</h2>
            <p className="text-muted-foreground">Create amazing stories in just 2 simple steps</p>
          </div>
        </div>
      </div>

      {/* Step 1: Choose Genre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            Choose Your Genre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_GENRES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                  selectedGenre === genre.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-2">{genre.icon}</div>
                <div className="font-medium text-sm">{genre.name}</div>
                <div className="text-xs text-muted-foreground">{genre.desc}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Story Idea */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            What's Your Story Idea?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="story-idea">Story Concept (minimum 10 characters)</Label>
            <Textarea
              id="story-idea"
              placeholder="A brave knight discovers a hidden treasure in an ancient forest..."
              value={storyIdea}
              onChange={(e) => setStoryIdea(e.target.value)}
              className="min-h-[100px] mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {storyIdea.length}/10 characters minimum
            </div>
          </div>

          {/* Optional Character Selection */}
          <div>
            <Label className="text-sm text-muted-foreground">Optional: Choose a Character</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {QUICK_CHARACTERS.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character.id === selectedCharacter ? '' : character.id)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                    selectedCharacter === character.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${character.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm`}>
                    {character.avatar}
                  </div>
                  <div className="text-xs font-medium">{character.name}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={handleQuickGenerate}
          disabled={!isFormValid || isGenerating}
          size="lg"
          className="px-8 py-4 text-lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Creating Your Story...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Story Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {isFormValid && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Estimated time: 30 seconds</span>
          </div>
        )}
      </div>
    </div>
  );
}