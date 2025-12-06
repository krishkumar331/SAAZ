"use client"

import { useRef, useState } from "react"
import { useScroll, useTransform, motion } from "framer-motion"
import Image from "next/image"
import { Instagram, Twitter, Linkedin, Send } from "lucide-react"

import { useEmailValidation } from "@/hooks/use-email-validation"

export function ParallaxFooter() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-300, 0])

  const {
    email,
    status,
    setStatus,
    message,
    setMessage,
    handleEmailChange,
    handleKeyDown,
    validateEmail
  } = useEmailValidation()

  const handleSubscribe = () => {
    if (validateEmail()) {
      setStatus("success")
      setMessage("Subscribed successfully!")
      // Clear email after success if needed, or keep it
      // setEmail("") 
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 3000)
    }
  }

  return (
    <div
      ref={container}
      className="relative h-auto md:h-[600px] bg-background flex flex-col items-center justify-center overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative md:fixed bottom-0 h-auto md:h-[600px] w-full">
        <motion.div style={{ y }} className="relative h-full w-full bg-neutral-900 text-white flex flex-col justify-between p-8 md:p-20">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Image src="/assets/logo.jpg" alt="SAAZ Logo" width={240} height={100} className="h-24 w-auto object-contain mb-6" />
              </div>
              <p className="text-neutral-400 max-w-sm mb-8">
                Bridging the gap between extraordinary talent and the stages that need them. Join the revolution in live performance booking.
              </p>
              <div className="flex gap-4 mb-6">
                <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5" />
                </div>
                <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <Linkedin className="w-5 h-5" />
                </div>
              </div>
              <div className="text-neutral-400 text-sm">
                <p>Need help? Contact us at:</p>
                <a href="mailto:careers.saaz@gmail.com" className="text-white hover:underline">careers.saaz@gmail.com</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Platform</h3>
              <ul className="space-y-4 text-neutral-400">
                <li className="hover:text-white transition-colors cursor-pointer">Explore Talent</li>
                <li className="hover:text-white transition-colors cursor-pointer">Find Events</li>
                <li className="hover:text-white transition-colors cursor-pointer">How It Works</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Stay Updated</h3>
              <p className="text-neutral-400 mb-4 text-sm">
                Get the latest opportunities and updates delivered to your inbox.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your email"
                    className={`bg-white/10 border rounded-lg px-4 py-2 text-sm w-full focus:outline-none transition-colors ${status === "error" ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-white/50"
                      }`}
                  />
                  <button
                    onClick={handleSubscribe}
                    className="p-2 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-xs">{message}</p>
                )}
                {status === "success" && (
                  <p className="text-green-400 text-xs">{message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">
              © 2024 SAAZ Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-neutral-500">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
