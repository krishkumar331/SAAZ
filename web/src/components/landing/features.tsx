"use client"

import { motion } from "framer-motion"
import { Palette, Users, ShieldCheck, Zap } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Artist Portfolios",
    description: "Showcase your best work in a stunning, customizable portfolio.",
  },
  {
    icon: Users,
    title: "Community Engagement",
    description: "Connect with other artists and clients in a vibrant community.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Get paid on time, every time, with our secure payment system.",
  },
  {
    icon: Zap,
    title: "Instant Opportunities",
    description: "Find jobs that match your skills and start working immediately.",
  },
]

export function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            SAAZ provides the tools and platform for you to thrive in the creative economy.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-9"
              >
                <dt className="inline font-semibold text-foreground">
                  <feature.icon className="absolute left-1 top-1 h-5 w-5 text-primary" aria-hidden="true" />
                  {feature.title}
                </dt>
                <dd className="inline text-muted-foreground ml-2">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
