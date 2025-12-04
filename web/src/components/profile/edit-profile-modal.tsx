"use client"

import { useState } from "react"
import { X, Loader2, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: any
  onUpdate: () => void
}

export function EditProfileModal({ isOpen, onClose, profile, onUpdate }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.artistProfile?.bio || profile.venueProfile?.lookingFor || "",
    location: profile.artistProfile?.location || profile.venueProfile?.location || "",
    price: profile.artistProfile?.price || "",
    capacity: profile.venueProfile?.capacity?.toString() || "",
    image: profile.artistProfile?.image || profile.venueProfile?.image || "",
    role: profile.role,
    category: profile.artistProfile?.category || "",
  })

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

  const handleDeleteProfile = async () => {
    if (!confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: null,
      })

      if (!response.ok) {
        throw new Error("Failed to delete profile")
      }

      // Clear local storage and redirect to home
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/"
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete profile")
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.location.trim()) {
      alert("Location is required")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio, // For Artist
          lookingFor: formData.bio, // For Venue (reusing bio field for simplicity in UI, mapping to lookingFor)
          location: formData.location,
          price: formData.price,
          capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
          image: formData.image,
          role: formData.role,
          category: formData.category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      onUpdate()
      onClose()
    } catch (error) {
      console.error("Update error:", error)
      alert("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Image</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
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
                      alert("Failed to upload image")
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="ARTIST">Artist</option>
                <option value="VENUE">Venue</option>
                <option value="USER">User</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none pr-10"
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

            {profile.role === "ARTIST" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="">Select Category</option>
                    {["Band", "Musicians", "Singers", "Dancers", "Stand up artists", "Beatboxers", "Dj", "Actors", "Poets", "Anchors", "Others"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {profile.role === "VENUE" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Looking For (Bio)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
                    placeholder="e.g. Jazz bands, Stand-up comedians"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </>
            )}

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors mr-auto"
              >
                Delete Profile
              </button>
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
