'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Check session on load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="w-full bg-white z-100 text-black absolute top-0 h-20 flex">
      <div className="flex justify-between w-full">
        <Link
          href="/"
          className="py-4 font-bold text-black justify-center items-center mx-10 hover:text-gray-700 transition-colors duration-200"
        >
          INSEE
        </Link>
        <div className=" flex items-center">
        <Link
          href="/"
          className="py-4 font-bold text-black justify-center items-center mx-10 hover:text-gray-700 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="#purpose"
          className="py-4 font-bold text-black justify-center items-center mx-10 hover:text-gray-700 transition-colors duration-200"
        >
          Purpose
        </Link>
        <Link
          href="/"
          className="py-4 font-bold text-black justify-center items-center mx-10 hover:text-gray-700 transition-colors duration-200"
        >
          Features
        </Link>
        <Link
          href="/"
          className="py-4 font-bold text-black justify-center items-center mx-10 hover:text-gray-700 transition-colors duration-200"
        >
          Benefits
        </Link>

        </div>

        <div className="flex mx-16 justify-center items-center gap-3">
          {!user ? (
            <>
              <Link href="/register">
                <div className="px-6 py-2.5 font-semibold bg-black rounded-md text-white text-lg cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Register
                </div>
              </Link>

              <Link href="/login">
                <div className="px-6 py-2.5 font-semibold border-2 border-gray-300 rounded-md text-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
                  Signin
                </div>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 font-semibold bg-red-600 rounded-md text-white text-lg cursor-pointer hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
