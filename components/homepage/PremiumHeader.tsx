"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', hasDropdown: false },
    { 
      name: 'Features', 
      href: '/features', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'AI Content Generator', href: '/features/ai-generator' },
        { name: 'Social Media Builder', href: '/features/social-builder' },
        { name: 'Trend Analysis', href: '/features/trends' },
        { name: 'Multi-Platform Publishing', href: '/features/publishing' },
      ]
    },
    { name: 'Pricing', href: '/pricing', hasDropdown: false },
    { 
      name: 'Use Cases', 
      href: '/use-cases', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'For Creators', href: '/use-cases/creators' },
        { name: 'For Brands', href: '/use-cases/brands' },
        { name: 'For Agencies', href: '/use-cases/agencies' },
        { name: 'For Coaches', href: '/use-cases/coaches' },
      ]
    },
    { 
      name: 'Resources', 
      href: '/resources', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'Blog', href: '/blog' },
        { name: 'Help Center', href: '/help' },
        { name: 'API Docs', href: '/docs' },
        { name: 'Templates', href: '/templates' },
      ]
    },
    { name: 'Blog', href: '/blog', hasDropdown: false },
  ];

  const isActive = (href: string) => pathname === href;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-xl'
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
                  isScrolled ? 'w-9 h-9' : 'w-12 h-12'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  width={isScrolled ? "18" : "24"}
                  height={isScrolled ? "18" : "24"}
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
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 text-sm font-medium transition-all duration-200 relative group ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    {/* Underline animation */}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-indigo-400 transition-all duration-300 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                  
                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.hasDropdown && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl p-2"
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block p-3 rounded-xl hover:bg-accent transition-colors duration-200 text-sm"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Start Free
                  </Button>
                </Link>
              </div>

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
      </motion.header>

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
                {navItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="block p-3 rounded-xl hover:bg-accent transition-colors duration-200 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.hasDropdown && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 text-sm text-muted-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="space-y-3 pt-6 border-t border-border/50">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-indigo-600">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Free
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}