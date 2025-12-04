"use client"

import { useState, useEffect, Suspense } from "react"
import { artists, venues } from "@/lib/data"

import Image from "next/image"
import { Search, Filter, MapPin, Star, Calendar, ArrowUpDown } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { ParallaxHeader } from "@/components/ui/parallax-header"
import { useLocation } from "@/contexts/location-context"

function ExploreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const typeParam = searchParams.get("type")
  const { city, setCity, coordinates } = useLocation()

  const [activeTab, setActiveTab] = useState<"talent" | "venues" | "events">("talent")
  const [artists, setArtists] = useState<any[]>([])
  const [venues, setVenues] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    if (typeParam === "events") {
      setActiveTab("events")
    } else if (typeParam === "venues") {
      setActiveTab("venues")
    } else {
      setActiveTab("talent")
    }
  }, [typeParam])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch Artists
        const artistsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users?role=ARTIST`, { cache: "no-store" })
        const artistsData = await artistsRes.json()
        setArtists(artistsData)

        // Fetch Venues
        const venuesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users?role=VENUE`, { cache: "no-store" })
        const venuesData = await venuesRes.json()
        setVenues(venuesData)

        // Fetch Events
        const eventsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/events`, { cache: "no-store" })
        const eventsData = await eventsRes.json()
        if (Array.isArray(eventsData)) {
          setEvents(eventsData)
        } else {
          console.error("Events data is not an array:", eventsData)
          setEvents([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTabChange = (tab: "talent" | "venues" | "events") => {
    setActiveTab(tab)
    router.push(`/explore?type=${tab}`, { scroll: false })
  }

  const handleAction = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    alert("Request sent successfully!")
  }

  const [searchQuery, setSearchQuery] = useState("")

  const filterItems = (items: any[]) => {
    const filtered = items.filter(item => {
      const location = item.artistProfile?.location || item.venueProfile?.location || item.location || ""
      const name = item.name || item.title || ""

      const matchesLocation = city === "All India" || location.toLowerCase().includes(city.toLowerCase())
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.artistProfile?.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.venueProfile?.type || "").toLowerCase().includes(searchQuery.toLowerCase())

      return matchesLocation && matchesSearch
    })

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date).getTime()
      const dateB = new Date(b.createdAt || b.date).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })
  }

  const filteredArtists = filterItems(artists)
  const filteredVenues = filterItems(venues)
  const filteredEvents = filterItems(events)

  return (
    <div className="min-h-screen bg-background">
      <ParallaxHeader
        title={activeTab === "talent" ? "Find Talent" : activeTab === "venues" ? "Find Venues" : "Find Events"}
        subtitle={coordinates ? "Showing results near your live location" : `Discover the best in ${city === "All India" ? "India" : city}.`}
        image={activeTab === "talent" ? "/assets/singer.png" : "/assets/concert_crowd.png"}
      />

      <div className="container mx-auto px-4 pb-20 -mt-10 relative z-20">
        {/* Filters & Tabs */}
        {/* Filters & Tabs */}
        <div className="flex flex-col gap-6 mb-12 bg-card/50 backdrop-blur-md p-6 rounded-3xl border border-border/50 shadow-xl">
          {/* Top Row: Tabs and Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-muted p-1 rounded-full overflow-x-auto max-w-full no-scrollbar">
              <button
                onClick={() => handleTabChange("talent")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "talent"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
              >
                Find Talent
              </button>
              <button
                onClick={() => handleTabChange("venues")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "venues"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
              >
                Find Venues
              </button>
              <button
                onClick={() => handleTabChange("events")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "events"
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
              >
                Find Events
              </button>
            </div>

            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={`Search ${activeTab === "talent" ? "artists, categories..." : activeTab === "venues" ? "venues, locations..." : "events..."}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Bottom Row: Category Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-border/50">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 mr-2 text-sm font-medium text-muted-foreground">
                <Filter className="w-4 h-4" /> Filters:
              </div>

              {activeTab === "talent" && (
                <>
                  {["All", "Band", "Musicians", "Singers", "Dancers", "Stand up artists", "Beatboxers", "Dj", "Actors", "Poets", "Anchors", "Others"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchQuery(cat === "All" ? "" : cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${(cat === "All" && searchQuery === "") || searchQuery === cat
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border hover:border-primary/50 hover:bg-muted"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </>
              )}

              {activeTab === "venues" && (
                <>
                  {["All", "Cafe", "Club", "Restaurant", "Event Hall"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSearchQuery(type === "All" ? "" : type)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${(type === "All" && searchQuery === "") || searchQuery === type
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border hover:border-primary/50 hover:bg-muted"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </>
              )}

              {activeTab === "events" && (
                <span className="text-xs text-muted-foreground italic">Search by event title or location</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === "talent" && (
              filteredArtists.length > 0 ? (
                filteredArtists.map((artist) => (
                  <div key={artist.id} className="group relative w-full bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div className="w-full overflow-hidden">
                      <img
                        src={artist.artistProfile?.image ? `${artist.artistProfile.image}?t=${new Date().getTime()}` : "/assets/singer.png"}
                        className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={artist.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/singer.png";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                          {artist.name}
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                          <Star className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{artist.artistProfile?.rating || "New"}</span>
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 font-semibold text-sm mb-4">
                        {artist.artistProfile?.category}
                      </p>
                      <div className="mb-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
                          <MapPin className="w-3 h-3" /> {artist.artistProfile?.location}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="text-lg font-bold text-neutral-900 dark:text-white">
                          {artist.artistProfile?.price || "Contact for price"}
                        </div>
                        <button onClick={handleAction} className="px-5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  No artists found in {city}.
                  {city !== "All India" && (
                    <button onClick={() => setCity("All India")} className="text-primary hover:underline ml-2 font-medium">
                      View all artists
                    </button>
                  )}
                </div>
              )
            )}

            {activeTab === "venues" && (
              filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <div key={venue.id} className="group relative w-full bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div className="w-full overflow-hidden">
                      <img
                        src={venue.venueProfile?.image ? `${venue.venueProfile.image}?t=${new Date().getTime()}` : "/assets/concert_crowd.png"}
                        className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={venue.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/concert_crowd.png";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                          {venue.name}
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 font-semibold text-sm mb-4">
                        {venue.venueProfile?.type}
                      </p>
                      <div className="mb-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
                          <MapPin className="w-3 h-3" /> {venue.venueProfile?.location}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-4">
                        <div className="flex-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate">
                          <span className="font-bold text-neutral-900 dark:text-white">Needs:</span> {venue.venueProfile?.lookingFor || "Open for events"}
                        </div>
                        <button onClick={handleAction} className="px-5 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  No venues found in {city}.
                  {city !== "All India" && (
                    <button onClick={() => setCity("All India")} className="text-primary hover:underline ml-2 font-medium">
                      View all venues
                    </button>
                  )}
                </div>
              )
            )}

            {activeTab === "events" && (
              filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div key={event.id} className="group relative w-full bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
                    <div className="w-full overflow-hidden">
                      <img
                        src={event.image ? `${event.image}?t=${new Date().getTime()}` : "/assets/concert_crowd.png"}
                        className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={event.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/concert_crowd.png";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                          {event.title}
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 font-semibold text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {event.location}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="text-sm font-medium text-neutral-500">
                          By {event.creator?.name}
                        </div>
                        <button onClick={handleAction} className="px-5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  No events found in {city}.
                  {city !== "All India" && (
                    <button onClick={() => setCity("All India")} className="text-primary hover:underline ml-2 font-medium">
                      View all events
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  )
}
