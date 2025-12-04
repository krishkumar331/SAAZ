"use client"

import { motion } from "framer-motion"
import { Palette, Users, ShieldCheck, Zap, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-40 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Hero Section */}
        <section className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Where Art Meets <span className="text-primary">Opportunity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            SAAZ is a dynamic online platform designed to bridge the gap between talented artists and clients seeking creative services. We are an integrated digital ecosystem combining portfolios, job listings, and secure payments.
          </motion.p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
              <Heart className="w-4 h-4" /> Our Mission
            </div>
            <h2 className="text-4xl font-bold">Empowering Creativity</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              SAAZ aims to empower freelance and independent artists by providing them with visibility, opportunities, and financial security. We enable clients to easily discover, collaborate, and transact with verified creative professionals.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              By leveraging modern web technologies and a user-centric approach, SAAZ redefines how art meets opportunity. We are revolutionizing the creative economy by fostering meaningful connections and making creativity more accessible, transparent, and impactful.
            </p>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-600/20 border border-white/10 p-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {[
                { icon: Palette, label: "Portfolios" },
                { icon: Users, label: "Community" },
                { icon: ShieldCheck, label: "Security" },
                { icon: Zap, label: "Growth" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center gap-2"
                >
                  <item.icon className="w-8 h-8 text-primary" />
                  <span className="font-bold text-sm">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Globe,
              title: "Digital Ecosystem",
              desc: "A unified platform that combines artist portfolios, job listings, community engagement, and secure payment systems."
            },
            {
              icon: ShieldCheck,
              title: "Trust & Security",
              desc: "We ensure a safe environment for both artists and clients with verified profiles and secure transaction methods."
            },
            {
              icon: Users,
              title: "Meaningful Connections",
              desc: "Fostering a vibrant community where collaboration thrives and artistic talent is celebrated and rewarded."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors group"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Artists", value: "5,000+" },
              { label: "Venues", value: "1,200+" },
              { label: "Events Hosted", value: "15k+" },
              { label: "Cities", value: "25+" }
            ].map((stat, i) => (
              <div key={i}>
                <h4 className="text-4xl font-bold text-primary mb-1">{stat.value}</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
