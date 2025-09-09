import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookOpen,
  Headphones,
  Share2,
  Sparkles,
  Users,
  Heart,
  Check,
  Mail,
  MessageCircle,
  Phone,
  Menu,
  Star,
  Wand2,
  Play,
  Download,
  Globe,
  TrendingUp,
  Zap,
} from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary group-hover:animate-pulse transition-all" />
              <Star className="w-3 h-3 text-secondary absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StoryWeaver
              </span>
              <span className="text-xs text-muted-foreground -mt-1">AI Storytelling</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/generate"
              className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
              <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Create Story</span>
            </Link>
            <Link
              href="/shelf"
              className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>My Shelf</span>
            </Link>
            <Link
              href="/community"
              className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Community</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeSwitcher />
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg"
                asChild
              >
                <Link href="/generate">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Start Free
                </Link>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center magical-gradient overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-8 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>50K+ Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>1M+ Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="mb-12">
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <Sparkles className="w-20 h-20 text-primary animate-pulse" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center animate-bounce">
                  <Wand2 className="w-4 h-4 text-secondary-foreground" />
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground mb-8 text-balance drop-shadow-lg leading-tight">
              Create Stories That
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Captivate Hearts
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto drop-shadow-md leading-relaxed">
              Transform your ideas into professional-grade stories with AI. Perfect for children's books, business
              narratives, and everything in between.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">AI-Powered</h3>
              <p className="text-xs text-muted-foreground">Advanced storytelling</p>
            </div>
            <div className="bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <Play className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Audio Ready</h3>
              <p className="text-xs text-muted-foreground">Text-to-speech included</p>
            </div>
            <div className="bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <Download className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Export Ready</h3>
              <p className="text-xs text-muted-foreground">PDF, ePub, Video</p>
            </div>
            <div className="bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Share Globally</h3>
              <p className="text-xs text-muted-foreground">Community platform</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/generate">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Start Creating Free
                <TrendingUp className="ml-3 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/community">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 bg-background/90 text-foreground border-2 border-border hover:bg-background backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-3 w-5 h-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6">Trusted by creators worldwide</p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-background/30 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    "StoryWeaver transformed how I create children's books. The AI understands narrative flow
                    perfectly."
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">SJ</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Children's Author</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/30 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    "Perfect for business storytelling. Our company narratives have never been more engaging."
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">MR</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold">Mike Rodriguez</p>
                      <p className="text-xs text-muted-foreground">Marketing Director</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/30 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    "My kids love the stories we create together. The audio feature makes bedtime magical."
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">AL</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold">Anna Lee</p>
                      <p className="text-xs text-muted-foreground">Parent & Teacher</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 text-balance">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-4">Write</h3>
                <p className="text-muted-foreground text-pretty">
                  Share your ideas and let our AI craft beautiful, personalized stories that touch the heart.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-4">Listen</h3>
                <p className="text-muted-foreground text-pretty">
                  Experience your stories come alive with natural text-to-speech narration.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Share2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-4">Share</h3>
                <p className="text-muted-foreground text-pretty">
                  Save to your digital shelf and share with loved ones or the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Preview Stories Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 text-balance">Stories that inspire</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStories.map((story, index) => (
              <Card
                key={index}
                className="card-shadow border-0 bg-card hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{story.category}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-balance">{story.title}</h3>
                  <p className="text-muted-foreground text-sm text-pretty line-clamp-3">{story.preview}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{story.likes} likes</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read more
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 text-balance">Choose your storytelling journey</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              From casual storytelling to professional publishing, we have a plan that fits your creative needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="card-shadow border-0 bg-card relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif font-bold mb-2">Free</h3>
                  <div className="text-4xl font-bold mb-2">$0</div>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>5 stories per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Text-to-speech</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Community sharing</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="card-shadow border-0 bg-card relative border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif font-bold mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-2">$9.99</div>
                  <p className="text-muted-foreground">per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Unlimited stories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Advanced AI features</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>PDF & ePub export</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full">Start Pro Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="card-shadow border-0 bg-card relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif font-bold mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold mb-2">$29.99</div>
                  <p className="text-muted-foreground">per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Video generation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 text-balance">Get in touch</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm mb-3">Send us an email anytime</p>
                <a href="mailto:hello@storyweaver.ai" className="text-primary hover:underline">
                  hello@storyweaver.ai
                </a>
              </CardContent>
            </Card>

            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground text-sm mb-3">Chat with our team</p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="card-shadow border-0 bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground text-sm mb-3">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+1-555-123-4567" className="text-primary hover:underline">
                  +1 (555) 123-4567
                </a>
              </CardContent>
            </Card>
          </div>

          <Card className="card-shadow border-0 bg-card">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  Send Message
                  <Mail className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-serif text-2xl font-bold">StoryWeaver</span>
          </div>
          <p className="text-muted-foreground mb-6">Where every story finds its voice</p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link href="/shelf" className="hover:text-foreground transition-colors">
              My Shelf
            </Link>
            <Link href="/community" className="hover:text-foreground transition-colors">
              Community
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const mockStories = [
  {
    title: "The Little Star's Journey",
    category: "Kids",
    preview:
      "Once upon a time, in the vast expanse of the night sky, there lived a little star who dreamed of shining brighter than all the others...",
    likes: 127,
  },
  {
    title: "Finding Courage in the Storm",
    category: "Inspirational",
    preview:
      "Sarah had always been afraid of thunderstorms, but on this particular night, she would discover that courage isn't the absence of fear...",
    likes: 89,
  },
  {
    title: "The Secret Garden of Memories",
    category: "Adventure",
    preview:
      "Behind the old oak tree in grandmother's backyard, Maya discovered a hidden gate that led to a garden where memories bloomed like flowers...",
    likes: 156,
  },
]
