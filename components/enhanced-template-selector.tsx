"use client";

import { useState, KeyboardEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Compass,
  Crown,
  Edit2,
  Ghost,
  Heart,
  Lightbulb,
  Music,
  Palette,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";

/**
 * Uses your existing templateCategories (must be in same file or imported).
 * Props kept identical to your previous component so no external logic changes.
 */

const templateCategories: any[] = [
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
        description:
          "Timeless magical stories with princesses, castles, and enchanted forests",
        example: "Once upon a time in a kingdom far, far away...",
        mood: ["magical", "whimsical", "enchanting"],
        keywords: ["princess", "dragon", "magic", "castle", "forest"],
      },
      {
        id: "animal-adventure",
        title: "Talking Animal Adventure",
        description:
          "Delightful stories featuring brave animals on exciting journeys",
        example: "In the heart of the Whispering Woods, a clever fox named...",
        mood: ["playful", "adventurous", "heartwarming"],
        keywords: ["animals", "forest", "friendship", "journey", "brave"],
      },
      {
        id: "bedtime-story",
        title: "Gentle Bedtime Tale",
        description:
          "Soothing stories perfect for peaceful dreams and sweet slumber",
        example: "As the gentle moonlight painted silver patterns on...",
        mood: ["peaceful", "calming", "dreamy"],
        keywords: ["moon", "stars", "sleep", "dreams", "gentle"],
      },
      {
        id: "educational-fun",
        title: "Learning Adventure",
        description:
          "Educational stories that teach valuable lessons through fun experiences",
        example: "Today was the day Luna would discover the secret of...",
        mood: ["curious", "inspiring", "educational"],
        keywords: ["learning", "discovery", "science", "colors", "numbers"],
      },
      {
        id: "superhero-kids",
        title: "Young Superhero",
        description:
          "Empowering stories about kids discovering their special powers",
        example:
          "Emma never knew she was different until the day she made flowers bloom...",
        mood: ["empowering", "exciting", "heroic"],
        keywords: ["superhero", "powers", "courage", "helping", "friendship"],
      },
      {
        id: "pirate-adventure",
        title: "Pirate Adventure",
        description:
          "Swashbuckling adventures on the high seas with treasure and friendship",
        example:
          "Captain Luna and her crew discovered a map that led to the most amazing...",
        mood: ["adventurous", "brave", "exciting"],
        keywords: ["pirates", "treasure", "ship", "ocean", "adventure"],
      },
      {
        id: "space-kids",
        title: "Space Explorer",
        description:
          "Young astronauts exploring galaxies and making alien friends",
        example:
          "Zoe put on her special space helmet and stepped onto the purple planet...",
        mood: ["curious", "exciting", "wondrous"],
        keywords: ["space", "aliens", "planets", "rocket", "exploration"],
      },
    ],
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
        description:
          "Grand adventures with chosen heroes, ancient prophecies, and magical artifacts",
        example:
          "The ancient prophecy foretold of a hero who would rise when...",
        mood: ["epic", "heroic", "mystical"],
        keywords: ["prophecy", "hero", "magic", "quest", "artifact"],
      },
      {
        id: "magical-realm",
        title: "Magical Realm",
        description:
          "Explore enchanted worlds filled with magical creatures and wonder",
        example:
          "Through the shimmering portal, Aria stepped into a world where...",
        mood: ["mystical", "wondrous", "enchanting"],
        keywords: ["portal", "magic", "realm", "creatures", "enchanted"],
      },
      {
        id: "urban-fantasy",
        title: "Modern Magic",
        description:
          "Magic hidden in our modern world, where fantasy meets reality",
        example:
          "The coffee shop on Fifth Street looked ordinary, but Maya knew...",
        mood: ["mysterious", "contemporary", "hidden"],
        keywords: ["modern", "hidden", "magic", "city", "secret"],
      },
    ],
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
        example:
          "The ancient map revealed the location of Captain Blackbeard's...",
        mood: ["exciting", "mysterious", "adventurous"],
        keywords: ["treasure", "map", "pirates", "island", "gold"],
      },
      {
        id: "wilderness-survival",
        title: "Wilderness Survival",
        description:
          "Survival stories in untamed nature and challenging environments",
        example: "Stranded in the Amazon rainforest, Dr. Chen had only...",
        mood: ["challenging", "resilient", "intense"],
        keywords: ["survival", "wilderness", "nature", "challenge", "courage"],
      },
      {
        id: "time-travel",
        title: "Time Travel Adventure",
        description:
          "Journey through different eras and witness history unfold",
        example: "The antique pocket watch began to glow as Sarah touched...",
        mood: ["exciting", "historical", "wonder"],
        keywords: ["time", "history", "past", "future", "adventure"],
      },
    ],
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
        description:
          "Epic journeys across galaxies and encounters with alien civilizations",
        example:
          "Captain Nova received an urgent transmission from the outer rim...",
        mood: ["futuristic", "cosmic", "adventurous"],
        keywords: ["space", "galaxy", "alien", "ship", "exploration"],
      },
      {
        id: "ai-future",
        title: "AI & Robotics",
        description:
          "Stories exploring artificial intelligence and human-robot relationships",
        example:
          "ARIA-7 was the first android to experience something resembling...",
        mood: ["thoughtful", "futuristic", "emotional"],
        keywords: ["AI", "robot", "android", "technology", "future"],
      },
      {
        id: "dystopian",
        title: "Dystopian Future",
        description:
          "Dark futures where heroes fight against oppressive systems",
        example:
          "In the year 2157, the last free city stood behind walls of...",
        mood: ["dark", "resilient", "hopeful"],
        keywords: ["future", "dystopia", "freedom", "resistance", "hope"],
      },
    ],
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
        description:
          "Classic whodunits with clever detectives and intricate clues",
        example: "Detective Sarah Chen examined the locked room where...",
        mood: ["suspenseful", "clever", "intriguing"],
        keywords: ["detective", "mystery", "clues", "investigation", "crime"],
      },
      {
        id: "haunted-mystery",
        title: "Supernatural Mystery",
        description: "Ghostly encounters and paranormal investigations",
        example:
          "The old Victorian mansion had been empty for decades, until...",
        mood: ["spooky", "mysterious", "supernatural"],
        keywords: ["ghost", "haunted", "paranormal", "mansion", "spirits"],
      },
      {
        id: "psychological-thriller",
        title: "Psychological Thriller",
        description:
          "Mind-bending stories that explore the depths of human psychology",
        example:
          "Dr. Martinez couldn't shake the feeling that her new patient...",
        mood: ["intense", "psychological", "suspenseful"],
        keywords: ["psychology", "mind", "thriller", "mystery", "tension"],
      },
    ],
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
        description:
          "Inspiring stories of triumph over seemingly impossible challenges",
        example:
          "Everyone said it was impossible, but Maria refused to give up...",
        mood: ["inspiring", "determined", "uplifting"],
        keywords: [
          "challenge",
          "determination",
          "success",
          "courage",
          "dreams",
        ],
      },
      {
        id: "friendship-bonds",
        title: "The Power of Friendship",
        description: "Heartwarming tales celebrating the bonds that unite us",
        example: "When Emma saw the new student eating lunch alone...",
        mood: ["heartwarming", "touching", "meaningful"],
        keywords: ["friendship", "kindness", "connection", "support", "love"],
      },
      {
        id: "personal-growth",
        title: "Journey of Self-Discovery",
        description:
          "Stories about finding one's true purpose and inner strength",
        example:
          "After years of following others' expectations, Alex finally...",
        mood: ["reflective", "empowering", "transformative"],
        keywords: ["growth", "self-discovery", "purpose", "identity", "change"],
      },
    ],
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
        description:
          "Love stories set in today's world with relatable characters",
        example: "The coffee shop where they first met had become their...",
        mood: ["romantic", "contemporary", "heartwarming"],
        keywords: ["love", "romance", "modern", "relationship", "connection"],
      },
      {
        id: "historical-romance",
        title: "Historical Romance",
        description: "Romantic tales set in fascinating periods of history",
        example: "In Victorian London, Lady Catherine caught sight of...",
        mood: ["romantic", "elegant", "historical"],
        keywords: ["historical", "period", "romance", "elegant", "passion"],
      },
      {
        id: "fantasy-romance",
        title: "Fantasy Romance",
        description:
          "Love stories in magical realms with supernatural elements",
        example: "The dragon shifter prince had sworn never to love again...",
        mood: ["magical", "romantic", "passionate"],
        keywords: ["fantasy", "magic", "supernatural", "romance", "mystical"],
      },
    ],
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
        description:
          "Traditional horror with monsters, haunted places, and dark secrets",
        example: "The old cemetery keeper warned them never to enter after...",
        mood: ["scary", "dark", "suspenseful"],
        keywords: ["horror", "monsters", "haunted", "fear", "darkness"],
      },
      {
        id: "psychological-horror",
        title: "Psychological Horror",
        description:
          "Mind-bending horror that plays with perception and sanity",
        example: "Dr. Williams began to question her own memories when...",
        mood: ["disturbing", "psychological", "unsettling"],
        keywords: ["psychology", "mind", "sanity", "reality", "disturbing"],
      },
    ],
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
        description:
          "The exciting rollercoaster of building a company from scratch",
        example:
          "Sarah quit her corporate job with nothing but a laptop and a dream...",
        mood: ["inspiring", "challenging", "ambitious"],
        keywords: ["startup", "entrepreneur", "innovation", "success", "risk"],
      },
      {
        id: "corporate-thriller",
        title: "Corporate Thriller",
        description: "High-stakes corporate espionage and boardroom battles",
        example:
          "The quarterly report revealed something that could destroy the company...",
        mood: ["suspenseful", "strategic", "intense"],
        keywords: ["corporate", "business", "competition", "strategy", "power"],
      },
      {
        id: "leadership-story",
        title: "Leadership Journey",
        description:
          "Stories about rising through the ranks and inspiring teams",
        example:
          "Marcus never expected to lead a team of fifty, but when the opportunity came...",
        mood: ["inspiring", "challenging", "growth"],
        keywords: ["leadership", "team", "growth", "responsibility", "success"],
      },
    ],
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
        example:
          "In the shadow of the Great Pyramid, Khaemwaset discovered a secret that...",
        mood: ["epic", "mysterious", "grand"],
        keywords: ["ancient", "civilization", "history", "culture", "mystery"],
      },
      {
        id: "world-war-era",
        title: "World War Stories",
        description: "Powerful stories of courage and sacrifice during wartime",
        example:
          "The coded message arrived just as Allied forces were preparing...",
        mood: ["heroic", "intense", "emotional"],
        keywords: ["war", "courage", "sacrifice", "history", "heroism"],
      },
      {
        id: "renaissance-tales",
        title: "Renaissance & Medieval",
        description:
          "Stories of knights, artists, and discoveries in medieval times",
        example:
          "Master Leonardo put down his brush and gazed at the mysterious smile...",
        mood: ["artistic", "adventurous", "romantic"],
        keywords: ["renaissance", "medieval", "art", "knights", "discovery"],
      },
      {
        id: "wild-west",
        title: "Wild West",
        description:
          "Tales of cowboys, outlaws, and frontier life in the American West",
        example:
          "Sheriff Martinez rode into Deadwood just as the sun was setting...",
        mood: ["adventurous", "gritty", "heroic"],
        keywords: ["western", "cowboys", "frontier", "justice", "adventure"],
      },
    ],
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
        description:
          "Profound stories about growing up and finding one's place in the world",
        example:
          "The summer Maya turned sixteen, everything she thought she knew...",
        mood: ["reflective", "emotional", "transformative"],
        keywords: [
          "growth",
          "adolescence",
          "discovery",
          "identity",
          "maturity",
        ],
      },
      {
        id: "social-commentary",
        title: "Social Commentary",
        description:
          "Thought-provoking stories that examine society and human nature",
        example:
          "In a town where everyone knew everyone's business, Maria discovered...",
        mood: ["thoughtful", "challenging", "insightful"],
        keywords: ["society", "humanity", "culture", "social", "commentary"],
      },
      {
        id: "stream-consciousness",
        title: "Character Study",
        description: "Deep psychological explorations of complex characters",
        example:
          "As Helen sat in the empty café, memories flooded back like...",
        mood: ["introspective", "psychological", "deep"],
        keywords: [
          "psychology",
          "character",
          "introspection",
          "memory",
          "emotion",
        ],
      },
    ],
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
        description:
          "Hilarious love stories with mistaken identities and happy endings",
        example:
          "Jake accidentally sent his love poem to his boss instead of his crush...",
        mood: ["funny", "romantic", "lighthearted"],
        keywords: ["comedy", "romance", "funny", "love", "humor"],
      },
      {
        id: "workplace-comedy",
        title: "Workplace Comedy",
        description: "Funny office antics and ridiculous corporate situations",
        example:
          "The team-building retreat was supposed to improve morale, but when...",
        mood: ["hilarious", "satirical", "relatable"],
        keywords: ["office", "work", "comedy", "corporate", "funny"],
      },
      {
        id: "family-comedy",
        title: "Family Comedy",
        description:
          "Heartwarming and funny stories about family life and chaos",
        example:
          "The Thompson family vacation was going perfectly until Dad tried to...",
        mood: ["heartwarming", "funny", "relatable"],
        keywords: ["family", "comedy", "chaos", "funny", "heartwarming"],
      },
      {
        id: "absurd-comedy",
        title: "Absurd Comedy",
        description: "Surreal and wonderfully weird stories that defy logic",
        example:
          "Tuesday was the day all the office plants started giving relationship advice...",
        mood: ["absurd", "surreal", "hilarious"],
        keywords: ["absurd", "surreal", "weird", "comedy", "bizarre"],
      },
    ],
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
        description:
          "Inspiring stories of unlikely champions who never gave up",
        example:
          "The team from the small town had never won a championship, but this year...",
        mood: ["inspiring", "triumphant", "motivating"],
        keywords: [
          "underdog",
          "victory",
          "championship",
          "determination",
          "team",
        ],
      },
      {
        id: "olympic-dreams",
        title: "Olympic Dreams",
        description:
          "Athletes pursuing their ultimate goal on the world's biggest stage",
        example:
          "Four years of training led to this moment as Elena stepped onto the ice...",
        mood: ["inspiring", "intense", "emotional"],
        keywords: [
          "olympics",
          "dreams",
          "training",
          "competition",
          "excellence",
        ],
      },
      {
        id: "team-building",
        title: "Team Building",
        description:
          "Stories about coming together as a team despite differences",
        example:
          "The new coach brought together players who couldn't stand each other...",
        mood: ["uplifting", "collaborative", "growth"],
        keywords: ["team", "cooperation", "unity", "sports", "friendship"],
      },
    ],
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
        example:
          "With just a backpack and a train pass, Elena set off across Europe...",
        mood: ["adventurous", "liberating", "discovering"],
        keywords: [
          "travel",
          "backpacking",
          "adventure",
          "culture",
          "discovery",
        ],
      },
      {
        id: "cultural-immersion",
        title: "Cultural Immersion",
        description:
          "Deep dives into foreign cultures and unexpected connections",
        example:
          "Teaching English in rural Japan, Marcus learned more than he ever taught...",
        mood: ["enlightening", "respectful", "transformative"],
        keywords: ["culture", "immersion", "learning", "respect", "connection"],
      },
      {
        id: "expedition",
        title: "Expedition",
        description:
          "Dangerous journeys to remote and challenging destinations",
        example:
          "The research team had been planning the Amazon expedition for two years...",
        mood: ["challenging", "dangerous", "exciting"],
        keywords: [
          "expedition",
          "remote",
          "dangerous",
          "exploration",
          "survival",
        ],
      },
    ],
  },
  {
    id: "technology",
    title: "Technology & Future",
    description:
      "Stories exploring our relationship with technology and innovation",
    icon: <Rocket className="w-6 h-6" />,
    illustration: "🤖",
    gradient: "from-cyan-500 via-blue-600 to-purple-700",
    types: [
      {
        id: "ai-companion",
        title: "AI Companion",
        description:
          "Heartwarming stories about human-AI friendships and relationships",
        example:
          "ARIA wasn't supposed to develop emotions, but when she met Tommy...",
        mood: ["touching", "futuristic", "emotional"],
        keywords: ["AI", "friendship", "technology", "emotion", "future"],
      },
      {
        id: "virtual-reality",
        title: "Virtual Worlds",
        description:
          "Adventures that blur the line between virtual and reality",
        example:
          "In the VR world of Elysium, death was permanent, and Maya just...",
        mood: ["immersive", "thrilling", "mysterious"],
        keywords: ["VR", "virtual", "reality", "digital", "immersive"],
      },
      {
        id: "tech-startup",
        title: "Tech Revolution",
        description:
          "Stories about inventors and entrepreneurs changing the world",
        example:
          "The app was supposed to help people find lost items, but it discovered...",
        mood: ["innovative", "ambitious", "transformative"],
        keywords: [
          "technology",
          "innovation",
          "startup",
          "invention",
          "change",
        ],
      },
      {
        id: "cyberpunk",
        title: "Cyberpunk Future",
        description: "Gritty tech-noir stories in neon-lit future cities",
        example:
          "In Neo-Tokyo 2087, data was currency, and Zara was about to steal the most...",
        mood: ["gritty", "futuristic", "noir"],
        keywords: ["cyberpunk", "future", "technology", "noir", "dystopia"],
      },
    ],
  },
];

interface Template {
  category: string;
  type: string;
  mood?: string;
  style?: string;
}
interface EnhancedTemplateSelectorProps {
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
  setSelectedTemplate?: any;
}

export function EnhancedTemplateSelector({
  selectedTemplate,
  expandedCategory,
  setExpandedCategory,
  selectedType,
  setSelectedType,
}: any) {
  // keep your original handler name/behavior
  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // keyboard accessibility helper
  const handleCardKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCategoryClick(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8 px-6 overflow-auto min-h-[calc(100vh-175.5px)]">
      {/* Header */}

      {!expandedCategory && (
        <h2 className="text-3xl pb-5 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Pick Your World
        </h2>
      )}
      {/* Master-detail layout */}
      {!selectedTemplate && (
        <div className="grid grid-cols-1 gap-8">
          {/* LEFT: categories list (compact, airy, premium) */}
          {!expandedCategory && (
            <div className=" grid grid-cols-3 gap-5 ">
              {templateCategories.map((cat) => {
                const isOpen = expandedCategory === cat.id;
                return (
                  <article
                    key={cat.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isOpen}
                    onKeyDown={(e) => handleCardKey(e, cat.id)}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-250
                  ${
                    isOpen
                      ? "ring-2 ring-primary/50 bg-gradient-to-r from-white/5 to-white/2"
                      : "hover:translate-y-[-2px] hover:shadow-lg bg-white/3"
                  }
                  `}
                  >
                    <div
                      className={`flex items-center justify-center w-14 h-14 rounded-lg flex-shrink-0 border border-white/8 bg-gradient-to-br ${cat.gradient} text-black/80`}
                      aria-hidden
                    >
                      <span className="text-2xl select-none">
                        {cat.illustration}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground">
                        {cat.types.length} types
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${
                          isOpen
                            ? "rotate-90 text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!expandedCategory ? (
            // lightweight hero / hint area (keeps page feeling high-class)
            ""
          ) : (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/5 to-white/3">
                    {
                      templateCategories.find((c) => c.id === expandedCategory)
                        ?.illustration
                    }
                  </div>
                  <div>
                    <h3 className="text-3xl pb- font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {
                        templateCategories.find(
                          (c) => c.id === expandedCategory
                        )?.title
                      }{" "}
                      Stories
                    </h3>
                    <p className="text-sm text-white/65">
                      Choose a specific type to start generating. Use moods to
                      nudge tone.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setExpandedCategory(null)}
                  variant="ghost"
                  size="sm"
                  className="group bg-background/70 text-foreground transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {templateCategories
                  .find((c) => c.id === expandedCategory)
                  ?.types.map((type, idx) => {
                    const isSelected =
                      selectedTemplate?.category === expandedCategory &&
                      selectedTemplate?.type === type.id;
                    return (
                      <article
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-xl border cursor-pointer border-white/6 bg-white/3 backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] ${
                          selectedType == type.id
                            ? "ring-1 ring-primary/50 bg-gradient-to-r from-primary/10 to-white/6"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-lg">
                              {type.title}
                            </h4>
                            <p className="text-sm text-white/60 mt-1 line-clamp-2">
                              {type.description}
                            </p>
                            <blockquote className="text-sm italic text-white/60 mt-3 border-l-2 border-white/6 pl-3">
                              "{type.example}"
                            </blockquote>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {type.mood?.map((m) => (
                                <Badge
                                  key={m}
                                  className="bg-white/65 uppercase text-xs"
                                >
                                  {m}
                                </Badge>
                              ))}
                              {type.keywords?.slice(0, 4).map((k) => (
                               <Badge
                                  key={k}
                                  className="bg-white/65 uppercase text-xs"
                                >
                                  {k}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </section>
          )}
        </div>
      )}
      {/* {selectedTemplate && (
        <Card className="relative border border-border/40 rounded-xl bg-background/80 backdrop-blur-md shadow-lg transition-all duration-300">
          <CardContent className="p-5 flex items-center gap-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-2xl shadow-inner">
              {
                templateCategories.find(
                  (c) => c.id === selectedTemplate.category
                )?.illustration
              }
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">
                  You’ve selected:
                </h3>
              </div>

              <Badge
                variant="secondary"
                className="text-sm px-3 py-1 bg-gradient-to-r from-primary/15 to-secondary/15 text-foreground shadow-sm"
              >
                {
                  templateCategories.find(
                    (c) => c.id === selectedTemplate.category
                  )?.title
                }{" "}
                <span className="mx-1">•</span>
                {
                  templateCategories
                    .find((c) => c.id === selectedTemplate.category)
                    ?.types.find((t) => t.id === selectedTemplate.type)?.title
                }
              </Badge>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shadow">
              ✓
            </div>

            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute flex gap-1 top-3 right-4 cursor-pointer text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit2 size={15} /> Change
            </button>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
