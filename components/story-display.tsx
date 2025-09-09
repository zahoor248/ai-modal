"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, BookmarkPlus, Download, Share2, Globe, Check, Sparkles, Edit3 } from "lucide-react"
import { StoryEditor } from "@/components/story-editor"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface Story {
  id: string
  title: string
  content: string
  template: string
  createdAt: string
}

interface StoryDisplayProps {
  story: Story
  onReset: () => void
}

export function StoryDisplay({ story, onReset }: StoryDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentStory, setCurrentStory] = useState(story)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    // Mock TTS functionality
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 5000) // Auto-stop after 5 seconds for demo
    }
  }

  const handleSave = () => {
    setIsSaved(true)
    // Mock save to shelf
  }

  const handleDownload = () => {
    // Mock PDF download
    const element = document.createElement("a")
    const file = new Blob([`${currentStory.title}\n\n${currentStory.content}`], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${currentStory.title.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: currentStory.title,
        text: currentStory.content.substring(0, 100) + "...",
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const handlePublish = () => {
    setIsPublished(true)
    // Mock publish to community
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = (updatedStory: { title: string; content: string }) => {
    setCurrentStory({
      ...currentStory,
      title: updatedStory.title,
      content: updatedStory.content,
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <ThemeSwitcher />
          </div>
          <StoryEditor story={currentStory} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create Another Story
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold">Your Story</span>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="card-shadow border-0 bg-card mb-8">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {currentStory.template.charAt(0).toUpperCase() + currentStory.template.slice(1)} Story
                </Badge>
              </div>
              <h1 className="story-title text-4xl md:text-5xl mb-4">{currentStory.title}</h1>
              <p className="text-muted-foreground">
                Created on {new Date(currentStory.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="story-text max-w-3xl mx-auto">
                {currentStory.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Story Actions */}
          <Card className="card-shadow border-0 bg-card">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" onClick={handlePlay} className="flex items-center gap-2 bg-transparent">
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Listen
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2 bg-transparent">
                  <Edit3 className="w-4 h-4" />
                  Edit Story
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaved}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      Save to Shelf
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>

                <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share Link
                </Button>

                <Button onClick={handlePublish} disabled={isPublished} className="flex items-center gap-2">
                  {isPublished ? (
                    <>
                      <Check className="w-4 h-4" />
                      Published
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      Publish to Community
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
