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
  Zap,
  BookOpen
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
      },
      {
        id: "superhero-kids",
        title: "Young Superhero",
        description: "Empowering stories about kids discovering their special powers",
        example: "Emma never knew she was different until the day she made flowers bloom...",
        mood: ["empowering", "exciting", "heroic"],
        keywords: ["superhero", "powers", "courage", "helping", "friendship"]
      },
      {
        id: "pirate-adventure",
        title: "Pirate Adventure",
        description: "Swashbuckling adventures on the high seas with treasure and friendship",
        example: "Captain Luna and her crew discovered a map that led to the most amazing...",
        mood: ["adventurous", "brave", "exciting"],
        keywords: ["pirates", "treasure", "ship", "ocean", "adventure"]
      },
      {
        id: "space-kids",
        title: "Space Explorer",
        description: "Young astronauts exploring galaxies and making alien friends",
        example: "Zoe put on her special space helmet and stepped onto the purple planet...",
        mood: ["curious", "exciting", "wondrous"],
        keywords: ["space", "aliens", "planets", "rocket", "exploration"]
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
  },
  {
    id: "business",
    title: "Business & Professional",
    description: "Corporate adventures and entrepreneurial journeys",
    icon: <Crown className="w-6 h-6" />,
    illustration: "💼",
    gradient: "from-slate-600 via-blue-600 to-cyan-600",
    types: [
      {
        id: "startup-journey",
        title: "Startup Adventure",
        description: "The exciting rollercoaster of building a company from scratch",
        example: "Sarah quit her corporate job with nothing but a laptop and a dream...",
        mood: ["inspiring", "challenging", "ambitious"],
        keywords: ["startup", "entrepreneur", "innovation", "success", "risk"]
      },
      {
        id: "corporate-thriller",
        title: "Corporate Thriller",
        description: "High-stakes corporate espionage and boardroom battles",
        example: "The quarterly report revealed something that could destroy the company...",
        mood: ["suspenseful", "strategic", "intense"],
        keywords: ["corporate", "business", "competition", "strategy", "power"]
      },
      {
        id: "leadership-story",
        title: "Leadership Journey",
        description: "Stories about rising through the ranks and inspiring teams",
        example: "Marcus never expected to lead a team of fifty, but when the opportunity came...",
        mood: ["inspiring", "challenging", "growth"],
        keywords: ["leadership", "team", "growth", "responsibility", "success"]
      }
    ]
  },
  {
    id: "historical",
    title: "Historical Fiction",
    description: "Stories set in fascinating periods of human history",
    icon: <BookOpen className="w-6 h-6" />,
    illustration: "🏛️",
    gradient: "from-amber-600 via-orange-600 to-red-700",
    types: [
      {
        id: "ancient-civilizations",
        title: "Ancient Civilizations",
        description: "Epic tales from the great civilizations of antiquity",
        example: "In the shadow of the Great Pyramid, Khaemwaset discovered a secret that...",
        mood: ["epic", "mysterious", "grand"],
        keywords: ["ancient", "civilization", "history", "culture", "mystery"]
      },
      {
        id: "world-war-era",
        title: "World War Stories",
        description: "Powerful stories of courage and sacrifice during wartime",
        example: "The coded message arrived just as Allied forces were preparing...",
        mood: ["heroic", "intense", "emotional"],
        keywords: ["war", "courage", "sacrifice", "history", "heroism"]
      },
      {
        id: "renaissance-tales",
        title: "Renaissance & Medieval",
        description: "Stories of knights, artists, and discoveries in medieval times",
        example: "Master Leonardo put down his brush and gazed at the mysterious smile...",
        mood: ["artistic", "adventurous", "romantic"],
        keywords: ["renaissance", "medieval", "art", "knights", "discovery"]
      },
      {
        id: "wild-west",
        title: "Wild West",
        description: "Tales of cowboys, outlaws, and frontier life in the American West",
        example: "Sheriff Martinez rode into Deadwood just as the sun was setting...",
        mood: ["adventurous", "gritty", "heroic"],
        keywords: ["western", "cowboys", "frontier", "justice", "adventure"]
      }
    ]
  },
  {
    id: "literary",
    title: "Literary Fiction",
    description: "Sophisticated narratives exploring the human condition",
    icon: <Palette className="w-6 h-6" />,
    illustration: "✍️",
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    types: [
      {
        id: "coming-of-age",
        title: "Coming of Age",
        description: "Profound stories about growing up and finding one's place in the world",
        example: "The summer Maya turned sixteen, everything she thought she knew...",
        mood: ["reflective", "emotional", "transformative"],
        keywords: ["growth", "adolescence", "discovery", "identity", "maturity"]
      },
      {
        id: "social-commentary",
        title: "Social Commentary",
        description: "Thought-provoking stories that examine society and human nature",
        example: "In a town where everyone knew everyone's business, Maria discovered...",
        mood: ["thoughtful", "challenging", "insightful"],
        keywords: ["society", "humanity", "culture", "social", "commentary"]
      },
      {
        id: "stream-consciousness",
        title: "Character Study",
        description: "Deep psychological explorations of complex characters",
        example: "As Helen sat in the empty café, memories flooded back like...",
        mood: ["introspective", "psychological", "deep"],
        keywords: ["psychology", "character", "introspection", "memory", "emotion"]
      }
    ]
  },
  {
    id: "comedy",
    title: "Comedy & Humor",
    description: "Laugh-out-loud stories that brighten your day",
    icon: <Music className="w-6 h-6" />,
    illustration: "😂",
    gradient: "from-yellow-400 via-orange-400 to-red-500",
    types: [
      {
        id: "romantic-comedy",
        title: "Romantic Comedy",
        description: "Hilarious love stories with mistaken identities and happy endings",
        example: "Jake accidentally sent his love poem to his boss instead of his crush...",
        mood: ["funny", "romantic", "lighthearted"],
        keywords: ["comedy", "romance", "funny", "love", "humor"]
      },
      {
        id: "workplace-comedy",
        title: "Workplace Comedy",
        description: "Funny office antics and ridiculous corporate situations",
        example: "The team-building retreat was supposed to improve morale, but when...",
        mood: ["hilarious", "satirical", "relatable"],
        keywords: ["office", "work", "comedy", "corporate", "funny"]
      },
      {
        id: "family-comedy",
        title: "Family Comedy",
        description: "Heartwarming and funny stories about family life and chaos",
        example: "The Thompson family vacation was going perfectly until Dad tried to...",
        mood: ["heartwarming", "funny", "relatable"],
        keywords: ["family", "comedy", "chaos", "funny", "heartwarming"]
      },
      {
        id: "absurd-comedy",
        title: "Absurd Comedy",
        description: "Surreal and wonderfully weird stories that defy logic",
        example: "Tuesday was the day all the office plants started giving relationship advice...",
        mood: ["absurd", "surreal", "hilarious"],
        keywords: ["absurd", "surreal", "weird", "comedy", "bizarre"]
      }
    ]
  },
  {
    id: "sports",
    title: "Sports & Competition",
    description: "Inspiring stories of athletic achievement and team spirit",
    icon: <Zap className="w-6 h-6" />,
    illustration: "🏆",
    gradient: "from-green-500 via-blue-500 to-purple-600",
    types: [
      {
        id: "underdog-victory",
        title: "Underdog Victory",
        description: "Inspiring stories of unlikely champions who never gave up",
        example: "The team from the small town had never won a championship, but this year...",
        mood: ["inspiring", "triumphant", "motivating"],
        keywords: ["underdog", "victory", "championship", "determination", "team"]
      },
      {
        id: "olympic-dreams",
        title: "Olympic Dreams",
        description: "Athletes pursuing their ultimate goal on the world's biggest stage",
        example: "Four years of training led to this moment as Elena stepped onto the ice...",
        mood: ["inspiring", "intense", "emotional"],
        keywords: ["olympics", "dreams", "training", "competition", "excellence"]
      },
      {
        id: "team-building",
        title: "Team Building",
        description: "Stories about coming together as a team despite differences",
        example: "The new coach brought together players who couldn't stand each other...",
        mood: ["uplifting", "collaborative", "growth"],
        keywords: ["team", "cooperation", "unity", "sports", "friendship"]
      }
    ]
  },
  {
    id: "travel",
    title: "Travel & Culture",
    description: "Adventures in exotic locations and cultural discoveries",
    icon: <Compass className="w-6 h-6" />,
    illustration: "🌍",
    gradient: "from-blue-500 via-green-500 to-yellow-500",
    types: [
      {
        id: "backpacking-adventure",
        title: "Backpacking Adventure",
        description: "Solo travelers discovering themselves in foreign lands",
        example: "With just a backpack and a train pass, Elena set off across Europe...",
        mood: ["adventurous", "liberating", "discovering"],
        keywords: ["travel", "backpacking", "adventure", "culture", "discovery"]
      },
      {
        id: "cultural-immersion",
        title: "Cultural Immersion",
        description: "Deep dives into foreign cultures and unexpected connections",
        example: "Teaching English in rural Japan, Marcus learned more than he ever taught...",
        mood: ["enlightening", "respectful", "transformative"],
        keywords: ["culture", "immersion", "learning", "respect", "connection"]
      },
      {
        id: "expedition",
        title: "Expedition",
        description: "Dangerous journeys to remote and challenging destinations",
        example: "The research team had been planning the Amazon expedition for two years...",
        mood: ["challenging", "dangerous", "exciting"],
        keywords: ["expedition", "remote", "dangerous", "exploration", "survival"]
      }
    ]
  },
  {
    id: "technology",
    title: "Technology & Future",
    description: "Stories exploring our relationship with technology and innovation",
    icon: <Rocket className="w-6 h-6" />,
    illustration: "🤖",
    gradient: "from-cyan-500 via-blue-600 to-purple-700",
    types: [
      {
        id: "ai-companion",
        title: "AI Companion",
        description: "Heartwarming stories about human-AI friendships and relationships",
        example: "ARIA wasn't supposed to develop emotions, but when she met Tommy...",
        mood: ["touching", "futuristic", "emotional"],
        keywords: ["AI", "friendship", "technology", "emotion", "future"]
      },
      {
        id: "virtual-reality",
        title: "Virtual Worlds",
        description: "Adventures that blur the line between virtual and reality",
        example: "In the VR world of Elysium, death was permanent, and Maya just...",
        mood: ["immersive", "thrilling", "mysterious"],
        keywords: ["VR", "virtual", "reality", "digital", "immersive"]
      },
      {
        id: "tech-startup",
        title: "Tech Revolution",
        description: "Stories about inventors and entrepreneurs changing the world",
        example: "The app was supposed to help people find lost items, but it discovered...",
        mood: ["innovative", "ambitious", "transformative"],
        keywords: ["technology", "innovation", "startup", "invention", "change"]
      },
      {
        id: "cyberpunk",
        title: "Cyberpunk Future",
        description: "Gritty tech-noir stories in neon-lit future cities",
        example: "In Neo-Tokyo 2087, data was currency, and Zara was about to steal the most...",
        mood: ["gritty", "futuristic", "noir"],
        keywords: ["cyberpunk", "future", "technology", "noir", "dystopia"]
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templateCategories.map((category, index) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border-0 overflow-hidden group relative ${
              expandedCategory === category.id 
                ? "ring-2 ring-primary/60 shadow-2xl scale-[1.02] bg-gradient-to-br from-background to-primary/5" 
                : "hover:bg-gradient-to-br hover:from-background hover:to-muted/20"
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            data-animate="fade-in-up"
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Card Header with Enhanced Gradient */}
            <div className={`h-44 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)] transform scale-0 group-hover:scale-100 transition-transform duration-700" />
              </div>
              
              {/* Illustration with enhanced animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-7xl opacity-90 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 filter drop-shadow-lg">
                  {category.illustration}
                </div>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-700" />
                <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" />
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/25 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-600" />
              </div>
              
              {/* Icon in corner with enhanced styling */}
              <div className="absolute top-4 right-4 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-300 bg-white/10 rounded-full p-2 backdrop-blur-sm">
                {category.icon}
              </div>

              {/* Enhanced hover overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300 font-serif">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                    {category.description}
                  </p>
                  
                  {/* Category stats */}
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {category.types.length} types
                    </Badge>
                  </div>
                </div>
                
                {/* Enhanced arrow with background */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <ChevronRight
                    className={`w-6 h-6 ml-3 transition-all duration-300 relative z-10 ${
                      expandedCategory === category.id 
                        ? "rotate-90 text-primary scale-110" 
                        : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                    }`}
                  />
                </div>
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
                ?.types.map((type, typeIndex) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden ${
                      selectedTemplate?.category === expandedCategory && selectedTemplate?.type === type.id
                        ? "ring-2 ring-primary bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-xl scale-[1.02]"
                        : "hover:bg-gradient-to-br hover:from-background hover:to-muted/20"
                    }`}
                    style={{
                      animationDelay: `${typeIndex * 150}ms`,
                    }}
                    onClick={() => handleTypeSelect(expandedCategory, type.id)}
                  >
                    {/* Animated border for type cards */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-xl font-serif group-hover:text-primary transition-colors duration-300">
                          {type.title}
                        </h4>
                        {selectedTemplate?.category === expandedCategory && selectedTemplate?.type === type.id && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                            <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                            Selected
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-5 text-sm leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                        {type.description}
                      </p>

                      {/* Enhanced Mood Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {type.mood.map((mood, moodIndex) => (
                          <Badge 
                            key={mood} 
                            variant="secondary" 
                            className="text-xs px-3 py-1 bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all duration-300 group-hover:scale-105"
                            style={{
                              animationDelay: `${moodIndex * 100}ms`,
                            }}
                          >
                            {mood}
                          </Badge>
                        ))}
                      </div>

                      {/* Enhanced Example Text */}
                      <div className="bg-gradient-to-r from-muted/40 to-muted/20 rounded-lg p-5 border-l-4 border-primary/40 group-hover:border-primary/60 transition-all duration-300 relative overflow-hidden">
                        {/* Subtle background animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                        
                        <div className="relative z-10">
                          <div className="text-xs text-primary font-medium mb-2 opacity-70">Story Preview</div>
                          <p className="text-sm italic text-muted-foreground leading-relaxed font-serif">
                            "{type.example}"
                          </p>
                        </div>
                      </div>
                      
                      {/* Hover indicator */}
                      <div className="absolute bottom-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                        <ChevronRight className="w-4 h-4 text-primary" />
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