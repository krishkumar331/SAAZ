"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

const images = [
  "/assets/singer.png",
  "/assets/guitar.png",
  "/assets/sax.png",
  "/assets/concert_crowd.png",
]

export function ParallaxGallery() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])

  const pictures = [
    {
      src: images[0],
      scale: scale4,
      className: "w-[25vw] h-[25vh]",
    },
    {
      src: images[1],
      scale: scale5,
      className: "top-[-30vh] left-[5vw] w-[35vw] h-[30vh]",
    },
    {
      src: images[2],
      scale: scale6,
      className: "top-[-10vh] left-[-25vw] w-[20vw] h-[45vh]",
    },
    {
      src: images[3],
      scale: scale8,
      className: "top-[0vh] left-[25vw] w-[25vw] h-[25vh]",
    },
    {
      src: images[0], // Reuse singer for now as 5th
      scale: scale9,
      className: "top-[27.5vh] left-[5vw] w-[20vw] h-[25vh]",
    },
  ]

  return (
    <div ref={container} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        {pictures.map(({ src, scale, className }, index) => {
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute w-full h-full top-0 flex items-center justify-center"
            >
              <div className={cn("relative", className)}>
                <Image
                  src={src}
                  fill
                  alt="image"
                  className="object-cover placeholder:blur-md"
                />
              </div>
            </motion.div>
          )
        })}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference">
          <h2 className="text-5xl md:text-9xl font-bold text-white tracking-tighter uppercase text-center leading-none">
            Experience <br /> The Sound
          </h2>
        </div>
      </div>
    </div>
  )
}
