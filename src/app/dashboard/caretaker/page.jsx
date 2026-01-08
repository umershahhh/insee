'use client'

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import "@/lib/leafletIconFix"
import Navbar from "@/app/components/Navbar"

// ✅ Dynamically import Leaflet components (NO SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

export default function CaretakerDashboard() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [location, setLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 🔐 AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setUser(user)
      setAuthLoading(false)
    }

    checkAuth()
  }, [router])

  // 📍 LOCATION FETCH + REALTIME
  useEffect(() => {
    if (!user) return

    const fetchLocation = async () => {
      try {
        const { data } = await supabase
          .from("live_location")
          .select("*")
          .single()

        setLocation(data)
      } catch (error) {
        console.error("Error fetching location:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()

    const channel = supabase
      .channel("live-location")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_location" },
        (payload) => {
          setLocation(payload.new)
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  // ⏳ AUTH LOADING UI
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    )
  }

  // ⏳ LOCATION LOADING UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Location
          </h2>
          <p className="text-gray-600">Waiting for location data...</p>
        </div>
      </div>
    )
  }

  // 🚫 NO LOCATION UI
  if (!location) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Location Available
            </h2>
            <p className="text-gray-600">
              Waiting for location data to be shared...
            </p>
          </div>
        </div>
      </>
    )
  }

  // ✅ DASHBOARD UI
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Caretaker Dashboard
            </h1>
            <p className="text-gray-600">Real-time location tracking</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 font-medium">Latitude</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {location.latitude.toFixed(6)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 font-medium">Longitude</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {location.longitude.toFixed(6)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 font-medium">Status</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                Live
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Live Location Map</h2>
            </div>

            <div style={{ height: "600px", width: "100%" }}>
              <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[location.latitude, location.longitude]}>
                  <Popup>
                    {location.latitude.toFixed(6)},{" "}
                    {location.longitude.toFixed(6)}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">
              Last updated:{" "}
              {new Date(location.updated_at).toLocaleString()}
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
