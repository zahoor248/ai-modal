"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TrustBar() {
  // Mock company logos - in production, replace with real client logos
  const companies = [
    { name: 'TechCorp', logo: '🏢' },
    { name: 'CreativeStudio', logo: '🎨' },
    { name: 'MediaFlow', logo: '📺' },
    { name: 'BrandBoost', logo: '🚀' },
    { name: 'ContentWorks', logo: '✨' },
    { name: 'SocialGrow', logo: '📈' },
    { name: 'ViralLab', logo: '🔬' },
    { name: 'TrendMakers', logo: '🎯' },
  ];

  const testimonialStats = [
    { value: '12,000+', label: 'Active Creators' },
    { value: '2M+', label: 'Posts Generated' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '300%', label: 'Avg. Engagement Boost' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-background via-accent/5 to-background border-y border-border/50">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">
            Trusted by creators & marketers at top brands
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 2,000+ reviews</span>
          </div>
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group flex flex-col items-center p-4 rounded-lg transition-all duration-300 hover:bg-accent/50"
              >
                <div className="text-4xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 transform transition-transform">
                  {company.logo}
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {testimonialStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 to-indigo-600 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join over <span className="font-semibold text-foreground">12,000+ content teams</span> using our AI builder every day to create viral posts, save hours of work, and 10x their social media engagement.
          </p>
        </motion.div>

        {/* Animated Testimonial Slider Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-full border border-green-200/50 dark:border-green-800/50">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Live: 47 creators are generating content right now
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}