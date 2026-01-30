'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full bg-[#6e89a9] z-50 text-gray-50 absolute top-0 h-20 flex shadow-sm">
      <div className="flex justify-between w-full items-center px-4 md:px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-[#f1f5e9] flex items-center hover:text-gray-700 transition-colors duration-200 text-xl md:text-2xl"
          onClick={closeMobileMenu}
        >
          INSEE
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/"
            className="py-4 font-bold text-xl text-[#f1f5e9] justify-center items-center mx-6 hover:text-gray-700 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="#purpose"
            className="py-4 font-bold text-xl text-[#f1f5e9] justify-center items-center mx-6 hover:text-gray-700 transition-colors duration-200"
          >
            Purpose
          </Link>
          <Link
            href="#How-it-Works"
            className="py-4 font-bold text-xl text-[#f1f5e9] justify-center items-center mx-6 hover:text-gray-700 transition-colors duration-200"
          >
            How it Works
          </Link>
          <Link
            href="#features"
            className="py-4 font-bold text-xl text-[#f1f5e9] justify-center items-center mx-6 hover:text-gray-700 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="py-4 font-bold text-xl text-[#f1f5e9] justify-center items-center mx-6 hover:text-gray-700 transition-colors duration-200"
          >
            Benefits
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex justify-center items-center gap-3">
          {!user ? (
            <>
              <Link href="/register">
                <div className="px-4 py-2 md:px-6 md:py-2.5 font-semibold bg-[#3c749b] rounded-md text-gray-50 text-sm md:text-lg cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Register
                </div>
              </Link>

              <Link href="/login">
                <div className="px-4 py-2 md:px-6 md:py-2.5 bg-gray-800 font-semibold  rounded-md text-sm md:text-lg cursor-pointer hover:border-gray-950 hover:bg-[#3c749b] transition-all duration-200 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5">
                  Signin
                </div>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 md:px-6 md:py-2.5 font-semibold bg-red-600 rounded-md text-white text-sm md:text-lg cursor-pointer hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed top-20 left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isMobileMenuOpen
            ? 'opacity-100 max-h-screen'
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col py-4 px-4">
          {/* Mobile Navigation Links */}
          <Link
            href="/"
            className="py-3 font-bold text-black hover:text-gray-700 transition-colors duration-200 border-b border-gray-200"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            href="#purpose"
            className="py-3 font-bold text-black hover:text-gray-700 transition-colors duration-200 border-b border-gray-200"
            onClick={closeMobileMenu}
          >
            Purpose
          </Link>
          <Link
            href="#How-it-Works"
            className="py-3 font-bold text-black hover:text-gray-700 transition-colors duration-200 border-b border-gray-200"
            onClick={closeMobileMenu}
          >
            How it Works
          </Link>
          <Link
            href="#features"
            className="py-3 font-bold text-black hover:text-gray-700 transition-colors duration-200 border-b border-gray-200"
            onClick={closeMobileMenu}
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="py-3 font-bold text-black hover:text-gray-700 transition-colors duration-200 border-b border-gray-200"
            onClick={closeMobileMenu}
          >
            Benefits
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
            {!user ? (
              <>
                <Link href="/register" onClick={closeMobileMenu}>
                  <div className="w-full px-6 py-3 font-semibold bg-black rounded-md text-white text-center cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-md">
                    Register
                  </div>
                </Link>

                <Link href="/login" onClick={closeMobileMenu}>
                  <div className="w-full px-6 py-3 font-semibold border-2 border-gray-300 rounded-md text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm">
                    Signin
                  </div>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 font-semibold bg-red-600 rounded-md text-white cursor-pointer hover:bg-red-700 transition-all duration-200 shadow-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
