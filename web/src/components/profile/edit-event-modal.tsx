"use client"

import { useState, useEffect } from "react"
import { X, Loader2, Calendar, MapPin, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface EditEventModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
  event: {
    id: number
    title: string
    date: string
    location: string
    description: string | null
    price: string | null
    image: string | null
  } | null
}

export function EditEventModal({ isOpen, onClose, onUpdated, event }: EditEventModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    price: "",
    image: "",
  })

  useEffect(() => {
    if (event) {
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
      const dateObj = new Date(event.date)
      const formattedDate = dateObj.toISOString().slice(0, 16)

      setFormData({
        title: event.title,
        date: formattedDate,
        location: event.location,
        description: event.description || "",
        price: event.price || "",
        image: event.image || "",
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }



      toast.success("Event updated successfully")
      onUpdated()
      onClose()
      window.location.reload()
    } catch (error) {
      console.error("Update event error:", error)
      toast.error("Failed to update event")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !event) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-bold">Edit Event</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Live Jazz Night"
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City or Venue"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (Optional)</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. ₹500 or Free"
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status Override</label>
                <select
                  disabled
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none opacity-50 cursor-not-allowed"
                  title="Status is automatically calculated based on date"
                >
                  <option>Auto (Date-based)</option>
                </select>
                <p className="text-[10px] text-muted-foreground">Change date to update status</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Event Image</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Event" className="w-16 h-16 rounded-lg object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    const uploadData = new FormData()
                    uploadData.append("image", file)

                    try {
                      setIsLoading(true)
                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/upload`, {
                        method: "POST",
                        body: uploadData,
                      })

                      if (!response.ok) throw new Error("Upload failed")

                      const data = await response.json()
                      setFormData(prev => ({ ...prev, image: data.imageUrl }))
                    } catch (error) {
                      console.error("Upload error:", error)
                      toast.error("Failed to upload image")
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about the event..."
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
