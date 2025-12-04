"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2, MapPin, Mail, Calendar, User as UserIcon, Briefcase, Star, Edit, Plus, Image as ImageIcon, Store, Mic2, Trash2 } from "lucide-react"
import { EditProfileModal } from "@/components/profile/edit-profile-modal"
import { CreatePostModal } from "@/components/profile/create-post-modal"
import { EditEventModal } from "@/components/profile/edit-event-modal"
import { useAuth } from "@/contexts/auth-context"


interface EventType {
  id: number
  title: string
  date: string
  location: string
  description: string | null
  price: string | null
  image: string | null
}

interface UserProfile {
  id: number
  email: string
  name: string
  username?: string
  role: string
  image?: string | null
  createdAt: string
  artistProfile?: {
    category: string
    location: string
    bio: string | null
    price: string | null
    rating: number
    image: string | null
  }
  venueProfile?: {
    type: string
    location: string
    capacity: number | null
    lookingFor: string | null
    image: string | null
  }
  events?: EventType[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null)
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Running" | "Completed">("Upcoming")

  const { updateUser, user } = useAuth()

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/profile`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data)

      if (user) {
        const image = data.image || data.artistProfile?.image || data.venueProfile?.image
        updateUser({
          ...user,
          name: data.name,
          image: image
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router, updateUser, user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      fetchProfile()
      window.location.reload()
    } catch (error) {
      console.error("Delete event error:", error)
      alert("Failed to delete event")
    }
  }

  const filteredEvents = useMemo(() => {
    if (!profile?.events) return []

    return profile.events.filter((event) => {
      const eventDate = new Date(event.date)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

      if (activeTab === "Upcoming") {
        return eventDay > today
      } else if (activeTab === "Running") {
        return eventDay.getTime() === today.getTime()
      } else {
        return eventDay < today
      }
    })
  }, [profile?.events, activeTab])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const profileImage = profile.image || profile.artistProfile?.image || profile.venueProfile?.image

  return (
    <div className="min-h-screen bg-background pt-64 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden border-4 border-background">
                {profileImage ? (
                  <img
                    src={`${profileImage}?t=${new Date().getTime()}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : profile.role === "VENUE" ? (
                  <Store className="w-16 h-16 text-white" />
                ) : profile.role === "ARTIST" ? (
                  <Mic2 className="w-16 h-16 text-white" />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                title="Edit Profile Picture"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center md:text-left space-y-2 flex-1">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold">{profile.name}</h1>
                  {profile.username && (
                    <p className="text-lg text-muted-foreground font-medium">@{profile.username}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 md:ml-auto">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" /> Edit Profile
                  </button>
                  {(profile.role === "VENUE" || profile.role === "ARTIST") && (
                    <button
                      onClick={() => setIsCreatePostModalOpen(true)}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Create Post
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
                <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {profile.role}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="md:col-span-1 space-y-8">
            <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Details
              </h2>

              <div className="space-y-4 text-sm">
                {profile.role === "ARTIST" && profile.artistProfile && (
                  <>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{profile.artistProfile.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {profile.artistProfile.location}
                      </span>
                    </div>
                    {profile.artistProfile.price && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">₹{profile.artistProfile.price}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" /> {profile.artistProfile.rating}
                      </span>
                    </div>
                  </>
                )}

                {profile.role === "VENUE" && profile.venueProfile && (
                  <>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{profile.venueProfile.type}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {profile.venueProfile.location}
                      </span>
                    </div>
                    {profile.venueProfile.capacity && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-medium">{profile.venueProfile.capacity} People</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                About
              </h2>
              <div className="prose prose-sm prose-invert">
                {profile.role === "ARTIST" && profile.artistProfile?.bio ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.artistProfile.bio}
                  </p>
                ) : profile.role === "VENUE" && profile.venueProfile?.lookingFor ? (
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold block mb-1">Looking For:</span>
                    {profile.venueProfile.lookingFor}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No bio available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Posts / Events */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-primary" />
              Posts & Events
            </h2>

            {profile.events && profile.events.length > 0 ? (
              <div className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-white/10 pb-2">
                  {["Upcoming", "Running", "Completed"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`pb-2 px-1 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-white"
                        }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="group relative w-full bg-card/50 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 hover:bg-card/80">


                      <div className="flex flex-col md:flex-row gap-6">
                        {event.image && (
                          <div className="w-full md:w-1/3 relative">
                            <img
                              src={event.image && event.image !== "" ? `${event.image}?t=${new Date().getTime()}` : "/assets/concert_crowd.png"}
                              className="h-48 md:h-40 w-full object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300"
                              alt={event.title}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/assets/concert_crowd.png";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div
                              className="text-xl font-bold text-neutral-600 dark:text-white"
                            >
                              {event.title}
                            </div>
                            <div>
                              {(() => {
                                const eventDate = new Date(event.date);
                                const now = new Date();
                                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                                const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

                                let status = "";
                                let colorClass = "";

                                if (eventDay > today) {
                                  status = "Upcoming";
                                  colorClass = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                                } else if (eventDay.getTime() === today.getTime()) {
                                  status = "Running";
                                  colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
                                } else {
                                  status = "Completed";
                                  colorClass = "bg-gray-500/10 text-gray-500 border-gray-500/20";
                                }

                                return (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                                    {status}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                          <p
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                          >
                            {event.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {event.location}
                              </span>
                            </div>

                            <div className="flex gap-2 self-end sm:self-auto">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  setEditingEvent(event)
                                  setIsEditEventModalOpen(true)
                                }}
                                className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                                title="Edit Event"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  handleDeleteEvent(event.id)
                                }}
                                className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredEvents.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No {activeTab.toLowerCase()} events found.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card/30 border border-dashed border-border rounded-3xl p-12 text-center">
                <p className="text-muted-foreground mb-4">No posts yet.</p>
                {(profile.role === "VENUE" || profile.role === "ARTIST") && (
                  <button
                    onClick={() => setIsCreatePostModalOpen(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Create your first post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={fetchProfile}
      />

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onCreated={fetchProfile}
      />

      <EditEventModal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        onUpdated={fetchProfile}
        event={editingEvent}
      />
    </div>
  )
}
