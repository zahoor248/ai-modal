// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";
import HeroSection from "@/components/homepage/HeroSection";
import PremiumHeader from "@/components/homepage/PremiumHeader";
import TrustBar from "@/components/homepage/TrustBar";
/**
 * Full landing page that:
 * - Restores all sections you had
 * - Reads `theme` from next-themes and applies a mapped Tailwind background/text class
 * - Theme cards call setTheme(...) and the landing updates immediately
 *
 * Notes:
 * - This file avoids next/image to remove extra Next config for external assets.
 * - If you want image optimization, add images to /public and switch to next/image.
 */

/* ---------- theme → page classes (controls main bg + text color) ---------- */
const THEME_CLASSES: Record<string, string> = {
  dreamland:
    "bg-gradient-to-b from-pink-100 via-purple-200 to-indigo-200 text-gray-900",
  midnight:
    "bg-gradient-to-b from-gray-900 via-indigo-900 to-black text-gray-100",
  forest:
    "bg-gradient-to-b from-emerald-900 via-green-800 to-black text-emerald-100",
  galaxy:
    "bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-indigo-50",
  paper:
    "bg-gradient-to-b from-yellow-50 via-gray-100 to-gray-200 text-gray-900",
  warm: "bg-gradient-to-b from-orange-50 via-amber-100 to-rose-100 text-gray-900",
  ocean: "bg-gradient-to-b from-blue-50 via-cyan-100 to-white text-gray-900",
  sunset:
    "bg-gradient-to-b from-orange-200 via-pink-300 to-purple-400 text-gray-900",
  dark: "bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white",
  light: "bg-white text-gray-900",
};

/* ---------- small presentational components ---------- */
function CTAButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full px-6 py-3 text-white font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 shadow-2xl hover:scale-[1.03] transition-transform">
      {children}
    </button>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full px-5 py-2 border border-white/10 text-white/90 hover:bg-white/5 transition">
      {children}
    </button>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{number}</div>
      <div className="text-xs text-current/60">{label}</div>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  emoji,
}: {
  title: string;
  desc: string;
  emoji?: string;
}) {
  return (
    <article className="relative rounded-2xl overflow-hidden shadow-xl bg-white/5 border border-white/6 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-none w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-2xl">
          {emoji ?? "📖"}
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-1">{title}</h4>
          <p className="text-sm text-current/70">{desc}</p>
        </div>
      </div>
    </article>
  );
}

function PriceCard({
  title,
  price,
  perks,
  highlighted = false,
}: {
  title: string;
  price: string;
  perks: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 ${
        highlighted
          ? "bg-gradient-to-br from-pink-600 to-indigo-600 text-white"
          : "bg-white/5 text-current"
      } border border-white/6 shadow-lg`}
    >
      <div className="text-lg font-semibold mb-2">{title}</div>
      <div className="text-3xl font-bold mb-3">{price}</div>
      <ul className="text-sm space-y-2 mb-4">
        {perks.map((p, i) => (
          <li key={i}>✔ {p}</li>
        ))}
      </ul>
      <button
        className={`w-full py-2 rounded-full font-semibold ${
          highlighted ? "bg-white text-purple-900" : "bg-white/10"
        }`}
      >
        Choose
      </button>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl p-6 bg-white/4 border border-white/6">
      <div className="font-semibold mb-2">{q}</div>
      <div className="text-sm text-current/70">{a}</div>
    </div>
  );
}

/* ---------- ThemeCard component (click to set theme) ---------- */
function ThemeCard({
  themeKey,
  label,
  previewImage,
}: {
  themeKey: string;
  label?: string;
  previewImage?: string;
}) {
  const { setTheme, theme: currentTheme } = useTheme();
  const active = currentTheme === themeKey;

  return (
    <button
      onClick={() => setTheme(themeKey)}
      className={`min-w-[220px] rounded-2xl p-4 border shadow-md transition flex-shrink-0 text-left
        ${
          active
            ? "ring-2 ring-indigo-400 border-white/80"
            : "border-white/10 hover:border-white/30"
        }`}
      aria-pressed={active}
    >
      <img src={previewImage} className="h-40 rounded-md w-56 mb-2" />
      <div className="font-semibold capitalize">{label ?? themeKey}</div>
    </button>
  );
}

/* ---------- Mock content ---------- */
const mockStories = [
  {
    title: "The Little Star's Journey",
    category: "Kids",
    preview: "Once upon a time, in the vast expanse of the night sky...",
    image: "/little-star.png",
    likes: 127,
  },
  {
    title: "Finding Courage in the Storm",
    category: "Inspirational",
    image: "/courage-instorm.png",
    preview: "Sarah had always been afraid of thunderstorms...",
    likes: 89,
  },
  {
    title: "The Secret Garden of Memories",
    category: "Adventure",
    image: "/secret.png",
    preview: "Behind the old oak tree in grandmother's backyard...",
    likes: 156,
  },
];

/* ---------- Main page ---------- */
export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Make sure theme-dependent rendering only runs after hydration
  useEffect(() => setMounted(true), []);

  // fallback theme while SSR
  const activeThemeKey = mounted ? theme ?? "midnight" : "midnight";
  const appliedThemeClasses =
    THEME_CLASSES[activeThemeKey] ?? THEME_CLASSES["midnight"];

  return (
    <main className={`${appliedThemeClasses} min-h-screen  duration-300`}>
      <PremiumHeader/>
<HeroSection />
     <section id="testimonials" className="py-20 bg-gradient-to-br from-muted/10 to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
              📱 Loved by Creators
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Content That Goes Viral
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Join thousands of creators who've transformed their ideas into viral social media content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 mb-4 italic">
                "StoryBuds helped me create viral Instagram posts that boosted my engagement by 300%. The AI understands exactly what my audience wants."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500" />
                <div>
                  <div className="font-semibold text-sm">Sarah Chen</div>
                  <div className="text-xs text-foreground/60">Lifestyle Influencer</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 mb-4 italic">
                "As a content creator, this platform has revolutionized my posting process. I can create compelling content for all platforms in minutes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500" />
                <div>
                  <div className="font-semibold text-sm">Marcus Rivera</div>
                  <div className="text-xs text-foreground/60">Digital Marketer</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 mb-4 italic">
                "The scheduling features are incredible! My clients love how consistently I can post across all their social platforms."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                <div>
                  <div className="font-semibold text-sm">Emily Johnson</div>
                  <div className="text-xs text-foreground/60">Social Media Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TrustBar />
      {/* MODERN NAVIGATION */}
  

      {/* TESTIMONIALS SECTION */}
 

      {/* HOW IT WORKS - PREMIUM DESIGN */}
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              🚀 Simple Process
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              From Idea to
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Story </span>
              in Minutes
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Our AI-powered platform makes storytelling effortless. Just describe your vision,
              and watch it transform into compelling narratives.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="relative group">
              <div className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    ✍️
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-primary">01</span>
                    <h3 className="text-xl font-semibold">Describe Your Vision</h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    Share your story idea, characters, or theme. Our intelligent prompts guide you through the creative process.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    ✨
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-primary">02</span>
                    <h3 className="text-xl font-semibold">AI Creates Magic</h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    Watch as advanced AI transforms your concept into a beautifully crafted story with rich characters and plot.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    🚀
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-primary">03</span>
                    <h3 className="text-xl font-semibold">Publish & Share</h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    Export as PDF, audio, or eBook. Share with the world or keep it private - the choice is yours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              🎯 Try it Now - It's Free
            </Link>
            <p className="text-sm text-foreground/60 mt-4">No credit card required • Start creating in 30 seconds</p>
          </div>
        </div>
      </section>

      {/* FEATURES (illustrated cards) */}
      <section id="features" className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            What we offer
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              emoji="🪄"
              title="AI-Powered Creation"
              desc="Generate heartfelt stories and professional books in seconds."
            />
            <FeatureCard
              emoji="🎧"
              title="Audio Narration"
              desc="Natural TTS to bring every story to life — save MP3s."
            />
            <FeatureCard
              emoji="🔗"
              title="Share Everywhere"
              desc="Export PDF, ePub, audio and share social cards across platforms."
            />
            <FeatureCard
              emoji="🎨"
              title="Custom Themes"
              desc="Personalize your workspace — cozy, classic, or modern."
            />
            <FeatureCard
              emoji="🏆"
              title="Competitions"
              desc="Enter monthly contests, get votes, and win prizes."
            />
            <FeatureCard
              emoji="🌍"
              title="Community & Ratings"
              desc="Publish to the feed, get rated, and build an audience."
            />
          </div>
        </div>
      </section>

      {/* THEMES (functional) */}
      <section id="themes" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">
            Your Story, Your Space
          </h3>
          <p className="text-sm text-current/70 max-w-2xl mb-6">
            Pick a theme that inspires — from Dreamland to Ocean, Galaxy to
            Candyland. Click to apply instantly.
          </p>

          <div className="flex gap-4 overflow-x-auto p-2">
            {/* Existing */}
            <ThemeCard
              themeKey="dreamland"
              label="Dreamland"
              previewImage="/dreamland.png"
            />
            <ThemeCard
              themeKey="midnight"
              label="Midnight"
              previewImage="/midnight.png"
            />
            <ThemeCard
              themeKey="forest"
              label="Forest"
              previewImage="/forest.png"
            />
            <ThemeCard
              themeKey="galaxy"
              label="Galaxy"
              previewImage="/galaxy.png"
            />
            <ThemeCard
              themeKey="paper"
              label="Paper"
              previewImage="/paper.png"
            />
            <ThemeCard themeKey="warm" label="Warm" previewImage="/warm.png" />
            <ThemeCard
              themeKey="ocean"
              label="Ocean"
              previewImage="/ocean.png"
            />

            {/* New playful ones */}
            <ThemeCard
              themeKey="sunset"
              label="Sunset"
              previewImage="/sunset.png"
            />
            {/* <ThemeCard
              themeKey="icecream"
              label="Ice Cream"
              previewGradient="from-pink-200 via-yellow-100 to-blue-200"
            /> */}
            {/* <ThemeCard
              themeKey="rainbow"
              label="Rainbow"
              previewGradient="from-red-400 via-yellow-400 to-green-400"
            /> */}
            {/* <ThemeCard
              themeKey="fairytale"
              label="Fairy Tale"
              previewGradient="from-purple-300 via-pink-200 to-indigo-300"
            />
            <ThemeCard
              themeKey="space"
              label="Outer Space"
              previewGradient="from-black via-indigo-900 to-purple-900"
            />
            <ThemeCard
              themeKey="mint"
              label="Mint"
              previewGradient="from-teal-200 to-green-300"
            /> */}
          </div>
        </div>
      </section>

      {/* TRENDING STORIES */}
      <section id="trending" className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Stories that inspire</h3>
            <a className="text-sm text-current/70 hover:text-white">
              See all →
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockStories.map((s, i) => (
              <article
                key={i}
                className="rounded-2xl p-6 bg-white/5 border border-white/6 shadow-md hover:scale-105 transition"
              >
                <img
                  src={s.image}
                  className="h-60 w-full object-fill rounded-md mb-4 bg-gradient-to-br from-indigo-600 to-pink-500"
                />
                <h4 className="font-playfair text-xl mb-2">{s.title}</h4>
                <p className="text-sm text-current/70 line-clamp-3">
                  {s.preview}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-current/70">
                  <div>❤ {s.likes}</div>
                  <button className="px-3 py-1 rounded-md bg-white/10">
                    Read
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto rounded-2xl p-8 bg-gradient-to-br from-purple-800/30 to-black/20 border border-white/6 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold">Join the Storytellers</h3>
              <p className="text-current/70 max-w-xl mt-2">
                Share your stories, get feedback, join competitions and grow an
                audience that loves your voice.
              </p>
            </div>
            <div className="flex gap-4">
              {/* <CTAButton>Join Community</CTAButton> */}
              <SecondaryButton>Explore Top Stories</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl p-8 bg-gradient-to-br from-purple-800/30 to-black/30 border border-white/6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold">
                Monthly Story Competitions
              </h3>
              <p className="text-current/70 max-w-lg mt-2">
                Enter themed competitions, collect votes, and win cash prizes or
                platform credits. Community-driven & judged by pros.
              </p>
            </div>
            <div className="flex gap-3">
              {/* <CTAButton>Enter Competition</CTAButton> */}
              <SecondaryButton>Coming soon</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Plans for Every Dreamer
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PriceCard
              title="Free"
              price="$0"
              perks={["5 stories / month", "Audio playback", "Community feed"]}
            />
            <PriceCard
              title="Pro"
              price="$12/mo"
              perks={["Unlimited stories", "Premium themes", "Export & print"]}
              highlighted
            />
            <PaddleCheckoutButton
              productId="12345" // your Paddle product ID
              planName="Pro Plan Monthly"
              priceDisplay="$12 / month - Pay with Card"
            />
            <PriceCard
              title="Creator"
              price="$29/mo"
              perks={[
                "Video export",
                "Competition entries",
                "Monetization tools",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">FAQ</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQItem
              q="Do I own my stories?"
              a="Yes — you keep full ownership and can export or publish anytime."
            />
            <FAQItem
              q="Is content safe for kids?"
              a="We provide family-friendly templates and moderation tools for safe usage."
            />
            <FAQItem
              q="How do competitions work?"
              a="Each month we host a theme, users enter with an entry fee, voting is community-driven and winners get rewards."
            />
            <FAQItem
              q="Can I monetize videos?"
              a="Yes — exporting videos and sharing to monetized platforms like YouTube is supported for Creator plans."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl p-10 bg-gradient-to-br from-pink-600 to-indigo-700 shadow-2xl border border-white/6">
            <h2 className="text-3xl font-semibold mb-3">
              Your Story Deserves to Be Told
            </h2>
            <p className="text-sm text-current/70 mb-6">
              Start free today — join a community of storytellers and turn words
              into magic.
            </p>
            <CTAButton>Start Writing Now</CTAButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/6 py-8 text-center text-sm text-current/60">
        <div className="container mx-auto px-6">
          © {new Date().getFullYear()} StoryWeaver — Where every story finds its
          voice
        </div>
      </footer>
    </main>
  );
}
