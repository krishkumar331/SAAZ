"use client"

import { useRef } from "react"
import { useScroll, useTransform, motion } from "framer-motion"

const features = [
  "Connect with top-tier talent.",
  "Book venues effortlessly.",
  "Secure payments, every time.",
  "Build your creative legacy.",
]

export function FeaturesReveal() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={container} className="relative h-[400vh] bg-foreground text-background">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-4xl px-4 text-center">
          {features.map((text, i) => {
            const start = i / features.length
            const end = start + 1 / features.length

            const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0])
            const y = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [50, 0, 0, -50])

            return (
              <motion.h2
                key={i}
                style={{ opacity, y }}
                className="absolute top-0 left-0 right-0 text-5xl md:text-7xl font-bold tracking-tight"
              >
                {text}
              </motion.h2>
            )
          })}
        </div>
      </div>
    </div>
  )
}
