"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, ArrowLeft, Loader2, Clock } from "lucide-react"
import Link from "next/link"
import { StoryDisplay } from "@/components/story-display"
import { generateMockStory } from "@/lib/mock-api"
import { TemplateSelector } from "@/components/template-selector"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function GeneratePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<{ category: string; type: string } | null>(null)
  const [prompt, setPrompt] = useState<string>("")
  const [storyLength, setStoryLength] = useState<string>("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStory, setGeneratedStory] = useState<any>(null)

  const handleGenerate = async () => {
    if (!selectedTemplate || !prompt.trim()) return

    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const story = generateMockStory(selectedTemplate.category, prompt, storyLength)
    setGeneratedStory(story)
    setIsGenerating(false)
  }

  const handleReset = () => {
    setGeneratedStory(null)
    setSelectedTemplate(null)
    setPrompt("")
    setStoryLength("medium")
  }

  if (generatedStory) {
    return <StoryDisplay story={generatedStory} onReset={handleReset} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="font-serif text-2xl font-bold">Story Generator</h1>
            </div>
          </div>
          <ThemeSwitcher />
        </div>

        {/* Generator Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="card-shadow border-0 bg-card">
            <CardHeader className="text-center pb-6">
              <CardTitle className="font-serif text-3xl text-balance">What story shall we create today?</CardTitle>
              <p className="text-muted-foreground text-pretty">
                Choose a template and share your ideas. Our AI will craft a beautiful, personalized story just for you.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="text-base font-medium">Choose Your Story Type</Label>
                <TemplateSelector selectedTemplate={selectedTemplate} onTemplateSelect={setSelectedTemplate} />
              </div>

              {/* Story Length Selector */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Story Length
                </Label>
                <Select value={storyLength} onValueChange={setStoryLength}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose story length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Short Story</span>
                        <span className="text-xs text-muted-foreground">
                          1-2 min read • Perfect for quick inspiration
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Medium Story</span>
                        <span className="text-xs text-muted-foreground">3-5 min read • Balanced narrative</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="long">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Long Story</span>
                        <span className="text-xs text-muted-foreground">
                          6-10 min read • Deep, detailed storytelling
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Story Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-medium">
                  What's your story about?
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your story idea... For example: 'A young girl who discovers she can talk to animals' or 'A grandfather sharing wisdom with his grandson during a fishing trip'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <p className="text-sm text-muted-foreground">{prompt.length}/500 characters</p>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!selectedTemplate || !prompt.trim() || isGenerating}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating your story...
                  </>
                ) : (
                  <>
                    Generate My Story
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Loading State */}
              {isGenerating && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-sm">Pages being written...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
