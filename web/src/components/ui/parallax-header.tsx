"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

interface ParallaxHeaderProps {
  title: string
  subtitle: string
  image: string
}

export function ParallaxHeader({ title, subtitle, image }: ParallaxHeaderProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={ref} className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center pt-32">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">
          {title}
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
          {subtitle}
        </p>
      </motion.div>
    </div>
  )
}
