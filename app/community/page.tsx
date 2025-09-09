"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Heart, Search, TrendingUp, Clock, User, ArrowLeft, Sparkles, BookOpen, Calendar, Plus } from "lucide-react"
import { mockCommunityStories, mockShelfStories } from "@/lib/mock-data"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set())

  const allCommunityStories = [...mockCommunityStories]
  const myPublishedStories = mockShelfStories.filter((story) => story.likes && story.likes > 0)

  const filteredStories = (stories: any[]) =>
    stories.filter(
      (story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.template.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const trendingStories = [...allCommunityStories].sort((a, b) => (b.likes || 0) - (a.likes || 0))
  const newStories = [...allCommunityStories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const handleLike = (storyId: string) => {
    const newLikedStories = new Set(likedStories)
    if (likedStories.has(storyId)) {
      newLikedStories.delete(storyId)
    } else {
      newLikedStories.add(storyId)
    }
    setLikedStories(newLikedStories)
  }

  const StoryCard = ({ story, showAuthor = true }: { story: any; showAuthor?: boolean }) => (
    <Card className="card-shadow border-0 bg-card hover:scale-105 transition-all duration-300 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {story.template.charAt(0).toUpperCase() + story.template.slice(1)}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(story.createdAt).toLocaleDateString()}
          </div>
        </div>
        <Link href={`/stories/${story.id}`}>
          <CardTitle className="font-serif text-xl text-balance line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {story.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm text-pretty line-clamp-3 mb-4">{story.preview}</p>

        {showAuthor && story.author && (
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-6 h-6">
              <AvatarImage src={story.authorAvatar || "/placeholder.svg"} alt={story.author} />
              <AvatarFallback className="text-xs">{story.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{story.author}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{story.readTime} min</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLike(story.id)}
            className={`flex items-center gap-1 h-8 px-2 ${
              likedStories.has(story.id) ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart className={`w-4 h-4 ${likedStories.has(story.id) ? "fill-current" : ""}`} />
            <span className="text-sm">{(story.likes || 0) + (likedStories.has(story.id) ? 1 : 0)}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="font-serif text-3xl font-bold">Community Stories</h1>
            </div>
          </div>
          <Link href="/generate">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Story
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stories, authors, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              New
            </TabsTrigger>
            <TabsTrigger value="my-stories" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              My Stories
            </TabsTrigger>
          </TabsList>

          {/* Trending Stories */}
          <TabsContent value="trending">
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold mb-2">Trending Stories</h2>
              <p className="text-muted-foreground">Discover the most loved stories in our community</p>
            </div>
            {filteredStories(trendingStories).length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories(trendingStories).map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">No trending stories found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try adjusting your search terms." : "Be the first to share a story!"}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* New Stories */}
          <TabsContent value="new">
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold mb-2">Latest Stories</h2>
              <p className="text-muted-foreground">Fresh stories from our creative community</p>
            </div>
            {filteredStories(newStories).length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories(newStories).map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">No new stories found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try adjusting your search terms." : "Check back soon for new stories!"}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* My Published Stories */}
          <TabsContent value="my-stories">
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold mb-2">My Published Stories</h2>
              <p className="text-muted-foreground">Stories you've shared with the community</p>
            </div>
            {filteredStories(myPublishedStories).length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories(myPublishedStories).map((story) => (
                  <StoryCard key={story.id} story={story} showAuthor={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">
                    {searchQuery ? "No published stories found" : "You haven't published any stories yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : "Create a story and publish it to share with the community!"}
                  </p>
                  {!searchQuery && (
                    <Link href="/generate">
                      <Button size="lg">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Your First Story
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
