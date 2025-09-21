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
  ChevronRight,
  ArrowRight,
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
  onPromptGenerated: (
    promptData: PromptBuilderData,
    refinedPrompt: string
  ) => void;
  selectedTemplate: any;
}

const toneOptions = [
  {
    id: "uplifting",
    label: "Uplifting & Hopeful",
    icon: "🌟",
    description: "Positive and inspiring",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "mysterious",
    label: "Mysterious",
    icon: "🔮",
    description: "Intriguing and enigmatic",
    color: "from-purple-600 to-indigo-700",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    icon: "⚡",
    description: "Exciting and bold",
    color: "from-red-500 to-pink-600",
  },
  {
    id: "heartwarming",
    label: "Heartwarming",
    icon: "💖",
    description: "Touching and emotional",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: "humorous",
    label: "Humorous",
    icon: "😄",
    description: "Funny and lighthearted",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "dramatic",
    label: "Dramatic",
    icon: "🎭",
    description: "Intense and emotional",
    color: "from-gray-600 to-slate-700",
  },
  {
    id: "peaceful",
    label: "Peaceful",
    icon: "🕊️",
    description: "Calm and serene",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "suspenseful",
    label: "Suspenseful",
    icon: "🔥",
    description: "Thrilling and tense",
    color: "from-orange-600 to-red-700",
  },
  {
    id: "romantic",
    label: "Romantic",
    icon: "💕",
    description: "Love and relationships",
    color: "from-pink-500 to-red-500",
  },
  {
    id: "nostalgic",
    label: "Nostalgic",
    icon: "🌅",
    description: "Warm memories",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "dark",
    label: "Dark & Brooding",
    icon: "🌙",
    description: "Gothic and moody",
    color: "from-gray-800 to-black",
  },
  {
    id: "whimsical",
    label: "Whimsical",
    icon: "🦋",
    description: "Playful and magical",
    color: "from-purple-400 to-pink-500",
  },
];

const themeOptions = [
  {
    id: "friendship",
    label: "Friendship",
    icon: "🤝",
    description: "Bonds that unite us",
  },
  { id: "courage", label: "Courage", icon: "🦁", description: "Facing fears" },
  { id: "love", label: "Love", icon: "❤️", description: "All forms of love" },
  {
    id: "growth",
    label: "Personal Growth",
    icon: "🌱",
    description: "Self-improvement",
  },
  {
    id: "adventure",
    label: "Adventure",
    icon: "🗺️",
    description: "Exciting journeys",
  },
  {
    id: "family",
    label: "Family Bonds",
    icon: "👨‍👩‍👧‍👦",
    description: "Family connections",
  },
  {
    id: "discovery",
    label: "Discovery",
    icon: "🔍",
    description: "Finding the unknown",
  },
  {
    id: "magic",
    label: "Magic",
    icon: "✨",
    description: "Wonder and mystique",
  },
  {
    id: "nature",
    label: "Nature",
    icon: "🌲",
    description: "Environmental harmony",
  },
  {
    id: "dreams",
    label: "Dreams & Aspirations",
    icon: "🌙",
    description: "Following dreams",
  },
  {
    id: "redemption",
    label: "Redemption",
    icon: "🌅",
    description: "Second chances",
  },
  {
    id: "sacrifice",
    label: "Sacrifice",
    icon: "⚖️",
    description: "Noble choices",
  },
  {
    id: "identity",
    label: "Identity",
    icon: "🪞",
    description: "Finding yourself",
  },
  {
    id: "justice",
    label: "Justice",
    icon: "⚔️",
    description: "Fighting for right",
  },
  {
    id: "wisdom",
    label: "Wisdom",
    icon: "📚",
    description: "Learning and growth",
  },
];

const specialElementOptions = [
  {
    id: "dialogue-heavy",
    label: "Rich Dialogue",
    description: "Character-driven conversations",
    icon: "💬",
  },
  {
    id: "twist-ending",
    label: "Surprise Ending",
    description: "Unexpected plot twist",
    icon: "🔄",
  },
  {
    id: "moral-lesson",
    label: "Life Lesson",
    description: "Teaching valuable wisdom",
    icon: "🎓",
  },
  {
    id: "multiple-perspectives",
    label: "Multiple Viewpoints",
    description: "Different character perspectives",
    icon: "👁️",
  },
  {
    id: "flashbacks",
    label: "Flashbacks",
    description: "Stories from the past",
    icon: "⏪",
  },
  {
    id: "symbolism",
    label: "Symbolic Elements",
    description: "Deeper metaphorical meaning",
    icon: "🔮",
  },
  {
    id: "cliffhanger",
    label: "Cliffhanger",
    description: "Suspenseful ending",
    icon: "🧗",
  },
  {
    id: "time-jumps",
    label: "Time Jumps",
    description: "Moving between time periods",
    icon: "⏰",
  },
  {
    id: "inner-monologue",
    label: "Inner Thoughts",
    description: "Character's internal dialogue",
    icon: "🧠",
  },
  {
    id: "dream-sequences",
    label: "Dream Sequences",
    description: "Surreal dream-like scenes",
    icon: "💭",
  },
  {
    id: "prophecy",
    label: "Prophecy/Foreshadowing",
    description: "Hints about future events",
    icon: "🔮",
  },
  {
    id: "parallel-stories",
    label: "Parallel Stories",
    description: "Multiple interconnected plots",
    icon: "↔️",
  },
];

export function StoryPromptBuilder({
  onPromptGenerated,
  selectedTemplate,
}: StoryPromptBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [promptData, setPromptData] = useState<PromptBuilderData>({
    mainIdea: "",
    characters: [],
    setting: "",
    timeframe: "",
    goal: "",
    tone: "",
    theme: "",
    specialElements: [],
  });

  const [characterInput, setCharacterInput] = useState("");

  const steps = [
    { title: "Main Story Idea", icon: Lightbulb },
    { title: "Characters", icon: Users },
    { title: "Setting & Time", icon: MapPin },
    { title: "Goal & Conflict", icon: Target },
    { title: "Tone & Theme", icon: Heart },
    { title: "Special Elements", icon: Star },
  ];

  const addCharacter = () => {
    if (characterInput.trim() && promptData.characters.length < 5) {
      setPromptData({
        ...promptData,
        characters: [...promptData.characters, characterInput.trim()],
      });
      setCharacterInput("");
    }
  };

  const removeCharacter = (index: number) => {
    setPromptData({
      ...promptData,
      characters: promptData.characters.filter((_, i) => i !== index),
    });
  };

  const toggleSpecialElement = (elementId: string) => {
    const elements = promptData.specialElements.includes(elementId)
      ? promptData.specialElements.filter((e) => e !== elementId)
      : [...promptData.specialElements, elementId];

    setPromptData({ ...promptData, specialElements: elements });
  };

  const generateRefinedPrompt = () => {
    const templateInfo = selectedTemplate
      ? `This is a ${selectedTemplate.category} story of type: ${selectedTemplate.type}.`
      : "";

    const charactersText =
      promptData.characters.length > 0
        ? `Main characters: ${promptData.characters.join(", ")}.`
        : "";

    const settingText = promptData.setting
      ? `Setting: ${promptData.setting}${
          promptData.timeframe ? ` (${promptData.timeframe})` : ""
        }.`
      : "";

    const goalText = promptData.goal
      ? `Story goal/conflict: ${promptData.goal}.`
      : "";

    const toneText = promptData.tone
      ? `Tone: ${toneOptions.find((t) => t.id === promptData.tone)?.label}.`
      : "";

    const themeText = promptData.theme
      ? `Central theme: ${
          themeOptions.find((t) => t.id === promptData.theme)?.label
        }.`
      : "";

    const elementsText =
      promptData.specialElements.length > 0
        ? `Special elements to include: ${promptData.specialElements
            .map((e) => specialElementOptions.find((se) => se.id === e)?.label)
            .join(", ")}.`
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
      case 0:
        return promptData.mainIdea.trim().length > 10;
      case 1:
        return promptData.characters.length > 0;
      case 2:
        return promptData.setting.trim().length > 0;
      case 3:
        return promptData.goal.trim().length > 0;
      case 4:
        return promptData.tone && promptData.theme;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-6xl mb-4 animate-bounce">💡</div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>
              </div>
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-serif font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  What's Your Story About?
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Describe the core idea that will capture readers' imagination. What's the heart of your story?
                </p>
              </div>
            </div> */}

            <div className="space-y-4 max-w-3xl mx-auto">
              <Label htmlFor="mainIdea" className="text-lg font-medium">
                Main Story Idea
              </Label>
              <div className="relative">
                <Textarea
                  id="mainIdea"
                  placeholder="For example: 'A young girl discovers she can understand what animals are thinking and uses this power to solve a mystery in her neighborhood' or 'Two rival chefs must work together to save their small town's annual food festival from disaster'"
                  value={promptData.mainIdea}
                  onChange={(e) =>
                    setPromptData({ ...promptData, mainIdea: e.target.value })
                  }
                  className="min-h-40 text-lg leading-relaxed border-2 mt-3 bg-white/40 focus:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                />
                {promptData.mainIdea.length > 0 && (
                  <div className="absolute top-3 right-3">
                    <div
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        promptData.mainIdea.length >= 50
                          ? "bg-green-500"
                          : promptData.mainIdea.length >= 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {promptData.mainIdea.length}/500 characters
                </p>
                <div className="flex items-center gap-2">
                  {promptData.mainIdea.length >= 50 && (
                    <Badge
                      variant="secondary"
                      className="animate-in slide-in-from-right duration-300"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Good length
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Smart suggestions */}
            {promptData.mainIdea.length === 0 && (
              <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2 max-w-3xl mx-auto">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Need inspiration? Try these story starters:
                  </h4>
                  <div className="grid gap-2">
                    {[
                      "A mysterious package arrives with no return address, changing everything...",
                      "Two strangers get stuck in an elevator and discover they have more in common than they thought...",
                      "A child finds an old diary that reveals family secrets spanning generations...",
                      "The last bookstore in town is about to close unless someone can save it...",
                      "A young person inherits a magical ability they never knew existed...",
                      "An unexpected friendship forms between the most unlikely pair...",
                      "A small act of kindness creates a ripple effect that changes everything...",
                      "Someone discovers their hometown has been keeping a fascinating secret...",
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setPromptData({ ...promptData, mainIdea: suggestion })
                        }
                        className="text-left p-2 rounded hover:bg-primary/10 transition-colors duration-200 text-sm text-muted-foreground hover:text-foreground"
                      >
                        "{suggestion}"
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {promptData.mainIdea.length > 50 && (
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg mb-2">
                        Excellent foundation!
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Your story idea has great potential. The next step is to
                        create compelling characters who will bring this concept
                        to life and drive the narrative forward.
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
              <h3 className="text-2xl font-bold mb-2">
                Who Are Your Characters?
              </h3>
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
                  onKeyPress={(e) => e.key === "Enter" && addCharacter()}
                />
                <Button
                  onClick={addCharacter}
                  disabled={
                    !characterInput.trim() || promptData.characters.length >= 5
                  }
                >
                  Add
                </Button>
              </div>

              {promptData.characters.length > 0 && (
                <div className="space-y-2">
                  <Label>
                    Your Characters ({promptData.characters.length}/5)
                  </Label>
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
                <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-3">
                        Need character ideas? Try these archetypes:
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        "Brave young hero",
                        "Wise mentor",
                        "Talking animal companion",
                        "Mysterious stranger",
                        "Loyal best friend",
                        "Kind grandmother",
                        "Clever detective",
                        "Magical creature",
                        "Determined child",
                        "Protective parent",
                        "Funny sidekick",
                        "Noble knight",
                      ].map((character, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCharacterInput(character);
                            setTimeout(() => addCharacter(), 100);
                          }}
                          className="text-sm p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-muted-foreground hover:text-foreground border border-dashed border-muted hover:border-primary/50"
                        >
                          {character}
                        </button>
                      ))}
                    </div>
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
              <h3 className="text-2xl font-bold mb-2">
                Where & When Does It Happen?
              </h3>
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
                  onChange={(e) =>
                    setPromptData({ ...promptData, setting: e.target.value })
                  }
                  className="min-h-24"
                />
                {!promptData.setting && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      Popular settings:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Enchanted forest",
                        "Busy city",
                        "Cozy village",
                        "Ancient castle",
                        "Space station",
                        "Desert island",
                        "Mountain peak",
                        "Underwater kingdom",
                      ].map((setting, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setPromptData({ ...promptData, setting })
                          }
                          className="text-xs px-3 py-1 rounded-full bg-muted/50 hover:bg-primary/10 transition-colors duration-200 text-muted-foreground hover:text-foreground border border-muted hover:border-primary/50"
                        >
                          {setting}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Time Period</Label>
                <Input
                  id="timeframe"
                  placeholder="e.g., 'Present day', 'Medieval times', '1920s', 'Far future', 'One summer afternoon'"
                  value={promptData.timeframe}
                  onChange={(e) =>
                    setPromptData({ ...promptData, timeframe: e.target.value })
                  }
                />
                {!promptData.timeframe && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      Time periods:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Present day",
                        "Medieval times",
                        "Victorian era",
                        "Far future",
                        "Ancient times",
                        "Wild West",
                        "1950s",
                        "Stone Age",
                      ].map((time, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setPromptData({ ...promptData, timeframe: time })
                          }
                          className="text-xs px-3 py-1 rounded-full bg-muted/50 hover:bg-primary/10 transition-colors duration-200 text-muted-foreground hover:text-foreground border border-muted hover:border-primary/50"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2">
                What's the Goal or Conflict?
              </h3>
              <p className="text-muted-foreground">
                Every great story has a central challenge, goal, or conflict to
                resolve
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Main Goal or Conflict</Label>
              <Textarea
                id="goal"
                placeholder="What does the main character want to achieve? What obstacle must they overcome? e.g., 'Save the enchanted forest from an evil sorcerer', 'Win the school talent show despite stage fright', 'Find their way home after getting lost'"
                value={promptData.goal}
                onChange={(e) =>
                  setPromptData({ ...promptData, goal: e.target.value })
                }
                className="min-h-32"
              />
              {!promptData.goal && (
                <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Common story goals & conflicts:
                    </h4>
                    <div className="grid gap-2">
                      {[
                        "Save someone or something important",
                        "Discover a hidden truth or mystery",
                        "Overcome a personal fear or weakness",
                        "Win a competition or contest",
                        "Find something that was lost",
                        "Protect home from danger",
                        "Help someone in need",
                        "Learn an important life lesson",
                      ].map((goal, index) => (
                        <button
                          key={index}
                          onClick={() => setPromptData({ ...promptData, goal })}
                          className="text-left p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-sm text-muted-foreground hover:text-foreground border border-dashed border-transparent hover:border-primary/30"
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-6xl mb-4 animate-pulse">🎨</div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              </div>
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-serif font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Set the Mood & Message
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Choose the emotional tone and central theme that will guide
                  your story's direction
                </p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <div className="text-center">
                  <Label className="text-xl font-serif font-medium mb-2 block">
                    Story Tone
                  </Label>
                  <p className="text-muted-foreground">
                    How should your story feel to readers?
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                  {toneOptions.map((tone, index) => (
                    <Card
                      key={tone.id}
                      className={`cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden ${
                        promptData.tone === tone.id
                          ? "ring-2 ring-primary shadow-xl scale-[1.02]"
                          : "hover:shadow-lg"
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                      onClick={() =>
                        setPromptData({ ...promptData, tone: tone.id })
                      }
                    >
                      {/* Gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${tone.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                      />

                      <CardContent className="p-5 text-center relative z-10">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {tone.icon}
                        </div>
                        <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors duration-300">
                          {tone.label}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                          {tone.description}
                        </p>

                        {promptData.tone === tone.id && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 animate-in zoom-in duration-300">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </CardContent>

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <Label className="text-xl font-serif font-medium mb-2 block">
                    Central Theme
                  </Label>
                  <p className="text-muted-foreground">
                    What deeper message or lesson should your story convey?
                  </p>
                </div>

                {/* Popular combinations */}
                {!promptData.tone || !promptData.theme ? (
                  <Card className="bg-gradient-to-br from-muted/20 to-muted/10 border-dashed border-2 max-w-4xl mx-auto">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 text-center flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Popular combinations that work great together:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          {
                            tone: "heartwarming",
                            theme: "friendship",
                            label: "Heartwarming + Friendship",
                          },
                          {
                            tone: "adventurous",
                            theme: "courage",
                            label: "Adventurous + Courage",
                          },
                          {
                            tone: "mysterious",
                            theme: "discovery",
                            label: "Mysterious + Discovery",
                          },
                          {
                            tone: "uplifting",
                            theme: "growth",
                            label: "Uplifting + Personal Growth",
                          },
                          {
                            tone: "whimsical",
                            theme: "magic",
                            label: "Whimsical + Magic",
                          },
                          {
                            tone: "peaceful",
                            theme: "nature",
                            label: "Peaceful + Nature",
                          },
                        ].map((combo, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setPromptData({
                                ...promptData,
                                tone: combo.tone,
                                theme: combo.theme,
                              })
                            }
                            className="text-sm p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-muted-foreground hover:text-foreground border border-dashed border-muted hover:border-primary/50 flex items-center gap-2"
                          >
                            <div className="flex items-center gap-1">
                              {
                                toneOptions.find((t) => t.id === combo.tone)
                                  ?.icon
                              }
                              {
                                themeOptions.find((t) => t.id === combo.theme)
                                  ?.icon
                              }
                            </div>
                            {combo.label}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                  {themeOptions.map((theme, index) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-md group ${
                        promptData.theme === theme.id
                          ? "ring-2 ring-primary bg-primary/5 shadow-md scale-[1.05]"
                          : ""
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                      onClick={() =>
                        setPromptData({ ...promptData, theme: theme.id })
                      }
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                          {theme.icon}
                        </div>
                        <h4 className="font-medium text-xs mb-1 group-hover:text-primary transition-colors duration-200">
                          {theme.label}
                        </h4>
                        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {theme.description}
                        </p>

                        {promptData.theme === theme.id && (
                          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 animate-bounce">
                            <Heart className="w-2 h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected combination preview */}
            {promptData.tone && promptData.theme && (
              <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-500">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <Badge className="bg-primary/20 text-primary px-4 py-2">
                        {
                          toneOptions.find((t) => t.id === promptData.tone)
                            ?.label
                        }
                      </Badge>
                      <span className="text-muted-foreground">+</span>
                      <Badge className="bg-secondary/20 text-secondary px-4 py-2">
                        {
                          themeOptions.find((t) => t.id === promptData.theme)
                            ?.label
                        }
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Perfect combination! Your story will have a{" "}
                      <strong>
                        {toneOptions
                          .find((t) => t.id === promptData.tone)
                          ?.label.toLowerCase()}
                      </strong>{" "}
                      tone while exploring the theme of{" "}
                      <strong>
                        {themeOptions
                          .find((t) => t.id === promptData.theme)
                          ?.label.toLowerCase()}
                      </strong>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-6xl mb-4 animate-spin-slow">✨</div>
                <div className="absolute inset-0 animate-ping opacity-20">
                  ✨
                </div>
              </div>
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-serif font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Add Special Elements
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Choose advanced storytelling techniques to make your story
                  truly unique
                  <span className="text-xs opacity-70 block mt-1">
                    (Optional but recommended)
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {specialElementOptions.map((element, index) => {
                const isSelected = promptData.specialElements.includes(
                  element.id
                );
                return (
                  <Card
                    key={element.id}
                    className={`cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-lg group relative overflow-hidden ${
                      isSelected
                        ? "ring-2 ring-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg scale-[1.02]"
                        : "hover:bg-gradient-to-br hover:from-muted/10 hover:to-muted/5"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                    onClick={() => toggleSpecialElement(element.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Enhanced checkbox */}
                        <div className="relative">
                          <div
                            className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                              isSelected
                                ? "bg-primary border-primary shadow-md"
                                : "border-muted-foreground/40 group-hover:border-primary/60"
                            }`}
                          >
                            {isSelected && (
                              <Sparkles className="w-4 h-4 text-primary-foreground animate-in zoom-in duration-200" />
                            )}
                          </div>
                          {/* Ripple effect */}
                          {isSelected && (
                            <div className="absolute inset-0 rounded-lg bg-primary/20 animate-ping"></div>
                          )}
                        </div>

                        <div className="flex-1">
                          {/* Icon and title */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-xl group-hover:scale-110 transition-transform duration-300">
                              {element.icon}
                            </div>
                            <h4
                              className={`font-semibold text-base transition-colors duration-300 ${
                                isSelected
                                  ? "text-primary"
                                  : "group-hover:text-primary"
                              }`}
                            >
                              {element.label}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                            {element.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1 animate-bounce">
                        <Star className="w-3 h-3" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Selected elements summary */}
            {promptData.specialElements.length > 0 && (
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Selected Special Elements (
                      {promptData.specialElements.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {promptData.specialElements.map((elementId) => {
                        const element = specialElementOptions.find(
                          (e) => e.id === elementId
                        );
                        return (
                          <Badge
                            key={elementId}
                            variant="secondary"
                            className="bg-primary/10 text-primary px-3 py-1 flex items-center gap-1"
                          >
                            {element?.icon} {element?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Final generation call-to-action */}
            <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30 shadow-2xl max-w-3xl mx-auto animate-in slide-in-from-bottom duration-700">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                    <div className="absolute inset-0 animate-ping opacity-20">
                      <Sparkles className="w-12 h-12 text-primary mx-auto" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-2xl mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Ready to Create Your Masterpiece!
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
                      Your story blueprint is complete. Click below to generate
                      a personalized story that incorporates all the elements
                      you've carefully chosen.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button
                      size="lg"
                      onClick={generateRefinedPrompt}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Zap className="w-6 h-6 mr-3 animate-pulse" />
                      Generate My Story
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      This will create a unique story tailored to your
                      specifications
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Progress Bar */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Story Builder
          </h2>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              ✨ Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:inline">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}

      {renderStep()}

      {/* Navigation */}

      {currentStep < 5 && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-background/30 backdrop-blur-lg border-t border-border/50">
          <div className="container mx-auto px-6 py-4 flex justify-between">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              disabled={!canProceedToNext()}
              size="lg"
              className="w-full !rounded-xs sm:w-auto bg-gradient-to-r from-primary to-secondary 
                  hover:from-primary/90 hover:to-secondary/90 
                  text-white shadow-xl hover:shadow-2xl hover:scale-105 
                  transition-all duration-200 px-8 py-4"
            >
              Continue to Story Builder
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
