"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

import { useLocation } from "@/contexts/location-context"

export function HeroParallax() {
  const containerRef = useRef(null)
  const { city } = useLocation()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 200])

  return (
    <div ref={containerRef} className="h-[150vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0 z-0">
          <Image
            src="/assets/singer.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </motion.div>

        <motion.div
          style={{ opacity, y: textY }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4"
        >
          <h1 className="text-6xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter text-foreground mb-4 leading-none">
            SAAZ
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground max-w-2xl font-light tracking-wide mb-10">
            WHERE ART MEETS OPPORTUNITY IN {city === "All India" ? "INDIA" : city.toUpperCase()}
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="/explore">
              <button className="px-8 py-4 rounded-full bg-foreground text-background font-bold text-lg hover:scale-105 transition-transform">
                Find Talent
              </button>
            </a>
            <a href="/explore?type=events">
              <button className="px-8 py-4 rounded-full border-2 border-foreground/20 bg-background/50 backdrop-blur-sm text-foreground font-bold text-lg hover:bg-foreground/10 transition-all">
                Find Events
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
