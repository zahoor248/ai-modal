"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Users, 
  MapPin, 
  Clock, 
  Target,
  Lightbulb,
  Zap,
  Heart,
  Star,
  ChevronRight
} from "lucide-react";

interface PromptBuilderData {
  mainIdea: string;
  characters: string[];
  setting: string;
  timeframe: string;
  goal: string;
  tone: string;
  theme: string;
  specialElements: string[];
}

interface StoryPromptBuilderProps {
  onPromptGenerated: (promptData: PromptBuilderData, refinedPrompt: string) => void;
  selectedTemplate: any;
}

const toneOptions = [
  { id: "uplifting", label: "Uplifting & Hopeful", icon: "🌟", description: "Positive and inspiring" },
  { id: "mysterious", label: "Mysterious", icon: "🔮", description: "Intriguing and enigmatic" },
  { id: "adventurous", label: "Adventurous", icon: "⚡", description: "Exciting and bold" },
  { id: "heartwarming", label: "Heartwarming", icon: "💖", description: "Touching and emotional" },
  { id: "humorous", label: "Humorous", icon: "😄", description: "Funny and lighthearted" },
  { id: "dramatic", label: "Dramatic", icon: "🎭", description: "Intense and emotional" },
  { id: "peaceful", label: "Peaceful", icon: "🕊️", description: "Calm and serene" },
  { id: "suspenseful", label: "Suspenseful", icon: "⚡", description: "Thrilling and tense" }
];

const themeOptions = [
  { id: "friendship", label: "Friendship", icon: "🤝" },
  { id: "courage", label: "Courage", icon: "🦁" },
  { id: "love", label: "Love", icon: "❤️" },
  { id: "growth", label: "Personal Growth", icon: "🌱" },
  { id: "adventure", label: "Adventure", icon: "🗺️" },
  { id: "family", label: "Family Bonds", icon: "👨‍👩‍👧‍👦" },
  { id: "discovery", label: "Discovery", icon: "🔍" },
  { id: "magic", label: "Magic", icon: "✨" },
  { id: "nature", label: "Nature", icon: "🌲" },
  { id: "dreams", label: "Dreams & Aspirations", icon: "🌙" }
];

const specialElementOptions = [
  { id: "dialogue-heavy", label: "Rich Dialogue", description: "Lots of character conversations" },
  { id: "twist-ending", label: "Surprise Ending", description: "Unexpected plot twist" },
  { id: "moral-lesson", label: "Life Lesson", description: "Teaching valuable wisdom" },
  { id: "multiple-perspectives", label: "Multiple Viewpoints", description: "Different character perspectives" },
  { id: "flashbacks", label: "Flashbacks", description: "Stories from the past" },
  { id: "symbolism", label: "Symbolic Elements", description: "Deeper metaphorical meaning" },
  { id: "cliffhanger", label: "Cliffhanger", description: "Suspenseful ending" },
  { id: "time-jumps", label: "Time Jumps", description: "Moving between time periods" }
];

export function StoryPromptBuilder({ onPromptGenerated, selectedTemplate }: StoryPromptBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [promptData, setPromptData] = useState<PromptBuilderData>({
    mainIdea: "",
    characters: [],
    setting: "",
    timeframe: "",
    goal: "",
    tone: "",
    theme: "",
    specialElements: []
  });

  const [characterInput, setCharacterInput] = useState("");

  const steps = [
    { title: "Main Story Idea", icon: Lightbulb },
    { title: "Characters", icon: Users },
    { title: "Setting & Time", icon: MapPin },
    { title: "Goal & Conflict", icon: Target },
    { title: "Tone & Theme", icon: Heart },
    { title: "Special Elements", icon: Star }
  ];

  const addCharacter = () => {
    if (characterInput.trim() && promptData.characters.length < 5) {
      setPromptData({
        ...promptData,
        characters: [...promptData.characters, characterInput.trim()]
      });
      setCharacterInput("");
    }
  };

  const removeCharacter = (index: number) => {
    setPromptData({
      ...promptData,
      characters: promptData.characters.filter((_, i) => i !== index)
    });
  };

  const toggleSpecialElement = (elementId: string) => {
    const elements = promptData.specialElements.includes(elementId)
      ? promptData.specialElements.filter(e => e !== elementId)
      : [...promptData.specialElements, elementId];
    
    setPromptData({ ...promptData, specialElements: elements });
  };

  const generateRefinedPrompt = () => {
    const templateInfo = selectedTemplate ? 
      `This is a ${selectedTemplate.category} story of type: ${selectedTemplate.type}.` : "";
    
    const charactersText = promptData.characters.length > 0 
      ? `Main characters: ${promptData.characters.join(", ")}.` 
      : "";
    
    const settingText = promptData.setting 
      ? `Setting: ${promptData.setting}${promptData.timeframe ? ` (${promptData.timeframe})` : ""}.` 
      : "";
    
    const goalText = promptData.goal 
      ? `Story goal/conflict: ${promptData.goal}.` 
      : "";
    
    const toneText = promptData.tone 
      ? `Tone: ${toneOptions.find(t => t.id === promptData.tone)?.label}.` 
      : "";
    
    const themeText = promptData.theme 
      ? `Central theme: ${themeOptions.find(t => t.id === promptData.theme)?.label}.` 
      : "";
    
    const elementsText = promptData.specialElements.length > 0 
      ? `Special elements to include: ${promptData.specialElements.map(e => 
          specialElementOptions.find(se => se.id === e)?.label
        ).join(", ")}.` 
      : "";

    const refinedPrompt = `
${templateInfo}
${promptData.mainIdea}

${charactersText}
${settingText}
${goalText}
${toneText}
${themeText}
${elementsText}

Please create an engaging and well-structured story that incorporates all these elements naturally.
    `.trim();

    onPromptGenerated(promptData, refinedPrompt);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: return promptData.mainIdea.trim().length > 10;
      case 1: return promptData.characters.length > 0;
      case 2: return promptData.setting.trim().length > 0;
      case 3: return promptData.goal.trim().length > 0;
      case 4: return promptData.tone && promptData.theme;
      case 5: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-2">What's Your Story About?</h3>
              <p className="text-muted-foreground">
                Describe the core idea or concept for your story. What happens? What's the main situation?
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mainIdea">Main Story Idea</Label>
              <Textarea
                id="mainIdea"
                placeholder="For example: 'A young girl discovers she can understand what animals are thinking and uses this power to solve a mystery in her neighborhood' or 'Two rival chefs must work together to save their small town's annual food festival from disaster'"
                value={promptData.mainIdea}
                onChange={(e) => setPromptData({ ...promptData, mainIdea: e.target.value })}
                className="min-h-32 text-lg"
              />
              <p className="text-sm text-muted-foreground">
                {promptData.mainIdea.length}/500 characters • Be creative and descriptive!
              </p>
            </div>

            {promptData.mainIdea.length > 50 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-sm mb-1">Great start!</p>
                      <p className="text-sm text-muted-foreground">
                        Your idea is taking shape. Let's add some characters to bring it to life!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-2">Who Are Your Characters?</h3>
              <p className="text-muted-foreground">
                Add the main characters who will drive your story forward
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter character name or description (e.g., 'brave princess Luna' or 'wise old owl')"
                  value={characterInput}
                  onChange={(e) => setCharacterInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCharacter()}
                />
                <Button onClick={addCharacter} disabled={!characterInput.trim() || promptData.characters.length >= 5}>
                  Add
                </Button>
              </div>

              {promptData.characters.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Characters ({promptData.characters.length}/5)</Label>
                  <div className="flex flex-wrap gap-2">
                    {promptData.characters.map((character, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-sm py-1 px-3 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeCharacter(index)}
                      >
                        {character} ✕
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {promptData.characters.length === 0 && (
                <Card className="bg-muted/20 border-dashed border-2">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Add your first character to continue</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold mb-2">Where & When Does It Happen?</h3>
              <p className="text-muted-foreground">
                Set the scene for your story with location and time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="setting">Setting/Location</Label>
                <Textarea
                  id="setting"
                  placeholder="e.g., 'A magical forest filled with talking trees', 'Modern-day Tokyo', 'A small coastal town in Maine', 'An ancient castle on a mountaintop'"
                  value={promptData.setting}
                  onChange={(e) => setPromptData({ ...promptData, setting: e.target.value })}
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Time Period</Label>
                <Input
                  id="timeframe"
                  placeholder="e.g., 'Present day', 'Medieval times', '1920s', 'Far future', 'One summer afternoon'"
                  value={promptData.timeframe}
                  onChange={(e) => setPromptData({ ...promptData, timeframe: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2">What's the Goal or Conflict?</h3>
              <p className="text-muted-foreground">
                Every great story has a central challenge, goal, or conflict to resolve
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Main Goal or Conflict</Label>
              <Textarea
                id="goal"
                placeholder="What does the main character want to achieve? What obstacle must they overcome? e.g., 'Save the enchanted forest from an evil sorcerer', 'Win the school talent show despite stage fright', 'Find their way home after getting lost'"
                value={promptData.goal}
                onChange={(e) => setPromptData({ ...promptData, goal: e.target.value })}
                className="min-h-32"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2">Set the Mood & Message</h3>
              <p className="text-muted-foreground">
                Choose the tone and central theme for your story
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-medium mb-4 block">Story Tone</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {toneOptions.map((tone) => (
                    <Card
                      key={tone.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        promptData.tone === tone.id ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setPromptData({ ...promptData, tone: tone.id })}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{tone.icon}</div>
                        <h4 className="font-medium text-sm mb-1">{tone.label}</h4>
                        <p className="text-xs text-muted-foreground">{tone.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg font-medium mb-4 block">Central Theme</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {themeOptions.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        promptData.theme === theme.id ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setPromptData({ ...promptData, theme: theme.id })}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="text-xl mb-1">{theme.icon}</div>
                        <h4 className="font-medium text-xs">{theme.label}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">Add Special Elements (Optional)</h3>
              <p className="text-muted-foreground">
                Choose any special storytelling techniques you'd like to include
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialElementOptions.map((element) => (
                <Card
                  key={element.id}
                  className={`cursor-pointer transition-all hover:scale-102 ${
                    promptData.specialElements.includes(element.id) 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : ""
                  }`}
                  onClick={() => toggleSpecialElement(element.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded border-2 mt-1 ${
                        promptData.specialElements.includes(element.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}>
                        {promptData.specialElements.includes(element.id) && (
                          <div className="w-2 h-2 bg-white rounded-sm m-0.5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{element.label}</h4>
                        <p className="text-xs text-muted-foreground">{element.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">Ready to Create Your Story!</h3>
                  <p className="text-muted-foreground mb-4">
                    Click below to generate your personalized story with all the elements you've chosen.
                  </p>
                  <Button size="lg" onClick={generateRefinedPrompt} className="bg-primary hover:bg-primary/90">
                    <Zap className="w-5 h-5 mr-2" />
                    Generate My Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold">Story Builder</h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : isCompleted 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            disabled={!canProceedToNext()}
          >
            Next Step
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}