// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import PaddleCheckoutButton from "@/components/PaddleCheckoutButton";

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
      {/* NAV */}
      <header className="container h-20 overflow-hidden mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/StoryBuds/StoryBuds-logo-transparent.png"
            alt="Logo"
            className="w-full h-full max-w-[140px] object-contain"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-current/70">
          <a href="#features" className="hover:opacity-70">
            Features
          </a>
          <a href="#trending" className="hover:opacity-70">
            Trending
          </a>
          <a href="#themes" className="hover:opacity-70">
            Themes
          </a>
          <a href="#pricing" className="hover:opacity-70">
            Pricing
          </a>
          <a href="#faq" className="hover:opacity-70">
            FAQ
          </a>
          <Link href={"/register"} className="button-primary">
            REGISTER
          </Link>
        </nav>
      </header>

      {/* HERO (magical kid + wand feel) */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight font-bold mb-6">
            Turn imagination into{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-300">
              magical stories
            </span>
            .
          </h1>
          <p className="text-lg text-current/70 mb-8">
            AI-powered storytelling for bedtime tales, books, audio and videos.
            Create, listen, and share stories that touch hearts.
          </p>

          <div className="flex gap-4 items-center">
            <Link href={"/register"} className="button-primary !rounded-full">
              Start Free — No Card
            </Link>
            <button className="px-6 py-3 rounded-full border border-white/10">
              Join Community
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-current/70">
            <Stat number="10k+" label="Stories created" />
            <Stat number="8k+" label="Happy readers" />
            <Stat number="2k+" label="Community members" />
          </div>
        </div>

        <div className="relative hidden md:block">
          {/* Illustration placeholder (replace with proper SVG or image in /public for production) */}
          <div className="rounded-2xl p-6 bg-white/6 backdrop-blur-md border border-white/8 shadow-2xl">
            <div className="flex gap-4 items-start">
              <div className="w-52 h-36 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-4xl">
                <img
                  src="/A-Special-Friendship-Story-With-Moral-for-Kids.jpg"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <h3 className="font-semibold text-2xl mt-2">
                  The Little Star's Journey
                </h3>
                <p className="text-sm text-current/70 mt-3 line-clamp-4">
                  Once upon a time, in a sky full of dreams, a small star
                  learned how to shine by believing in a child who whispered
                  wishes...
                </p>

                <div className="mt-4 flex gap-3">
                  <button className="px-3 py-2 rounded-md bg-white/10">
                    ▶ Listen
                  </button>
                  <button className="px-3 py-2 rounded-md bg-white/5">
                    Save
                  </button>
                  <button className="px-3 py-2 rounded-md border border-white/10">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* decorative orbs */}
          <div className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 blur-3xl opacity-60" />
          <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-green-300 blur-2xl opacity-40" />
        </div>
      </section>

      {/* VISION */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            We believe every voice deserves a stage
          </h2>
          <p className="text-current/70">
            From bedtime tales to publish-ready books — StoryWeaver turns
            imagination into shareable stories that bond families, classrooms,
            and communities.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">
            How it works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              emoji="✍️"
              title="Create"
              desc="Start with a template or a prompt — AI writes your story in moments."
            />
            <FeatureCard
              emoji="🎧"
              title="Listen"
              desc="Natural TTS narration makes every tale come alive."
            />
            <FeatureCard
              emoji="🔗"
              title="Share"
              desc="Export PDF, ePub, audio or publish to the community feed."
            />
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
