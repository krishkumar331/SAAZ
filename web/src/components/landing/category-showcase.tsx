"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const categories = {
  artists: [
    { title: "Singers", image: "/assets/singer.png", desc: "Find your voice, find your stage." },
    { title: "Dancers", image: "/assets/singer.png", desc: "Express yourself through movement." }, // Placeholder
    { title: "Comedians", image: "/assets/singer.png", desc: "Make the world laugh." }, // Placeholder
  ],
  venues: [
    { title: "Cafes", image: "/assets/singer.png", desc: "Create the perfect ambiance." }, // Placeholder
    { title: "Clubs", image: "/assets/singer.png", desc: "Electrify the night." }, // Placeholder
    { title: "Events", image: "/assets/singer.png", desc: "Make every moment memorable." }, // Placeholder
  ],
}

export function CategoryShowcase() {
  const [activeType, setActiveType] = useState<"artists" | "venues">("artists")

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Who are you?</h2>
          <div className="inline-flex bg-background rounded-full p-1 border shadow-sm">
            <button
              onClick={() => setActiveType("artists")}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${activeType === "artists"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              I'm an Artist
            </button>
            <button
              onClick={() => setActiveType("venues")}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${activeType === "venues"
                ? "bg-secondary text-secondary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              I own a Venue
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <AnimatePresence>
            {categories[activeType].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/80 mb-4">{item.desc}</p>
                  <div className="flex items-center gap-2 text-primary font-semibold opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center">
          <Link href="/explore">
            <button className="text-lg font-medium underline underline-offset-4 hover:text-primary transition-colors">
              View all categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
