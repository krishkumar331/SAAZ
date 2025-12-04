import { useState } from "react"

export function useEmailValidation() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.replace(/\s/g, ""))
    setStatus("idle")
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault()
    }
  }

  const validateEmail = (): boolean => {
    if (!email) {
      setStatus("error")
      setMessage("Email is required")
      return false
    }
    if (!email.includes("@")) {
      setStatus("error")
      setMessage("Email must contain '@'")
      return false
    }
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setStatus("error")
      setMessage("Only @gmail.com addresses are allowed")
      return false
    }
    if (email.includes(" ")) {
      setStatus("error")
      setMessage("Email cannot contain spaces")
      return false
    }
    return true
  }

  return {
    email,
    setEmail,
    status,
    setStatus,
    message,
    setMessage,
    handleEmailChange,
    handleKeyDown,
    validateEmail
  }
}
