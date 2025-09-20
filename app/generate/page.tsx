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
  Check
} from "lucide-react";
import Link from "next/link";
import { StoryDisplay } from "@/components/story-display";
import { EnhancedTemplateSelector } from "@/components/enhanced-template-selector";
import { StoryPromptBuilder } from "@/components/story-prompt-builder";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { buildFullPrompt } from "@/lib/ai-prompts";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Helper function to generate title based on template and prompt
const generateTitle = (template: { category: string; type: string }, userPrompt: string) => {
  const words = userPrompt.split(' ').slice(0, 4).join(' ');
  const templateType = template.type.charAt(0).toUpperCase() + template.type.slice(1);
  return words ? `${words}` : `My ${templateType} Story`;
};

const generationSteps = [
  { id: 1, title: "Choose Genre", icon: BookOpen, description: "Select your story type" },
  { id: 2, title: "Build Your Story", icon: Wand2, description: "Add details and characters" },
  { id: 3, title: "Story Settings", icon: Clock, description: "Length and style preferences" },
  { id: 4, title: "Generate", icon: Sparkles, description: "Create your masterpiece" }
];

export default function EnhancedGeneratePage() {
  const supabase = createClientComponentClient();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Template and prompt data
  const [selectedTemplate, setSelectedTemplate] = useState<{
    category: string;
    type: string;
    mood?: string;
    style?: string;
  } | null>(null);
  
  const [promptData, setPromptData] = useState<any>(null);
  const [refinedPrompt, setRefinedPrompt] = useState<string>("");
  
  // Story generation settings
  const [storyLength, setStoryLength] = useState<string>("medium");
  const [writingStyle, setWritingStyle] = useState<string>("balanced");
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
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
      createdAt: new Date().toISOString() 
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
              const clean = parsed.response
                .replace(/<think>[\s\S]*?<\/think>/g, "")
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .trim();

              if (clean) {
                fullStory += clean;
                setGeneratedStory((prev: any) => ({
                  ...prev,
                  content: (prev?.content || "") + clean,
                  title: prev?.title || generateTitle(selectedTemplate, promptData?.mainIdea || "")
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
              title: generateTitle(selectedTemplate, promptData?.mainIdea || "")
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
        content: "Sorry, we encountered an issue generating your story. Please try again.",
        title: "Generation Error",
        template: selectedTemplate.type,
        createdAt: new Date().toISOString()
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
          <div className="space-y-8">
            <EnhancedTemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
            
            {selectedTemplate && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue to Story Builder
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
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
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-3xl font-serif font-bold mb-2">Final Story Settings</h2>
              <p className="text-muted-foreground">
                Choose the length and style for your story
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Story Length */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Story Length</h3>
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
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Writing Style</h3>
                    </div>
                    
                    <Select value={writingStyle} onValueChange={setWritingStyle}>
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
                            <span className="font-medium">Rich & Descriptive</span>
                            <span className="text-xs text-muted-foreground">
                              Detailed descriptions and vivid imagery
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="poetic">
                          <div className="flex flex-col items-start py-1">
                            <span className="font-medium">Poetic & Lyrical</span>
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
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Story Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedTemplate?.category}</Badge>
                    <Badge variant="outline">{selectedTemplate?.type}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground">
                    <strong>Main Idea:</strong> {promptData?.mainIdea?.substring(0, 150)}
                    {promptData?.mainIdea?.length > 150 && "..."}
                  </p>
                  
                  {promptData?.characters && promptData.characters.length > 0 && (
                    <p className="text-muted-foreground">
                      <strong>Characters:</strong> {promptData.characters.join(", ")}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span><strong>Length:</strong> {storyLength}</span>
                    <span><strong>Style:</strong> {writingStyle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Story Builder
              </Button>
              
              <Button
                onClick={handleGenerate}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My Story
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="text-6xl mb-6">✨</div>
              <h2 className="text-3xl font-serif font-bold">Creating Your Story...</h2>
              <p className="text-muted-foreground text-lg">
                Our AI is carefully crafting your personalized story based on all the details you've provided.
              </p>
            </div>

            {/* Generation Progress */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span>Building story structure...</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse [animation-delay:0.5s]" />
                      <span>Developing characters...</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse [animation-delay:1s]" />
                      <span>Weaving the narrative...</span>
                    </div>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-3xl">📚</div>
              <div>
                <h1 className="font-serif text-2xl font-bold">Story Generator</h1>
                <p className="text-sm text-muted-foreground">Create your perfect story</p>
              </div>
            </div>
          </div>
          <ThemeSwitcher />
        </div>

        {/* Progress Steps */}
        {currentStep <= 3 && (
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="flex items-center gap-4">
                {generationSteps.slice(0, 3).map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex flex-col items-center gap-2 transition-all ${
                        isActive ? "scale-110" : ""
                      }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-lg" 
                            : isCompleted 
                              ? "bg-primary/20 text-primary" 
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-medium ${
                            isActive ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {step.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {step.description}
                          </div>
                        </div>
                      </div>
                      
                      {index < 2 && (
                        <div className={`w-16 h-0.5 mx-4 transition-all ${
                          isCompleted ? "bg-primary" : "bg-muted"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="max-w-7xl mx-auto">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}