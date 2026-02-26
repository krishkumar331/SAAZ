"use client"

import { useRef, useState, useEffect } from "react"
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
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"])

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startScrollY, setStartScrollY] = useState(0)

  // Map horizontal trackpad swipes to vertical page scrolling.
  useEffect(() => {
    const section = targetRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      // If horizontal scrolling is detected
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        window.scrollBy({ top: e.deltaX * 1.5 });
      }
    };
    
    // Using passive to ensure smooth scrolling
    section.addEventListener("wheel", handleWheel, { passive: true });
    return () => section.removeEventListener("wheel", handleWheel);
  }, []);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setStartScrollY(window.scrollY)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    // Increase multiplier to make drag feel responsive
    const walk = (startX - clientX) * 2.5 
    window.scrollTo({ top: startScrollY + walk })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div 
        className="sticky top-0 flex h-screen items-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleDragStart(e.pageX)}
        onMouseMove={(e) => { 
          if(isDragging) e.preventDefault(); 
          handleDragMove(e.pageX) 
        }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].pageX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].pageX)}
        onTouchEnd={handleDragEnd}
      >
        <motion.div style={{ x }} className="flex gap-8 md:gap-20 px-4 md:px-20 w-max">
          <div className="flex flex-col justify-center min-w-[90vw] md:min-w-[40vw]">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 pointer-events-none">
              Discover <br /> Talent
            </h2>
            <p className="text-xl text-muted-foreground max-w-md mb-8 pointer-events-none">
              Explore a world of creative professionals ready to bring your vision to life.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium opacity-50 animate-pulse pointer-events-none">
              Scroll or swipe to explore <span className="text-xl">↔ ↕</span>
            </div>
          </div>
          {categories.map((cat, index) => (
            <div key={index} className="relative h-[50vh] md:h-[60vh] w-[80vw] md:w-[40vw] flex-shrink-0 overflow-hidden rounded-3xl bg-muted">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                draggable={false}
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-10 pointer-events-none">
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
