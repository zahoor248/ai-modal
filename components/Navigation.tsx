"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Sparkles,
  Zap,
  Crown,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavigationProps {
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

export default function Navigation({ user }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const features = [
    { name: 'AI Story Builder', href: '/builders/story', icon: Sparkles },
    { name: 'Social Media Manager', href: '/social-manager', icon: Zap },
    { name: 'Content Templates', href: '/templates', icon: Crown },
  ];

  const resources = [
    { name: 'Help Center', href: '/help', icon: HelpCircle },
    { name: 'API Docs', href: '/docs', icon: User },
    { name: 'Community', href: '/community', icon: User },
  ];

  const pricing = [
    { name: 'Free Plan', href: '/pricing#free', description: 'Get started for free' },
    { name: 'Pro Plan', href: '/pricing#pro', description: 'Advanced features' },
    { name: 'Enterprise', href: '/pricing#enterprise', description: 'For teams' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'py-3' : 'py-6'
          }`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                className={`rounded-xl bg-gradient-to-br from-pink-400 to-indigo-600 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200 ${
                  isScrolled ? 'w-8 h-8' : 'w-11 h-11'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  width={isScrolled ? "16" : "22"}
                  height={isScrolled ? "16" : "22"}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M3 7.5C3 5 5 3 7.5 3h9C19 3 21 5 21 7.5v9C21 19 19 21 16.5 21h-9C5 21 3 19 3 16.5v-9z"
                    fill="currentColor"
                  />
                </svg>
              </motion.div>
              <div className="hidden sm:block">
                <div className={`font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent transition-all duration-300 ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}>
                  StoryBuds
                </div>
                <div className={`text-muted-foreground -mt-1 transition-all duration-300 ${
                  isScrolled ? 'text-[10px]' : 'text-xs'
                }`}>
                  AI Social Media
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Features Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('features')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200">
                  Features
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'features' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-background/95 backdrop-blur-lg rounded-2xl border border-border/50 shadow-xl p-2"
                    >
                      {features.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-indigo-500/20 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">Advanced AI tools</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pricing Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('pricing')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200">
                  Pricing
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'pricing' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-lg rounded-2xl border border-border/50 shadow-xl p-2"
                    >
                      {pricing.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block p-3 rounded-xl hover:bg-accent transition-colors duration-200"
                        >
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200">
                  Resources
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'resources' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-background/95 backdrop-blur-lg rounded-2xl border border-border/50 shadow-xl p-2"
                    >
                      {resources.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200"
                        >
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {user ? (
                // User Profile Dropdown
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('profile')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-accent transition-colors duration-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-indigo-600 flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === 'profile' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-background/95 backdrop-blur-lg rounded-2xl border border-border/50 shadow-xl p-2"
                      >
                        <div className="p-3 border-b border-border/50">
                          <div className="font-medium text-sm">{user.name || 'User'}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200">
                          <User className="w-4 h-4" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                        <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200">
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Settings</span>
                        </Link>
                        <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors duration-200 w-full text-left text-destructive">
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Auth Buttons
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="sm" className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 90 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-background border-l border-border/50 shadow-xl p-6"
            >
              <div className="space-y-6 mt-16">
                {/* Mobile Features */}
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">Features</h3>
                  <div className="space-y-2">
                    {features.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Pricing */}
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">Pricing</h3>
                  <div className="space-y-2">
                    {pricing.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block p-3 rounded-xl hover:bg-accent transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth */}
                {!user && (
                  <div className="space-y-3 pt-6 border-t border-border/50">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-indigo-600">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile User Profile */}
                {user && (
                  <div className="pt-6 border-t border-border/50">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-indigo-600 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.name || 'User'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors duration-200 w-full text-left text-destructive">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}