"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const categories = [
  {
    title: "Musicians",
    image: "/assets/guitar.png",
    desc: "Find your rhythm.",
  },
  {
    title: "Vocalists",
    image: "/assets/singer.png",
    desc: "Let your voice be heard.",
  },
  {
    title: "Performers",
    image: "/assets/sax.png",
    desc: "Captivate the crowd.",
  },
  {
    title: "Venues",
    image: "/assets/concert_crowd.png",
    desc: "Host the magic.",
  },
]

export function CategoryScroll() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"])

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 md:gap-20 px-4 md:px-20">
          <div className="flex flex-col justify-center min-w-[90vw] md:min-w-[40vw]">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
              Discover <br /> Talent
            </h2>
            <p className="text-xl text-muted-foreground max-w-md mb-8">
              Explore a world of creative professionals ready to bring your vision to life.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium opacity-50 animate-pulse">
              Scroll to explore <span className="text-xl">↓</span>
            </div>
          </div>
          {categories.map((cat, index) => (
            <div key={index} className="relative h-[50vh] md:h-[60vh] w-[80vw] md:w-[40vw] flex-shrink-0 overflow-hidden rounded-3xl bg-muted">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10">
                <h3 className="text-4xl font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-white/80 text-lg">{cat.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
