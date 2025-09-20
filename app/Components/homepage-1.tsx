// app/page.tsx
"use client";
import React from "react";
import clsx from "clsx";

function GlowBlob({ className = "" }: { className?: string }) {
  return (
    <div
      className={clsx(
        "pointer-events-none absolute rounded-full filter blur-3xl opacity-60",
        className
      )}
    />
  );
}

export default function Page() {
  return (
    <main className="relative overflow-hidden text-white">
      {/* decorative glow blobs */}
      <GlowBlob className="w-[480px] h-[480px] bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-500 -top-40 -right-20" />
      <GlowBlob className="w-[360px] h-[360px] bg-gradient-to-br from-yellow-400 via-green-400 to-teal-400 -bottom-32 -left-28 opacity-30" />

      {/* NAV */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-400 to-indigo-600 flex items-center justify-center shadow-xl">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M3 7.5C3 5 5 3 7.5 3h9C19 3 21 5 21 7.5v9C21 19 19 21 16.5 21h-9C5 21 3 19 3 16.5v-9z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <div className="font-bold text-xl bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">StoryBuds</div>
            <div className="text-xs text-gray-300 -mt-1">AI Storytelling</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#trending" className="hover:text-white">
            Trending
          </a>
          <a href="#themes" className="hover:text-white">
            Themes
          </a>
          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
          <button className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg">
            Start Writing
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-playfair leading-tight mb-6">
            Create stories that{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-300">
              captivate hearts
            </span>{" "}
            — instantly.
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mb-8">
            Turn imagination into bedtime tales, books, or shareable audio — AI
            helps you write, narrate, and publish. Save to your shelf, join the
            community, and inspire the world.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 shadow-xl font-semibold hover:scale-105 transition">
              Start Free — No Card
            </button>
            <button className="px-6 py-3 rounded-full border border-white/10 text-white/90 hover:bg-white/5 transition">
              Join Community
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 text-sm text-gray-300">
            <Stat number="10k+" label="Stories created" />
            <Stat number="8k+" label="Happy readers" />
            <Stat number="2k+" label="Community members" />
          </div>
        </div>

        {/* right visual */}
        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl p-6 bg-gradient-to-b from-white/3 to-white/2 backdrop-blur-sm border border-white/6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-20 h-24 rounded-md bg-gradient-to-br from-indigo-600 to-pink-500 shadow-inner" />
              <div className="flex-1">
                <div className="text-sm text-gray-300">Sample Story</div>
                <h3 className="font-playfair text-xl text-white mt-2">
                  The Little Star's Journey
                </h3>
                <p className="text-gray-300 mt-3 text-sm line-clamp-4">
                  Once upon a time, in a sky full of dreams, a small star
                  learned how to shine by believing in a child who whispered
                  wishes...
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button className="px-3 py-2 rounded-md bg-white/10 text-white text-sm">
                    ▶ Listen
                  </button>
                  <button className="px-3 py-2 rounded-md bg-white/5 text-white text-sm">
                    Save
                  </button>
                  <button className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-white/90 text-sm">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* floating mini-cards */}
          <div className="absolute -bottom-8 -left-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg transform rotate-6"></div>
          <div className="absolute -top-10 -right-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-green-300 opacity-80 shadow-md transform -rotate-6"></div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-fredoka text-center mb-12 text-pink-600 drop-shadow-md">
          What We Offer ✨
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="AI-Powered Creation"
            desc="Generate heartfelt stories and professional books in seconds."
            icon="✍️"
            image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b" // writing bg
          />
          <FeatureCard
            title="Audio Narration"
            desc="Natural TTS to bring every story to life — save MP3s."
            icon="🎧"
            image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4" // headphones bg
          />
          <FeatureCard
            title="Share Everywhere"
            desc="Export PDF, ePub, audio and share across platforms."
            icon="🔗"
            image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" // social bg
          />
          <FeatureCard
            title="Custom Themes"
            desc="Personalize your workspace — cozy, classic, or modern."
            icon="🎨"
            image="https://images.unsplash.com/photo-1607083206968-13611e9a6eb4" // themes bg
          />
          <FeatureCard
            title="Competitions"
            desc="Enter monthly contests, get votes, and win prizes."
            icon="🏆"
            image="https://images.unsplash.com/photo-1600962815726-457c5c07a1c1" // trophy bg
          />
          <FeatureCard
            title="Community & Ratings"
            desc="Publish to the feed, get rated, and build an audience."
            icon="🌍"
            image="https://images.unsplash.com/photo-1492724441997-5dc865305da7" // community bg
          />
        </div>
      </section>

      {/* VISION */}
      <section className="container mx-auto px-6 py-12 text-center">
        <blockquote className="max-w-3xl mx-auto text-gray-300 italic">
          “We believe every child, every dreamer, every creator has a story
          worth telling. StoryBuds gives your words a voice and a home.”
        </blockquote>
      </section>

      {/* TRENDING */}
      <section id="trending" className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-playfair">Trending Stories</h3>
          <a className="text-sm text-gray-300 hover:text-white">See all →</a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "The Secret Garden", likes: 156 },
            { title: "Finding Courage", likes: 89 },
            { title: "Starlight Promise", likes: 127 },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-gradient-to-br from-white/4 to-white/6 border border-white/6 shadow-lg hover:scale-105 transition"
            >
              <div className="h-40 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 mb-4" />
              <h4 className="font-playfair text-xl mb-2">{s.title}</h4>
              <p className="text-gray-300 text-sm">
                Short excerpt to spark curiosity and invite a click.
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                <div>❤ {s.likes}</div>
                <button className="px-3 py-1 rounded-md bg-white/10">
                  Read
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THEMES */}
      <section
        id="themes"
        className="container mx-auto px-6 py-16 bg-gradient-to-b from-black/30 to-transparent rounded-3xl"
      >
        <h3 className="text-2xl font-playfair mb-6 text-center">
          Your Story, Your Space
        </h3>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
          Pick a theme that inspires — cozy bedtime, parchment, galaxy, or a
          clean author editor. Themes change fonts, colors, and ambience.
        </p>

        <div className="flex gap-4 overflow-x-auto py-2">
          {["Dreamland", "Midnight", "Forest", "Galaxy", "Author"].map(
            (t, idx) => (
              <div
                key={idx}
                className="min-w-[220px] p-4 rounded-2xl bg-gradient-to-br from-white/4 to-white/6 border border-white/6 shadow-md hover:scale-105 transition"
              >
                <div className="h-36 rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 mb-4" />
                <div className="font-semibold">{t}</div>
                <div className="text-sm text-gray-300 mt-2">
                  Preview how your editor will feel.
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Competitions */}
      <section className="container mx-auto px-6 py-16">
        <div className="rounded-2xl bg-gradient-to-br from-purple-800/40 to-black/40 p-8 border border-white/6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-playfair">
              Monthly Story Competitions
            </h3>
            <p className="text-gray-300 max-w-xl mt-2">
              Enter themed competitions, collect votes, and win cash prizes or
              platform credits. Community-driven & judged by pros.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 text-black font-semibold shadow">
              Enter Competition
            </button>
            <button className="px-6 py-3 rounded-full border border-white/10">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="container mx-auto px-6 py-16">
        <h3 className="text-2xl font-playfair mb-8 text-center">
          Plans for Every Dreamer
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <PriceCard
            title="Free"
            price="$0"
            perks={["5 stories / mo", "Audio playback", "Community feed"]}
          />
          <PriceCard
            title="Pro"
            price="$12/mo"
            perks={["Unlimited stories", "Premium themes", "Export & print"]}
            highlighted
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
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-6 py-16">
        <h3 className="text-2xl font-playfair mb-8 text-center">FAQ</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FAQ
            q="Do I own my stories?"
            a="Yes — you retain full ownership and can export or publish anytime."
          />
          <FAQ
            q="Is content safe for kids?"
            a="We provide family-friendly templates and moderation tools designed for safe usage."
          />
          <FAQ
            q="How do competitions work?"
            a="Each month we host a theme, users enter with an entry fee, voting is community-driven and winners get rewards."
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="rounded-2xl p-12 bg-gradient-to-br from-pink-600 to-indigo-700 shadow-2xl border border-white/6">
          <h2 className="text-3xl font-playfair mb-4">
            Your Story Deserves to Be Told
          </h2>
          <p className="text-gray-200 mb-6">
            Start free today and join a community of storytellers turning words
            into magic.
          </p>
          <button className="px-8 py-3 rounded-full bg-white text-purple-900 font-bold shadow-lg hover:scale-105 transition">
            Start Writing Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/6 mt-8 py-8 text-center text-sm text-gray-400">
        <div className="container mx-auto px-6">
          © {new Date().getFullYear()} StoryBuds — Where every story finds its
          voice
        </div>
      </footer>
    </main>
  );
}

/* small components below */

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-2xl font-bold">{number}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
const FeatureCard: React.FC<any> = ({ title, desc, icon }) => {
  return (
    <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg hover:shadow-pink-500/40 transition group">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition"></div>

      <div className="relative z-10 text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{desc}</p>
      </div>
    </div>
  );
};


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
          ? "bg-gradient-to-br from-pink-600 to-indigo-600"
          : "bg-white/4"
      } border border-white/6 shadow-xl`}
    >
      <div className="font-playfair text-xl mb-2">{title}</div>
      <div className="text-3xl font-bold mb-4">{price}</div>
      <ul className="text-sm text-gray-200 space-y-2 mb-4">
        {perks.map((p, i) => (
          <li key={i}>✔ {p}</li>
        ))}
      </ul>
      <button
        className={`w-full py-2 rounded-full font-semibold ${
          highlighted ? "bg-white text-purple-900" : "bg-white/10 text-white"
        }`}
      >
        Choose
      </button>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl p-6 bg-white/3 border border-white/6">
      <div className="font-semibold mb-2">{q}</div>
      <div className="text-sm text-gray-300">{a}</div>
    </div>
  );
}
