import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, MapPin, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useLocation } from "@/contexts/location-context"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { createPortal } from "react-dom"

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const { city, setCity, detectLocation, isLoadingLocation } = useLocation()
  const { user, logout } = useAuth()
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const cities = ["Mumbai", "Delhi", "Bangalore", "All India"] as const
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="md:hidden relative z-[100]">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative z-[100] p-3 text-foreground bg-background/80 backdrop-blur-md rounded-full border border-border shadow-lg hover:bg-muted transition-all cursor-pointer active:scale-95 pointer-events-auto"
        aria-label="Open Menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border z-[101] p-6 shadow-2xl overflow-y-auto"
              >

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold font-heading">Menu</span>
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  {/* Location Picker for Mobile */}
                  <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                    <button
                      onClick={() => setIsLocationOpen(!isLocationOpen)}
                      className="flex items-center justify-between w-full text-left mb-2"
                    >
                      <div className="flex items-center gap-2 font-bold text-primary">
                        <MapPin className="w-5 h-5" />
                        <span>{city}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isLocationOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isLocationOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 space-y-1">
                            <button
                              onClick={() => {
                                detectLocation()
                                setIsLocationOpen(false)
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-background text-primary font-medium flex items-center gap-2"
                            >
                              {isLoadingLocation ? (
                                <span className="animate-pulse">Locating...</span>
                              ) : (
                                <>
                                  <MapPin className="w-4 h-4" /> Use my location
                                </>
                              )}
                            </button>
                            <div className="h-px bg-border/50 my-1" />
                            {cities.map((c) => (
                              <button
                                key={c}
                                onClick={() => {
                                  setCity(c)
                                  setIsLocationOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${city === c ? "bg-primary/10 text-primary font-bold" : "hover:bg-background text-muted-foreground"}`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Navigation</h3>
                    <Link href="/explore" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-primary transition-colors">Explore All</Link>
                    <Link href="/explore?type=events" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-primary transition-colors">Find Events</Link>
                    <Link href="/explore?type=talent" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-primary transition-colors">Find Talent</Link>
                  </div>

                  <div className="mt-auto pt-8">
                    {user ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                          {user.image ? (
                            <img src={`${user.image}?t=${new Date().getTime()}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">{user.name.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-bold">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
                          </div>
                        </div>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <button className="w-full bg-secondary/50 text-foreground px-8 py-3 rounded-full text-lg font-bold hover:bg-secondary transition-all">
                            Profile
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                          className="w-full bg-red-500/10 text-red-500 px-8 py-3 rounded-full text-lg font-bold hover:bg-red-500/20 transition-all"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-8">
                        <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                          <button className="w-full bg-secondary/50 text-foreground px-8 py-3 rounded-full text-lg font-bold hover:bg-secondary transition-all">
                            Sign In
                          </button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)} className="block">
                          <button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-lg">
                            Join Us
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
