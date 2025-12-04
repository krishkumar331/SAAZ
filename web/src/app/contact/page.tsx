import { ParallaxHeader } from "@/components/ui/parallax-header"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <ParallaxHeader
        title="Get in Touch"
        subtitle="We'd love to hear from you."
        image="/assets/singer.png"
      />

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-10 md:w-1/2 bg-muted/50">
            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">careers.saaz@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-muted-foreground">101, Music Plaza, Bandra West, Mumbai</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 md:w-1/2 bg-background">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none" placeholder="How can we help?" />
              </div>
              <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
