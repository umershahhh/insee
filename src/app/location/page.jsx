"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LocationPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const startTracking = async () => {
      try {
        // 1️⃣ Get logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Please log in to start tracking");
          setIsInitializing(false);
          return;
        }

        // 2️⃣ Fetch caretaker's cane
        const { data: cane, error: caneError } = await supabase
          .from("canes")
          .select("id")
          .eq("caretaker_id", user.id)
          .single();

        if (caneError || !cane) {
          setError("No cane assigned to this account");
          setIsInitializing(false);
          return;
        }

        const caneId = cane.id;

        // 3️⃣ Start GPS tracking
        const watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const timestamp = new Date();

            setCurrentLocation({ latitude, longitude });
            setLastUpdate(timestamp);
            setIsTracking(true);
            setIsInitializing(false);
            setError(null);

            // 4️⃣ UPSERT using cane_id (✅ FIX)
            await supabase.from("live_location").upsert(
              {
                cane_id: caneId,
                latitude,
                longitude,
                updated_at: timestamp.toISOString(),
              },
              { onConflict: "cane_id" },
            );

            // Save movement history (NO upsert)
            await supabase.from("location_history").insert({
              cane_id: caneId,
              latitude,
              longitude,
            });
          },
          (geoError) => {
            setIsInitializing(false);
            setIsTracking(false);
            setError("Failed to get location");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );

        return () => navigator.geolocation.clearWatch(watchId);
      } catch (err) {
        console.error(err);
        setError("Unexpected error");
        setIsInitializing(false);
      }
    };

    startTracking();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Initializing Location Tracking
          </h2>
          <p className="text-gray-600">Requesting location access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Location Tracking
          </h1>
          <p className="text-gray-600">
            Share your real-time location with your caretaker
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isTracking ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isTracking ? (
                  <div className="relative">
                    <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-8 h-8 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isTracking ? "Tracking Active" : "Tracking Inactive"}
                </h2>
                <p className="text-gray-600">
                  {isTracking
                    ? "Your location is being shared in real-time"
                    : "Location tracking is currently unavailable"}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="text-red-500 text-xl mr-3">⚠️</div>
                <div>
                  <p className="text-red-800 font-semibold">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Current Location Display */}
          {currentLocation && isTracking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      Latitude
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentLocation.latitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="text-3xl">🌐</div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      Longitude
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="text-3xl">🗺️</div>
                </div>
              </div>
            </div>
          )}

          {/* Last Update */}
          {lastUpdate && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last updated:</span>{" "}
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>ℹ️</span>
            Important Instructions
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 font-bold mt-1">•</span>
              <span>
                Keep this page open in your browser for continuous tracking
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 font-bold mt-1">•</span>
              <span>
                Make sure location permissions are enabled in your browser
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 font-bold mt-1">•</span>
              <span>
                Your location is automatically updated and shared with your
                caretaker
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 font-bold mt-1">•</span>
              <span>
                Do not close this tab or navigate away to maintain tracking
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
