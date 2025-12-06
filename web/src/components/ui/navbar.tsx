"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MobileNav } from "@/components/ui/mobile-nav"
import { useLocation } from "@/contexts/location-context"
import { useAuth } from "@/contexts/auth-context"
import { MapPin, ChevronDown, User, LogOut } from "lucide-react"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const locationRef = useRef<HTMLDivElement>(null)
  const { city, setCity, detectLocation, isLoadingLocation } = useLocation()
  const { user, logout } = useAuth()
  const [isLocationOpen, setIsLocationOpen] = useState(false)

  const cities = ["Mumbai", "Delhi", "Bangalore", "All India"] as const

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    const handleScroll = () => {
      // Close dropdowns on scroll
      if (isLocationOpen) setIsLocationOpen(false)
      if (isMobileMenuOpen) setIsMobileMenuOpen(false)

      const currentScrollY = window.scrollY
      const viewportHeight = window.innerHeight

      // Check if scrolled for glass effect
      if (currentScrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Always show if within the first section (viewport height)
      if (currentScrollY < viewportHeight) {
        setIsVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      // If current scroll is greater than last scroll -> Scrolling Down
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false)
      } else {
        // Scrolling Up
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLocationOpen, isMobileMenuOpen])

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : "-200%",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-4 md:top-8 left-0 right-0 z-50 mx-auto max-w-6xl px-4 md:px-6"
    >
      <motion.div
        animate={{
          y: isScrolled ? [0, -5, 0] : 0,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`flex items-center justify-between rounded-full border px-6 md:px-10 transition-all duration-700 cubic-bezier(0.68, -0.55, 0.265, 1.55) bg-background/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20 ring-1 ring-white/30 ${isScrolled
          ? "h-14 md:h-16 mt-2"
          : "h-20 md:h-24 mt-4"
          }`}
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Glossy Highlight Overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        <div className="flex items-center gap-10 relative z-10">
          <a href="/" className="flex items-center">
            <Image src="/assets/logo.jpg" alt="SAAZ Logo" width={300} height={120} className={`w-auto object-contain transition-all duration-500 ${isScrolled ? "h-10 md:h-12" : "h-16 md:h-20"}`} />
          </a>

          {/* Location Picker */}
          <div className="relative hidden lg:block" ref={locationRef}>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-2 text-base font-bold bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-black/5 dark:border-white/20 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group"
            >
              <MapPin className="w-4 h-4 text-primary group-hover:text-primary dark:group-hover:text-white transition-colors" />
              <span className="text-foreground group-hover:text-foreground dark:group-hover:text-white transition-colors">{city}</span>
              <ChevronDown className="w-3 h-3 opacity-50 text-foreground group-hover:text-foreground dark:group-hover:text-white transition-colors" />
            </button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-2 z-50">
                <button
                  onClick={() => {
                    detectLocation()
                    setIsLocationOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2 text-primary"
                >
                  {isLoadingLocation ? (
                    <span className="animate-pulse">Locating...</span>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" /> Use my location
                    </>
                  )}
                </button>
                <div className="h-px bg-border/50 my-1" />
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCity(c)
                      setIsLocationOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all ${city === c ? "text-primary font-bold bg-primary/5" : "text-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex gap-8 text-lg font-medium">
            <a href="/explore" className="relative group hover:text-primary transition-colors">
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="/explore?type=events" className="relative group hover:text-primary transition-colors">
              Find Events
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="/explore?type=talent" className="relative group hover:text-primary transition-colors">
              Find Talent
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="/about" className="relative group hover:text-primary transition-colors">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6 relative z-10">
          {/* Theme Toggle - Desktop Only */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          {user ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/profile">
                <button className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-foreground px-2 py-1.5 pr-4 rounded-full text-sm font-medium transition-all duration-300 border border-black/5 dark:border-white/10">
                  {user.image ? (
                    <img src={`${user.image}?t=${new Date().getTime()}`} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-red-500/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/register">
              <button className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-bold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-primary/50 hover:scale-105 active:scale-95">
                Join Us
              </button>
            </Link>
          )}
          <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </div>
      </motion.div>
    </motion.nav>
  )
}
