import { toast } from "sonner"
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

/**
 * Show a success toast notification
 * @param message - The success message to display
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle2 className="w-5 h-5" />,
  })
}

/**
 * Show an error toast notification
 * @param message - The error message to display
 */
export const showError = (message: string) => {
  toast.error(message, {
    icon: <XCircle className="w-5 h-5" />,
  })
}

/**
 * Show a warning toast notification
 * @param message - The warning message to display
 */
export const showWarning = (message: string) => {
  toast.warning(message, {
    icon: <AlertTriangle className="w-5 h-5" />,
  })
}

/**
 * Show an info toast notification
 * @param message - The info message to display
 */
export const showInfo = (message: string) => {
  toast.info(message, {
    icon: <Info className="w-5 h-5" />,
  })
}

/**
 * Show a loading toast notification
 * @param message - The loading message to display
 * @returns Toast ID for dismissal
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
  })
}

/**
 * Dismiss a specific toast by ID
 * @param toastId - The ID of the toast to dismiss
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId)
}

/**
 * Show a promise toast that updates based on promise state
 * @param promise - The promise to track
 * @param messages - Messages for loading, success, and error states
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  }
) => {
  return toast.promise(promise, messages)
}
