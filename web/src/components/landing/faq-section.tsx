"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "How do I get paid as an artist?",
    answer: "Payments are secured through SAAZ. Once an event is completed and confirmed, funds are released directly to your connected bank account within 24 hours.",
  },
  {
    question: "Is there a fee to join?",
    answer: "Creating a profile is completely free. We take a small service fee only when you successfully book a paid event.",
  },
  {
    question: "How are venues verified?",
    answer: "We have a strict verification process for all venues. We verify business licenses and conduct random site visits to ensure safety and quality.",
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, but cancellation policies vary. Please check the specific terms agreed upon in your contract before cancelling.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about SAAZ.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-lg font-medium pr-8">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
