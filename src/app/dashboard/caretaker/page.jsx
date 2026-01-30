'use client'

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Navbar from "@/app/components/Navbar"

// ✅ TEMP cane ID (later this will come from DB mapping)
const CANE_ID = "fbfea03d-b80e-43c9-af3d-fd8c72779470"

// Leaflet (NO SSR)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false })

export default function CaretakerDashboard() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [location, setLocation] = useState(null)
  const [history, setHistory] = useState([])

  const [loadingLocation, setLoadingLocation] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(true)

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

  // 📡 SEND CURRENT DEVICE LOCATION (LIVE + HISTORY)
  useEffect(() => {
    if (!user) return

    if (!navigator.geolocation) {
      console.error("Geolocation not supported")
      return
    }

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          const now = new Date().toISOString()

          // 🔴 Live location (1 row per cane)
          await supabase
            .from("live_location")
            .upsert(
              {
                cane_id: CANE_ID,
                latitude,
                longitude,
                updated_at: now
              },
              { onConflict: "cane_id" }
            )

          // 🟢 Location history (multiple rows)
          await supabase
            .from("location_history")
            .insert({
              cane_id: CANE_ID,
              latitude,
              longitude,
              created_at: now
            })
        },
        (err) => console.error("GPS error:", err),
        { enableHighAccuracy: true }
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [user])

  // 📍 FETCH LIVE LOCATION + REALTIME
  useEffect(() => {
    if (!user) return

    const fetchLiveLocation = async () => {
      const { data } = await supabase
        .from("live_location")
        .select("*")
        .eq("cane_id", CANE_ID)
        .maybeSingle()

      setLocation(data)
      setLoadingLocation(false)
    }

    fetchLiveLocation()

    const channel = supabase
      .channel("live-location")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_location",
          filter: `cane_id=eq.${CANE_ID}`
        },
        payload => setLocation(payload.new)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  // 📜 FETCH LOCATION HISTORY
  useEffect(() => {
    if (!user) return

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("location_history")
        .select("latitude, longitude, created_at")
        .eq("cane_id", CANE_ID)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error(error)
      } else {
        setHistory(data)
      }

      setLoadingHistory(false)
    }

    fetchHistory()
  }, [user])

  // ⏳ LOAD STATES
  if (authLoading) return <p className="p-10">Checking authentication...</p>
  if (loadingLocation) return <p className="p-10">Loading live location...</p>
  if (!location) return <p className="p-10">No live location data</p>

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Caretaker Dashboard</h1>

        <p>Latitude: {location.latitude.toFixed(6)}</p>
        <p>Longitude: {location.longitude.toFixed(6)}</p>

        <div style={{ height: 500 }} className="mt-4">
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>Live Cane Location</Popup>
            </Marker>
          </MapContainer>  
        </div>
      </div>

      {/* 📜 HISTORY */}
      <div className="mx-6 mt-6 bg-slate-400 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Location History</h3>

        {loadingHistory ? (
          <p className="text-sm text-gray-500">Loading history.</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-500">No history data</p>
        ) : (
          <div className="space-y-2 text-sm">
            {history.map((item, index) => (
              <div key={index} className="flex justify-between border-b pb-1">
                <span>
                  {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                </span>
                <span className="text-gray-500">
                  {new Date(item.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
