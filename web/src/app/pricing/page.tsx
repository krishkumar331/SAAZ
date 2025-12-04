import { ParallaxHeader } from "@/components/ui/parallax-header"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Artist Basic",
    price: "Free",
    description: "Perfect for getting started.",
    features: ["Create a profile", "Upload up to 3 media items", "Receive messages", "Basic analytics"],
  },
  {
    name: "Artist Pro",
    price: "₹999/mo",
    description: "For serious performers.",
    features: ["Everything in Basic", "Unlimited media uploads", "Priority search listing", "Advanced analytics", "Verified badge"],
    highlight: true,
  },
  {
    name: "Venue Partner",
    price: "₹2,999/mo",
    description: "Find the best talent.",
    features: ["Post unlimited events", "Search artist database", "Direct booking tools", "Dedicated support"],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <ParallaxHeader
        title="Simple Pricing"
        subtitle="Choose the plan that fits your stage."
        image="/assets/concert_crowd.png"
      />

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 border ${plan.highlight
                ? "bg-primary text-primary-foreground border-primary shadow-2xl scale-105"
                : "bg-card text-card-foreground border-border shadow-lg"
                }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-4">{plan.price}</div>
              <p className={`mb-8 ${plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {plan.description}
              </p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-full font-bold transition-opacity hover:opacity-90 ${plan.highlight
                  ? "bg-background text-foreground"
                  : "bg-primary text-primary-foreground"
                  }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
