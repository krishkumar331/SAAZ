"use client"

import { motion } from "framer-motion"
import { UserPlus, MessageCircle, Star } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    desc: "Showcase your talent or venue with a stunning portfolio. Add photos, videos, and bio.",
  },
  {
    icon: MessageCircle,
    title: "Connect & Collaborate",
    desc: "Directly message artists or venue owners. Discuss requirements and agree on terms.",
  },
  {
    icon: Star,
    title: "Perform & Shine",
    desc: "Book the event, perform your heart out, and build your reputation with reviews.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-32 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple steps to launch your creative journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center bg-background p-6"
            >
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-8 shadow-xl">
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
