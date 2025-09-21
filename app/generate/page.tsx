"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Clock,
  Wand2,
  BookOpen,
  Loader2,
  ChevronRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import { StoryDisplay } from "@/components/story-display";
import { EnhancedTemplateSelector } from "@/components/enhanced-template-selector";
import { StoryPromptBuilder } from "@/components/story-prompt-builder";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { buildFullPrompt } from "@/lib/ai-prompts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Helper function to generate title based on template and prompt
const generateTitle = (
  template: { category: string; type: string },
  userPrompt: string
) => {
  const words = userPrompt.split(" ").slice(0, 4).join(" ");
  const templateType =
    template.type.charAt(0).toUpperCase() + template.type.slice(1);
  return words ? `${words}` : `My ${templateType} Story`;
};

const generationSteps = [
  {
    id: 1,
    title: "Choose Genre",
    icon: BookOpen,
    description: "Select your story type",
  },
  {
    id: 2,
    title: "Build Your Story",
    icon: Wand2,
    description: "Add details and characters",
  },
  {
    id: 3,
    title: "Story Settings",
    icon: Clock,
    description: "Length and style preferences",
  },
  {
    id: 4,
    title: "Generate",
    icon: Sparkles,
    description: "Create your masterpiece",
  },
];

export default function EnhancedGeneratePage() {
  const supabase = createClientComponentClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("");
  // Template and prompt data
  const [selectedTemplate, setSelectedTemplate] = useState<{
    category: any;
    type: string;
  } | null>(null);

  const [promptData, setPromptData] = useState<any>(null);
  const [refinedPrompt, setRefinedPrompt] = useState<string>("");

  // Story generation settings
  const [storyLength, setStoryLength] = useState<string>("medium");
  const [writingStyle, setWritingStyle] = useState<string>("balanced");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);

  const handleTemplateSelect = () => {
    setSelectedTemplate({
      category: expandedCategory?.toString(),
      type: selectedType,
    });
  };

  const handlePromptGenerated = (data: any, prompt: string) => {
    setPromptData(data);
    setRefinedPrompt(prompt);
    setCurrentStep(3);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !refinedPrompt) return;

    const fullPrompt = buildFullPrompt({
      selectedTemplate,
      storyLength,
      userPrompt: refinedPrompt,
    });

    setCurrentStep(4);
    setIsGenerating(true);
    setGeneratedStory({
      content: "",
      title: "",
      template: selectedTemplate.type,
      createdAt: new Date().toISOString(),
    });

    try {
      const resp = await fetch("/api/v1/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullPrompt, mode: "stream" }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`Failed to generate story: ${resp.statusText}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullStory = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              const clean = parsed.response;

              if (clean) {
                fullStory += clean;
                setGeneratedStory((prev: any) => ({
                  ...prev,
                  content: (prev?.content || "") + clean,
                  title:
                    prev?.title ||
                    generateTitle(selectedTemplate, promptData?.mainIdea || ""),
                }));
              }
            }
          } catch (err) {
            console.warn("Non-JSON chunk:", line);
          }
        }
      }

      setIsGenerating(false);

      if (fullStory?.trim().length > 0) {
        try {
          await fetch("/api/v1/story/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              story: fullStory,
              prompt: refinedPrompt,
              storyLength,
              selectedTemplate,
              title: generateTitle(
                selectedTemplate,
                promptData?.mainIdea || ""
              ),
            }),
          });
        } catch (err) {
          console.error("Failed to save story:", err);
        }
      }
    } catch (error) {
      console.error("Story generation failed:", error);
      setIsGenerating(false);
      setGeneratedStory({
        content:
          "Sorry, we encountered an issue generating your story. Please try again.",
        title: "Generation Error",
        template: selectedTemplate.type,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedTemplate(null);
    setPromptData(null);
    setRefinedPrompt("");
    setGeneratedStory(null);
    setStoryLength("medium");
    setWritingStyle("balanced");
  };

  // Show story display if generation is complete or in progress
  if (generatedStory) {
    return (
      <StoryDisplay
        story={generatedStory}
        onReset={handleReset}
        isGenerating={isGenerating}
      />
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-12">
            {/* Step Header */}

            <EnhancedTemplateSelector
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              expandedCategory={expandedCategory}
              setExpandedCategory={setExpandedCategory}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          </div>
        );

      case 2:
        return (
          <StoryPromptBuilder
            selectedTemplate={selectedTemplate}
            onPromptGenerated={handlePromptGenerated}
          />
        );

      case 3:
        return (
          <div className="space-y-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl">
                ⚙️
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Perfect Your Story
                </span>
              </h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                Fine-tune the length and writing style to create exactly the
                story you envision
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Story Length */}
              <Card className="border border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Story Length</h3>
                        <p className="text-sm text-foreground/60">
                          How long should your story be?
                        </p>
                      </div>
                    </div>

                    <Select value={storyLength} onValueChange={setStoryLength}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose story length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">Quick Tale</span>
                            <span className="text-xs text-muted-foreground">
                              1-2 min read • Perfect for a quick story break
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">Classic Story</span>
                            <span className="text-xs text-muted-foreground">
                              3-5 min read • Well-developed narrative
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="long">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">Epic Adventure</span>
                            <span className="text-xs text-muted-foreground">
                              6-10 min read • Rich, detailed storytelling
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Writing Style */}
              <Card className="border border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Writing Style</h3>
                        <p className="text-sm text-foreground/60">
                          What tone should we use?
                        </p>
                      </div>
                    </div>

                    <Select
                      value={writingStyle}
                      onValueChange={setWritingStyle}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose writing style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">Simple & Clear</span>
                            <span className="text-xs text-muted-foreground">
                              Easy to read, straightforward language
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="balanced">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">Balanced</span>
                            <span className="text-xs text-muted-foreground">
                              Mix of simple and descriptive language
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="descriptive">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">
                              Rich & Descriptive
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Detailed descriptions and vivid imagery
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="poetic">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">
                              Poetic & Lyrical
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Beautiful, flowing prose with metaphors
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Story Summary */}
            <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2 border-primary/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Story Summary</h3>
                    <p className="text-sm text-foreground/60">
                      Review your story details
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedTemplate?.category}
                    </Badge>
                    <Badge variant="outline">{selectedTemplate?.type}</Badge>
                  </div>

                  <p className="text-muted-foreground">
                    <strong>Main Idea:</strong>{" "}
                    {promptData?.mainIdea?.substring(0, 150)}
                    {promptData?.mainIdea?.length > 150 && "..."}
                  </p>

                  {promptData?.characters &&
                    promptData.characters.length > 0 && (
                      <p className="text-muted-foreground">
                        <strong>Characters:</strong>{" "}
                        {promptData.characters.join(", ")}
                      </p>
                    )}

                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <strong>Length:</strong> {storyLength}
                    </span>
                    <span>
                      <strong>Style:</strong> {writingStyle}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                size="lg"
                className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Story Builder
              </Button>

              <Button
                onClick={handleGenerate}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My Story
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-12 max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="space-y-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center text-6xl mx-auto mb-8 shadow-2xl animate-pulse">
                  ✨
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-ping" />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Crafting Your Story
                  </span>
                </h2>
                <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                  Our advanced AI is weaving your ideas into a captivating
                  narrative. This magical process typically takes 30-60 seconds.
                </p>
              </div>
            </div>

            {/* Generation Progress */}
            <Card className="border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
              <CardContent className="p-10">
                <div className="space-y-8">
                  {/* Animated Loader */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                      <div className="absolute inset-0 w-12 h-12 border-2 border-primary/20 rounded-full animate-ping" />
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-primary">
                          Analyzing Your Concept
                        </span>
                        <div className="text-sm text-foreground/60 mt-1">
                          Understanding themes, characters, and setting
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                      <div className="w-3 h-3 bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse [animation-delay:0.5s]" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-secondary">
                          Building Story Structure
                        </span>
                        <div className="text-sm text-foreground/60 mt-1">
                          Creating compelling plot and narrative flow
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-2xl border border-accent/10">
                      <div className="w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse [animation-delay:1s]" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-accent">
                          Polishing the Magic
                        </span>
                        <div className="text-sm text-foreground/60 mt-1">
                          Adding final touches and emotional depth
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-primary">Progress</span>
                      <span className="text-foreground/70">
                        Creating masterpiece...
                      </span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse transition-all duration-1000"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fun Fact */}
            <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
              <p className="text-sm text-foreground/70">
                💡 <strong>Did you know?</strong> Our AI considers over 1000
                storytelling elements to craft your unique narrative!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const completedCount = Math.max(
    0,
    Math.min(generationSteps.length, currentStep - 1)
  );
  const horizontalFillPercent =
    generationSteps.length > 1
      ? (completedCount / (generationSteps.length - 1)) * 100
      : 0;

  return (
    <div className="min-h- bg-gradient-to-br from-background/95 via-primary/80 to-secondary/80">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Left side: back + brand */}
          <div className="flex items-center gap-5">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="group bg-background/70 text-foreground transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                ✨
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Story Birds
              </h1>
            </div>
          </div>

          {/* Right side: step + theme */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Step {currentStep} of {generationSteps.length}
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="container mx-auto px-6 py-12 flex gap-8">
        {/* Sticky Vertical Progress */}
        {currentStep <= 3 && (
          <aside className="hidden lg:block w-64 sticky top-28 self-start">
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-muted" />
              <div
                className="absolute left-7 top-0 w-0.5 bg-gradient-to-b from-primary to-secondary transition-all duration-700 ease-out"
                style={{
                  height: `${
                    ((currentStep - 1) / (generationSteps.length - 1)) * 100
                  }%`,
                }}
              />

              {/* Steps */}
              <nav aria-label="Generation steps">
                <div className="flex flex-col gap-10 relative">
                  {generationSteps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const Icon = step.icon;

                    return (
                      <button
                        key={step.id}
                        type="button"
                        aria-current={isActive ? "step" : undefined}
                        className="flex items-start gap-4 text-left focus:outline-none"
                      >
                        {/* Step Node */}
                        <div
                          className={`relative flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 transition-transform duration-300 ${
                            isActive ? "scale-105" : ""
                          }`}
                        >
                          <div
                            className={`absolute inset-0 rounded-2xl backdrop-blur-sm border border-white/8 ${
                              isActive
                                ? "bg-gradient-to-br from-primary/80 to-secondary/80 shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
                                : isCompleted
                                ? "bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30"
                                : "bg-white/4"
                            }`}
                          />
                          <div className="relative z-10">
                            {isCompleted ? (
                              <Check className="w-6 h-6 text-white" />
                            ) : (
                              <Icon
                                className={`w-6 h-6 ${
                                  isActive
                                    ? "text-white"
                                    : "text-muted-foreground"
                                }`}
                              />
                            )}
                          </div>
                          {isActive && (
                            <span
                              className="absolute -inset-1 rounded-2xl blur-2xl opacity-40"
                              style={{ background: "rgba(99,102,241,0.15)" }}
                            />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-semibold transition-colors ${
                              isActive
                                ? "text-primary"
                                : isCompleted
                                ? "text-primary/90"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {step.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </aside>
        )}

        {/* Step Content */}
        <main className="flex-1">
          <div className=" -6">{renderStepContent()}</div>
        </main>
      </div>

      {/* Bottom fixed button for step 1 */}
      {currentStep === 1 && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-background/30 backdrop-blur-lg border-t border-border/50">
          <div className="container mx-auto px-6 py-4 flex justify-end">
            <Button
              onClick={() => {
                handleTemplateSelect();
                setCurrentStep(2);
              }}
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
