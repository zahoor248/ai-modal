"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, User, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function AuthPage({ login }: { login?: boolean }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { notify } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || (!login && !form.name)) {
      notify("⚡ Just one step away — fill the blanks!", "error");
      return;
    }
    if (form.password.length < 8) {
      notify("Password must be at least 8 characters.", "error");
      return;
    }

    try {
      setLoading(true);

      let response;
      if (login) {
        // LOGIN
        response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
      } else {
        // REGISTER
        response = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            name: form.name,
          }),
        });
      }

      const data = await response.json(); // ✅ parse once
      console.log(data);
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      if (login) {
        notify("🚀 Welcome back, dreamer!", "success");
        router.push("/dashboard");
      } else {
        notify("📩 Check your inbox to confirm your account!", "success");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err: any) {
      notify(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"
        animate={{ y: [0, -40, 0], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-xl mx-2 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-3 font-crimson">
          {login ? "Welcome Back 🌟" : "Begin Your Story ✨"}
        </h1>
        <p className="text-center text-white/70 mb-8">
          {login
            ? "Sign in to continue your journey"
            : "Join our community of dreamers and creators"}
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!login && (
            <div className="relative">
              <User
                size={20}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full pl-10 pr-4 py-3 autofill:bg-transparent bg-white/10 border border-white/20 rounded-xs focus:ring-2 focus:ring-pink-400 text-white placeholder-white/50 outline-none"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail
              size={20}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border  border-white/20  rounded-xs focus:ring-2 focus:ring-indigo-400 text-white placeholder-white/50 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={20}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password (8+ characters safe & strong)"
              className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xs focus:ring-2 focus:ring-purple-400 text-white placeholder-white/50 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3  -translate-y-1/2 text-neutral-400 hover:text-white transition"
            >
              {showPassword ? (
                <EyeOff size={20} className="text-neutral-400" />
              ) : (
                <Eye size={20} className="text-neutral-400" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <Link
              href={"/"}
              className="button-primary !bg-transparent flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              BACK
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="button-primary  px-6 py-2 rounded-xl flex items-center justify-center"
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              ) : login ? (
                "LOGIN"
              ) : (
                "REGISTER"
              )}
            </button>
          </div>
        </form>

        {/* Trust line */}
        <p className="mt-8 text-center text-white/50 text-sm">
          Trusted by dreamers, creators & storytellers worldwide 🌍
        </p>
        {!login ? (
          <p className="mt-2 text-center text-white/50 text-sm">
            Already have an account?{" "}
            <Link href={"/login"} className="text-white underline font-medium">
              Login
            </Link>
          </p>
        ) : (
          <p className="mt-2 text-center text-white/50 text-sm">
            New here?{" "}
            <Link
              href={"/register"}
              className="text-white underline font-medium"
            >
              Register now
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
