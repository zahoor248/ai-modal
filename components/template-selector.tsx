"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, Heart, Compass, Lightbulb, Palette } from "lucide-react"
import Image from "next/image"

interface Template {
  category: string
  type: string
}

interface TemplateCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  cover: string
  gradient: string
  types: {
    id: string
    title: string
    description: string
    example: string
  }[]
}

const templateCategories: TemplateCategory[] = [
  {
    id: "kids",
    title: "Kids Stories",
    description: "Magical tales for young minds",
    icon: <Heart className="w-5 h-5" />,
    cover: "/cartoon-animal-book-cover.png",
    gradient: "from-pink-400 to-purple-500",
    types: [
      {
        id: "fairy-tale",
        title: "Fairy Tale",
        description: "Classic magical stories with princesses, dragons, and happy endings",
        example: "Once upon a time in a faraway kingdom...",
      },
      {
        id: "animal-adventure",
        title: "Animal Adventure",
        description: "Fun stories featuring talking animals on exciting journeys",
        example: "In the heart of the forest lived a curious little rabbit...",
      },
      {
        id: "bedtime",
        title: "Bedtime Story",
        description: "Gentle, soothing tales perfect for winding down",
        example: "As the stars began to twinkle in the night sky...",
      },
      {
        id: "learning",
        title: "Learning Adventure",
        description: "Educational stories that teach while entertaining",
        example: "Today was the day Luna would learn about the colors of the rainbow...",
      },
    ],
  },
  {
    id: "adventure",
    title: "Adventure Tales",
    description: "Thrilling journeys and epic quests",
    icon: <Compass className="w-5 h-5" />,
    cover: "/adventure-book-cover-with-mountains-and-treasure-m.jpg",
    gradient: "from-orange-400 to-red-500",
    types: [
      {
        id: "fantasy-quest",
        title: "Fantasy Quest",
        description: "Epic journeys through magical realms with heroes and mythical creatures",
        example: "The ancient prophecy spoke of a chosen one who would...",
      },
      {
        id: "mystery",
        title: "Mystery Adventure",
        description: "Intriguing puzzles and secrets waiting to be uncovered",
        example: "The old lighthouse keeper had vanished without a trace...",
      },
      {
        id: "sci-fi",
        title: "Sci-Fi Adventure",
        description: "Futuristic tales of space exploration and technological wonders",
        example: "Captain Nova received an urgent transmission from the outer rim...",
      },
      {
        id: "historical",
        title: "Historical Adventure",
        description: "Exciting stories set in fascinating periods of history",
        example: "In the bustling streets of ancient Rome...",
      },
    ],
  },
  {
    id: "inspirational",
    title: "Inspirational Stories",
    description: "Uplifting tales of hope and growth",
    icon: <Lightbulb className="w-5 h-5" />,
    cover: "/inspirational-book-cover-with-sunrise-and-mountain.jpg",
    gradient: "from-blue-400 to-teal-500",
    types: [
      {
        id: "overcoming-challenges",
        title: "Overcoming Challenges",
        description: "Stories of resilience and triumph over adversity",
        example: "Maria had always been told she was too small to make a difference...",
      },
      {
        id: "friendship",
        title: "Friendship & Kindness",
        description: "Heartwarming tales about the power of human connection",
        example: "When the new student sat alone at lunch, Emma knew what she had to do...",
      },
      {
        id: "self-discovery",
        title: "Self-Discovery",
        description: "Journey of finding one's true purpose and potential",
        example: "After years of following others' dreams, Sarah finally asked herself...",
      },
      {
        id: "family-bonds",
        title: "Family Bonds",
        description: "Stories celebrating the strength of family relationships",
        example: "Three generations gathered around the old oak tree...",
      },
    ],
  },
  {
    id: "custom",
    title: "Custom Story",
    description: "Create your unique narrative",
    icon: <Palette className="w-5 h-5" />,
    cover: "/blank-book-cover-with-creative-writing-tools-and-i.jpg",
    gradient: "from-purple-400 to-indigo-500",
    types: [
      {
        id: "open-ended",
        title: "Open-Ended",
        description: "Complete creative freedom to tell any story you imagine",
        example: "Let your imagination run wild and create something entirely unique...",
      },
    ],
  },
]

interface TemplateSelectorProps {
  selectedTemplate: Template | null
  onTemplateSelect: (template: Template) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  const handleTypeSelect = (category: string, type: string) => {
    onTemplateSelect({ category, type })
    setExpandedCategory(null)
  }

  return (
    <div className="space-y-4">
      {/* Template Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templateCategories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 card-shadow border-0 overflow-hidden ${
              expandedCategory === category.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className={`h-32 bg-gradient-to-br ${category.gradient} relative`}>
              <Image
                src={category.cover || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-background/20" />
              <div className="absolute top-3 right-3 text-primary-foreground">{category.icon}</div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{category.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${expandedCategory === category.id ? "rotate-90" : ""}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expanded Category Types */}
      {expandedCategory && (
        <Card className="card-shadow border-0 bg-muted/30">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="font-serif text-xl font-semibold">
                {templateCategories.find((c) => c.id === expandedCategory)?.title} Types
              </h3>
              <p className="text-muted-foreground text-sm">Choose the specific type of story you'd like to create</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templateCategories
                .find((c) => c.id === expandedCategory)
                ?.types.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                      selectedTemplate?.category === expandedCategory && selectedTemplate?.type === type.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => handleTypeSelect(expandedCategory, type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{type.title}</h4>
                        {selectedTemplate?.category === expandedCategory && selectedTemplate?.type === type.id && (
                          <Badge variant="default" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{type.description}</p>
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-xs italic text-muted-foreground">{type.example}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setExpandedCategory(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Template Display */}
      {selectedTemplate && (
        <Card className="card-shadow border-0 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Selected:</span>
              <Badge variant="secondary">
                {templateCategories.find((c) => c.id === selectedTemplate.category)?.title} -{" "}
                {
                  templateCategories
                    .find((c) => c.id === selectedTemplate.category)
                    ?.types.find((t) => t.id === selectedTemplate.type)?.title
                }
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
