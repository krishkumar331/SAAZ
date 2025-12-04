"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import { useEmailValidation } from "@/hooks/use-email-validation"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    email,
    setEmail,
    status: emailStatus,
    message: emailMessage,
    handleEmailChange,
    handleKeyDown,
    validateEmail
  } = useEmailValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Forgot password error:", error)
      alert(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-muted-foreground">
              We've sent password reset instructions to <span className="font-medium text-foreground">{email}</span>
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-primary hover:underline text-sm font-medium"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Forgot Password?</h1>
            <p className="text-center text-muted-foreground mb-8">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
