"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic2, Store, User, ArrowRight, Loader2, MapPin, Eye, EyeOff, Check, X, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useEmailValidation } from "@/hooks/use-email-validation"
import { GoogleLogin } from "@react-oauth/google"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<"role" | "form">("role")
  const [role, setRole] = useState<"ARTIST" | "VENUE" | "USER" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    email,
    setEmail,
    status: emailStatus,
    message: emailMessage,
    handleEmailChange,
    handleKeyDown,
    validateEmail
  } = useEmailValidation()

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    category: "", // For Artist
    type: "", // For Venue
    location: "",
  })

  // Username states
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([])

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle")
      setUsernameSuggestions([])
      return
    }

    setUsernameStatus("checking")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/check-username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
      const data = await response.json()

      if (data.available) {
        setUsernameStatus("available")
        setUsernameSuggestions([])
      } else {
        setUsernameStatus("taken")
        setUsernameSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error("Error checking username:", error)
      setUsernameStatus("idle")
    }
  }

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username) {
        checkUsername(formData.username)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [formData.username])

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // Using a free reverse geocoding API
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await response.json()

          let preciseLocation = ""
          if (data.locality && data.city) {
            preciseLocation = `${data.locality}, ${data.city}`
          } else if (data.city) {
            preciseLocation = data.city
          } else if (data.locality) {
            preciseLocation = data.locality
          } else {
            preciseLocation = data.principalSubdivision || ""
          }

          if (preciseLocation) {
            setFormData((prev) => ({ ...prev, location: preciseLocation.toUpperCase() }))
          } else {
            alert("Could not detect precise location. Please enter manually.")
          }
        } catch (error) {
          console.error("Error getting location:", error)
          alert("Failed to detect location. Please enter manually.")
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true }
    )
  }

  useEffect(() => {
    if (step === "form" && !formData.location) {
      handleDetectLocation()
    }
  }, [step])

  const handleRoleSelect = (selectedRole: "ARTIST" | "VENUE" | "USER") => {
    setRole(selectedRole)
    setStep("form")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return
    if (usernameStatus === "taken") {
      alert("Please choose a unique username")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          email: email.toLowerCase(),
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "User already exists") {
          alert("User already exists. Redirecting to login...")
          router.push("/login")
          return
        }
        throw new Error(data.error || "Registration failed")
      }

      console.log("Registration successful:", data)
      router.push("/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error)
      alert(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-32 md:pt-40">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">

        {/* Left Side - Visuals */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Join the <span className="text-primary">Revolution</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Whether you're an artist looking for a stage, or a venue looking for a star, SAAZ is your home.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <Mic2 className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg">For Artists</h3>
              <p className="text-sm text-muted-foreground">Showcase your talent and get booked.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg">
              <Store className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="font-bold text-lg">For Venues</h3>
              <p className="text-sm text-muted-foreground">Find the perfect vibe for your space.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            {step === "role" ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-center mb-8">Choose your path</h2>

                <button
                  onClick={() => handleRoleSelect("ARTIST")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mic2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">I am an Artist</h3>
                    <p className="text-sm text-muted-foreground">Singer, Dancer, Musician, Comedian...</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => handleRoleSelect("VENUE")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-purple-500 hover:bg-purple-500/5 transition-all group text-left"
                >
                  <div className="p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Store className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">I own a Venue</h3>
                    <p className="text-sm text-muted-foreground">Cafe, Club, Restaurant, Event Space...</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => handleRoleSelect("USER")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-foreground hover:bg-foreground/5 transition-all group text-left"
                >
                  <div className="p-3 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">I'm just exploring</h3>
                    <p className="text-sm text-muted-foreground">Looking for events and talent.</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-bold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="registration-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setStep("role")}
                  className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
                >
                  ← Back to roles
                </button>

                <h2 className="text-2xl font-bold mb-6">
                  Sign up as {role === "ARTIST" ? "an Artist" : role === "VENUE" ? "a Venue" : "a User"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none uppercase"
                      placeholder={role === "VENUE" ? "VENUE NAME" : "YOUR NAME"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        className={`w-full px-4 py-2 rounded-lg bg-background border outline-none uppercase ${usernameStatus === "taken" ? "border-red-500 focus:ring-red-500" :
                          usernameStatus === "available" ? "border-green-500 focus:ring-green-500" :
                            "border-input focus:ring-primary/50"
                          } focus:ring-2`}
                        placeholder="UNIQUE USERNAME"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                        {usernameStatus === "available" && <Check className="w-4 h-4 text-green-500" />}
                        {usernameStatus === "taken" && <X className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                    {usernameStatus === "taken" && (
                      <div className="mt-2">
                        <p className="text-red-500 text-xs mb-1">Username taken. Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          {usernameSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => setFormData({ ...formData, username: suggestion })}
                              className="text-xs bg-muted px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      required
                      className={`w-full px-4 py-2 rounded-lg bg-background border outline-none focus:ring-2 focus:ring-primary/50 ${emailStatus === "error" ? "border-red-500" : "border-input"}`}
                      placeholder="hello@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      onKeyDown={handleKeyDown}
                    />
                    {emailStatus === "error" && (
                      <p className="text-red-500 text-xs">{emailMessage}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none pr-10"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {role === "ARTIST" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none uppercase"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {["Band", "Musicians", "Singers", "Dancers", "Stand up artists", "Beatboxers", "Dj", "Actors", "Poets", "Anchors", "Others"].map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {role === "VENUE" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Venue Type</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none uppercase"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="">SELECT TYPE</option>
                        <option value="CAFE">CAFE</option>
                        <option value="CLUB">CLUB</option>
                        <option value="RESTAURANT">RESTAURANT</option>
                        <option value="EVENT HALL">EVENT HALL</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none pr-10 uppercase"
                        placeholder="CITY, E.G. MUMBAI"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value.toUpperCase() })}
                      />
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isGettingLocation}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors"
                        title="Use current location"
                      >
                        {isGettingLocation ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="inline-block rounded-full overflow-hidden bg-background dark:bg-card border border-border/50">
                      <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                          try {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/google`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                credential: credentialResponse.credential,
                                role, // Pass the selected role
                              }),
                            })

                            const data = await response.json()

                            if (!response.ok) {
                              throw new Error(data.error || "Google registration failed")
                            }

                            login(data.token, data.user)
                            router.push("/profile")
                          } catch (error) {
                            console.error("Google registration error:", error)
                            alert("Google registration failed")
                          }
                        }}
                        onError={() => {
                          console.log("Registration Failed")
                          alert("Google registration failed")
                        }}
                        useOneTap
                        theme="outline"
                        shape="pill"
                        size="large"
                      />
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
