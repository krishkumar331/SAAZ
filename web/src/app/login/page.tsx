"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Eye, EyeOff, User, Music, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { GoogleLogin } from "@react-oauth/google"

function LoginContent() {
  const router = useRouter()
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  // Google Login State
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [googleCredential, setGoogleCredential] = useState<string | null>(null)

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Login failed")

      login(data.token, data.user)
      router.push("/profile")
    } catch (error) {
      console.error("Login error:", error)
      alert(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async (credential: string, role?: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "Role is required for new registration") {
          setGoogleCredential(credential)
          setShowRoleSelection(true)
          return
        }
        throw new Error(data.error || "Google login failed")
      }

      login(data.token, data.user)
      router.push("/profile")
    } catch (error) {
      console.error("Google login error:", error)
      alert("Google login failed")
    }
  }



  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          <p className="text-muted-foreground mb-8">Select how you want to use SAAZ</p>

          <div className="grid gap-4">
            <button
              onClick={() => handleGoogleLogin(googleCredential!, "ARTIST")}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-4 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold">I am an Artist</h3>
                <p className="text-sm text-muted-foreground">I want to showcase my talent</p>
              </div>
            </button>

            <button
              onClick={() => handleGoogleLogin(googleCredential!, "VENUE")}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-4 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold">I am a Venue/Recruiter</h3>
                <p className="text-sm text-muted-foreground">I want to hire talent</p>
              </div>
            </button>

            <button
              onClick={() => handleGoogleLogin(googleCredential!, "USER")}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-4 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold">I am a User</h3>
                <p className="text-sm text-muted-foreground">I want to explore events</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">
          Sign in to continue to SAAZ
        </p>

        {registered && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl mb-6 text-center text-sm">
            Account created successfully! Please sign in.
          </div>
        )}

        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email or Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg bg-background border border-input outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="hello@example.com or USERNAME"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <> <Loader2 className="w-5 h-5 animate-spin" /> Signing In... </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  handleGoogleLogin(credentialResponse.credential)
                }
              }}
              onError={() => {
                console.log("Login Failed")
                alert("Google login failed")
              }}
              useOneTap
              theme="filled_black"
              shape="pill"
            />
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-bold">
              Join Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
