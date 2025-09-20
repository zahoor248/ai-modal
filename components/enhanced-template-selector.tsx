"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Compass, 
  Lightbulb, 
  Palette,
  Crown,
  Rocket,
  TreePine,
  Ghost,
  Music,
  Zap
} from "lucide-react";

interface Template {
  category: string;
  type: string;
  mood?: string;
  style?: string;
}

interface TemplateCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  illustration: string;
  gradient: string;
  types: {
    id: string;
    title: string;
    description: string;
    example: string;
    mood: string[];
    keywords: string[];
  }[];
}

const templateCategories: TemplateCategory[] = [
  {
    id: "kids",
    title: "Kids & Family",
    description: "Magical tales for young hearts and minds",
    icon: <Heart className="w-6 h-6" />,
    illustration: "🧚‍♀️",
    gradient: "from-pink-400 via-purple-400 to-indigo-500",
    types: [
      {
        id: "fairy-tale",
        title: "Fairy Tale Classic",
        description: "Timeless magical stories with princesses, castles, and enchanted forests",
        example: "Once upon a time in a kingdom far, far away...",
        mood: ["magical", "whimsical", "enchanting"],
        keywords: ["princess", "dragon", "magic", "castle", "forest"]
      },
      {
        id: "animal-adventure",
        title: "Talking Animal Adventure",
        description: "Delightful stories featuring brave animals on exciting journeys",
        example: "In the heart of the Whispering Woods, a clever fox named...",
        mood: ["playful", "adventurous", "heartwarming"],
        keywords: ["animals", "forest", "friendship", "journey", "brave"]
      },
      {
        id: "bedtime-story",
        title: "Gentle Bedtime Tale",
        description: "Soothing stories perfect for peaceful dreams and sweet slumber",
        example: "As the gentle moonlight painted silver patterns on...",
        mood: ["peaceful", "calming", "dreamy"],
        keywords: ["moon", "stars", "sleep", "dreams", "gentle"]
      },
      {
        id: "educational-fun",
        title: "Learning Adventure",
        description: "Educational stories that teach valuable lessons through fun experiences",
        example: "Today was the day Luna would discover the secret of...",
        mood: ["curious", "inspiring", "educational"],
        keywords: ["learning", "discovery", "science", "colors", "numbers"]
      }
    ]
  },
  {
    id: "fantasy",
    title: "Fantasy & Magic",
    description: "Epic quests in realms beyond imagination",
    icon: <Crown className="w-6 h-6" />,
    illustration: "🏰",
    gradient: "from-purple-500 via-blue-500 to-cyan-500",
    types: [
      {
        id: "epic-quest",
        title: "Epic Hero's Journey",
        description: "Grand adventures with chosen heroes, ancient prophecies, and magical artifacts",
        example: "The ancient prophecy foretold of a hero who would rise when...",
        mood: ["epic", "heroic", "mystical"],
        keywords: ["prophecy", "hero", "magic", "quest", "artifact"]
      },
      {
        id: "magical-realm",
        title: "Magical Realm",
        description: "Explore enchanted worlds filled with magical creatures and wonder",
        example: "Through the shimmering portal, Aria stepped into a world where...",
        mood: ["mystical", "wondrous", "enchanting"],
        keywords: ["portal", "magic", "realm", "creatures", "enchanted"]
      },
      {
        id: "urban-fantasy",
        title: "Modern Magic",
        description: "Magic hidden in our modern world, where fantasy meets reality",
        example: "The coffee shop on Fifth Street looked ordinary, but Maya knew...",
        mood: ["mysterious", "contemporary", "hidden"],
        keywords: ["modern", "hidden", "magic", "city", "secret"]
      }
    ]
  },
  {
    id: "adventure",
    title: "Adventure & Exploration",
    description: "Thrilling journeys to unknown territories",
    icon: <Compass className="w-6 h-6" />,
    illustration: "🗺️",
    gradient: "from-orange-400 via-red-500 to-pink-500",
    types: [
      {
        id: "treasure-hunt",
        title: "Treasure Hunt",
        description: "Exciting searches for lost treasures and hidden secrets",
        example: "The ancient map revealed the location of Captain Blackbeard's...",
        mood: ["exciting", "mysterious", "adventurous"],
        keywords: ["treasure", "map", "pirates", "island", "gold"]
      },
      {
        id: "wilderness-survival",
        title: "Wilderness Survival",
        description: "Survival stories in untamed nature and challenging environments",
        example: "Stranded in the Amazon rainforest, Dr. Chen had only...",
        mood: ["challenging", "resilient", "intense"],
        keywords: ["survival", "wilderness", "nature", "challenge", "courage"]
      },
      {
        id: "time-travel",
        title: "Time Travel Adventure",
        description: "Journey through different eras and witness history unfold",
        example: "The antique pocket watch began to glow as Sarah touched...",
        mood: ["exciting", "historical", "wonder"],
        keywords: ["time", "history", "past", "future", "adventure"]
      }
    ]
  },
  {
    id: "sci-fi",
    title: "Science Fiction",
    description: "Future worlds and technological wonders",
    icon: <Rocket className="w-6 h-6" />,
    illustration: "🚀",
    gradient: "from-blue-500 via-indigo-600 to-purple-600",
    types: [
      {
        id: "space-exploration",
        title: "Space Odyssey",
        description: "Epic journeys across galaxies and encounters with alien civilizations",
        example: "Captain Nova received an urgent transmission from the outer rim...",
        mood: ["futuristic", "cosmic", "adventurous"],
        keywords: ["space", "galaxy", "alien", "ship", "exploration"]
      },
      {
        id: "ai-future",
        title: "AI & Robotics",
        description: "Stories exploring artificial intelligence and human-robot relationships",
        example: "ARIA-7 was the first android to experience something resembling...",
        mood: ["thoughtful", "futuristic", "emotional"],
        keywords: ["AI", "robot", "android", "technology", "future"]
      },
      {
        id: "dystopian",
        title: "Dystopian Future",
        description: "Dark futures where heroes fight against oppressive systems",
        example: "In the year 2157, the last free city stood behind walls of...",
        mood: ["dark", "resilient", "hopeful"],
        keywords: ["future", "dystopia", "freedom", "resistance", "hope"]
      }
    ]
  },
  {
    id: "mystery",
    title: "Mystery & Thriller",
    description: "Puzzles, secrets, and spine-tingling suspense",
    icon: <Ghost className="w-6 h-6" />,
    illustration: "🔍",
    gradient: "from-gray-600 via-gray-700 to-black",
    types: [
      {
        id: "detective-story",
        title: "Detective Mystery",
        description: "Classic whodunits with clever detectives and intricate clues",
        example: "Detective Sarah Chen examined the locked room where...",
        mood: ["suspenseful", "clever", "intriguing"],
        keywords: ["detective", "mystery", "clues", "investigation", "crime"]
      },
      {
        id: "haunted-mystery",
        title: "Supernatural Mystery",
        description: "Ghostly encounters and paranormal investigations",
        example: "The old Victorian mansion had been empty for decades, until...",
        mood: ["spooky", "mysterious", "supernatural"],
        keywords: ["ghost", "haunted", "paranormal", "mansion", "spirits"]
      },
      {
        id: "psychological-thriller",
        title: "Psychological Thriller",
        description: "Mind-bending stories that explore the depths of human psychology",
        example: "Dr. Martinez couldn't shake the feeling that her new patient...",
        mood: ["intense", "psychological", "suspenseful"],
        keywords: ["psychology", "mind", "thriller", "mystery", "tension"]
      }
    ]
  },
  {
    id: "inspirational",
    title: "Inspirational & Growth",
    description: "Uplifting tales of hope, courage, and transformation",
    icon: <Lightbulb className="w-6 h-6" />,
    illustration: "🌟",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    types: [
      {
        id: "overcoming-odds",
        title: "Against All Odds",
        description: "Inspiring stories of triumph over seemingly impossible challenges",
        example: "Everyone said it was impossible, but Maria refused to give up...",
        mood: ["inspiring", "determined", "uplifting"],
        keywords: ["challenge", "determination", "success", "courage", "dreams"]
      },
      {
        id: "friendship-bonds",
        title: "The Power of Friendship",
        description: "Heartwarming tales celebrating the bonds that unite us",
        example: "When Emma saw the new student eating lunch alone...",
        mood: ["heartwarming", "touching", "meaningful"],
        keywords: ["friendship", "kindness", "connection", "support", "love"]
      },
      {
        id: "personal-growth",
        title: "Journey of Self-Discovery",
        description: "Stories about finding one's true purpose and inner strength",
        example: "After years of following others' expectations, Alex finally...",
        mood: ["reflective", "empowering", "transformative"],
        keywords: ["growth", "self-discovery", "purpose", "identity", "change"]
      }
    ]
  },
  {
    id: "romance",
    title: "Romance & Love",
    description: "Tales of love, connection, and romantic adventures",
    icon: <Music className="w-6 h-6" />,
    illustration: "💕",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    types: [
      {
        id: "modern-romance",
        title: "Contemporary Romance",
        description: "Love stories set in today's world with relatable characters",
        example: "The coffee shop where they first met had become their...",
        mood: ["romantic", "contemporary", "heartwarming"],
        keywords: ["love", "romance", "modern", "relationship", "connection"]
      },
      {
        id: "historical-romance",
        title: "Historical Romance",
        description: "Romantic tales set in fascinating periods of history",
        example: "In Victorian London, Lady Catherine caught sight of...",
        mood: ["romantic", "elegant", "historical"],
        keywords: ["historical", "period", "romance", "elegant", "passion"]
      },
      {
        id: "fantasy-romance",
        title: "Fantasy Romance",
        description: "Love stories in magical realms with supernatural elements",
        example: "The dragon shifter prince had sworn never to love again...",
        mood: ["magical", "romantic", "passionate"],
        keywords: ["fantasy", "magic", "supernatural", "romance", "mystical"]
      }
    ]
  },
  {
    id: "horror",
    title: "Horror & Suspense",
    description: "Spine-chilling tales that will keep you on edge",
    icon: <Zap className="w-6 h-6" />,
    illustration: "👻",
    gradient: "from-gray-800 via-red-900 to-black",
    types: [
      {
        id: "classic-horror",
        title: "Classic Horror",
        description: "Traditional horror with monsters, haunted places, and dark secrets",
        example: "The old cemetery keeper warned them never to enter after...",
        mood: ["scary", "dark", "suspenseful"],
        keywords: ["horror", "monsters", "haunted", "fear", "darkness"]
      },
      {
        id: "psychological-horror",
        title: "Psychological Horror",
        description: "Mind-bending horror that plays with perception and sanity",
        example: "Dr. Williams began to question her own memories when...",
        mood: ["disturbing", "psychological", "unsettling"],
        keywords: ["psychology", "mind", "sanity", "reality", "disturbing"]
      }
    ]
  }
];

interface EnhancedTemplateSelectorProps {
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
}

export function EnhancedTemplateSelector({ selectedTemplate, onTemplateSelect }: EnhancedTemplateSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const handleTypeSelect = (category: string, type: string) => {
    onTemplateSelect({ 
      category, 
      type, 
      mood: selectedMood,
      style: selectedStyle 
    });
    setExpandedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold mb-2">Choose Your Story Universe</h2>
        <p className="text-muted-foreground">Select a category to explore different story types and styles</p>
      </div>

      {/* Template Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templateCategories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden group ${
              expandedCategory === category.id ? "ring-2 ring-primary shadow-xl scale-105" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Card Header with Gradient */}
            <div className={`h-40 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
              {/* Illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {category.illustration}
                </div>
              </div>
              
              {/* Icon in corner */}
              <div className="absolute top-4 right-4 text-white/90 group-hover:text-white transition-colors">
                {category.icon}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 ml-2 transition-all duration-200 ${
                    expandedCategory === category.id ? "rotate-90 text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expanded Category Types */}
      {expandedCategory && (
        <Card className="border-0 bg-gradient-to-br from-background via-muted/20 to-background shadow-2xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold mb-2 flex items-center gap-3">
                <span className="text-3xl">
                  {templateCategories.find((c) => c.id === expandedCategory)?.illustration}
                </span>
                {templateCategories.find((c) => c.id === expandedCategory)?.title} Stories
              </h3>
              <p className="text-muted-foreground">
                Choose the specific type of story you'd like to create from this category
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templateCategories
                .find((c) => c.id === expandedCategory)
                ?.types.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102 ${
                      selectedTemplate?.category === expandedCategory && selectedTemplate?.type === type.id
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg"
                        : "hover:bg-muted/30"
                    }`}
                    onClick={() => handleTypeSelect(expandedCategory, type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-lg">{type.title}</h4>
                        {selectedTemplate?.category === expandedCategory && selectedTemplate?.type === type.id && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {type.description}
                      </p>

                      {/* Mood Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {type.mood.map((mood) => (
                          <Badge 
                            key={mood} 
                            variant="secondary" 
                            className="text-xs bg-muted/50"
                          >
                            {mood}
                          </Badge>
                        ))}
                      </div>

                      {/* Example Text */}
                      <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary/30">
                        <p className="text-sm italic text-muted-foreground leading-relaxed">
                          "{type.example}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setExpandedCategory(null)}>
                Close Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Template Display */}
      {selectedTemplate && (
        <Card className="border-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {templateCategories.find((c) => c.id === selectedTemplate.category)?.illustration}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-lg">Perfect Choice!</span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {templateCategories.find((c) => c.id === selectedTemplate.category)?.title} - {" "}
                  {templateCategories
                    .find((c) => c.id === selectedTemplate.category)
                    ?.types.find((t) => t.id === selectedTemplate.type)?.title}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}