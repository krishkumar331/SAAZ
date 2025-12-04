"use client"

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"

import { useLocation } from "@/contexts/location-context"

export function Hero() {
  const ref = useRef(null)
  const { city } = useLocation()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // ... existing transforms ...

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200])
  const yCard = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* ... background elements ... */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <motion.div
          style={{ y: yText }}
          className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          style={{ y: yCard }}
          className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/20 blur-[120px]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          style={{ y: yText, opacity }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Unleash Your</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Creative Soul in {city === "All India" ? "India" : city}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            The ultimate platform for artists to find stages and venues to find stars.
            Singers, dancers, comedians - your spotlight awaits.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/explore">
              <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1">
                Find Talent
              </button>
            </Link>
            <Link href="/explore?type=events">
              <button className="px-8 py-4 rounded-full border-2 border-primary/20 bg-background/50 backdrop-blur-sm text-foreground font-semibold text-lg hover:bg-primary/10 transition-all duration-300">
                Find Events
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div style={{ y: yCard, opacity }} className="relative hidden lg:block">
          <CardContainer className="inter-var">
            <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                Featured Artist
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Sarah Jenkins - Jazz Vocalist
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <Image
                  src="/assets/singer.png"
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
              <div className="flex justify-between items-center mt-20">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  View Profile →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Book Now
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </motion.div>
      </div>
    </section>
  )
}
