import { HeroParallax } from "@/components/landing/hero-parallax"
import { CategoryScroll } from "@/components/landing/category-scroll"
import { ParallaxGallery } from "@/components/landing/parallax-gallery"
import { StoryTimeline } from "@/components/landing/story-timeline"
import { FAQSection } from "@/components/landing/faq-section"
import { ParallaxFooter } from "@/components/landing/footer-parallax"
import Image from "next/image"

const storyData = [
  {
    title: "The Spark",
    content: (
      <div>
        <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
          It starts with a profile. You upload your portfolio, your sound, your soul.
          Suddenly, you're not just an artist in a room; you're a signal in the noise.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/assets/guitar.png"
            alt="profile template"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]"
          />
          <Image
            src="/assets/sax.png"
            alt="profile template"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]"
          />
        </div>
      </div>
    ),
  },
  {
    title: "The Connection",
    content: (
      <div>
        <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
          A cafe owner in Hauz Khas sees your vibe. A message pops up. "We need a soulful set for Saturday night."
          The terms are set, the advance is paid, the trust is built.
        </p>
        <div className="rounded-lg overflow-hidden h-40 md:h-60 w-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <p className="text-white font-bold text-2xl">New Message: Social Offline</p>
        </div>
      </div>
    ),
  },
  {
    title: "The Stage",
    content: (
      <div>
        <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
          The lights go down. The crowd hushes. You step up. This is what you were made for.
          SAAZ handled the booking; you handle the magic.
        </p>
        <Image
          src="/assets/singer.png"
          alt="hero template"
          width={500}
          height={500}
          className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]"
        />
      </div>
    ),
  },
  {
    title: "The Legacy",
    content: (
      <div>
        <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Reviews pour in. Your rating climbs. More bookings follow.
          You're not just finding events anymore; the events are finding you.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
            <p className="text-yellow-500">★★★★★</p>
            <p className="text-white text-sm mt-2">"Absolutely electric performance."</p>
          </div>
          <div className="rounded-lg bg-neutral-900 p-4 border border-neutral-800">
            <p className="text-yellow-500">★★★★★</p>
            <p className="text-white text-sm mt-2">"Professional and talented."</p>
          </div>
        </div>
      </div>
    ),
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeroParallax />
      <CategoryScroll />
      <StoryTimeline data={storyData} />
      <ParallaxGallery />
      <FAQSection />
      <ParallaxFooter />
    </div>
  )
}
