"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit3, Save, X } from "lucide-react"

interface StoryEditorProps {
  story: {
    id: string
    title: string
    content: string
    author?: string
  }
  onSave: (updatedStory: { title: string; content: string }) => void
  onCancel: () => void
}

export function StoryEditor({ story, onSave, onCancel }: StoryEditorProps) {
  const [title, setTitle] = useState(story.title)
  const [content, setContent] = useState(story.content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSave({ title, content })
    setIsSaving(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Edit Story
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="story-title">Story Title</Label>
          <Input
            id="story-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter story title..."
            className="text-lg font-semibold"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="story-content">Story Content</Label>
          <Textarea
            id="story-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story here..."
            className="min-h-[400px] font-serif text-lg leading-relaxed resize-none"
          />
          <p className="text-sm text-muted-foreground">{content.length} characters</p>
        </div>
      </CardContent>
    </Card>
  )
}
