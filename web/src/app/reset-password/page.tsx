"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react"

import { Suspense } from "react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      console.error("Reset password error:", error)
      alert(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Password Reset Successful</h1>
            <p className="text-muted-foreground">
              Your password has been updated. Redirecting to login...
            </p>
            <Link href="/login" className="text-primary hover:underline font-bold block mt-4">
              Click here if not redirected
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
            <p className="text-center text-muted-foreground mb-8">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
