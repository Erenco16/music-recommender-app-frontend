"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

// Apply Montserrat Font
const customFont = "font-[Montserrat]";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_token_expiration");
    router.replace("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }} // Fade in from top
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative fixed top-0 left-0 z-50 ${customFont}`}
      style={{
        background: "linear-gradient(to bottom, #1a1a1a, #0d0d0d)", // Black to dark gray
        borderBottom: "2px solid #0d0d0d", // Match background
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg sm:text-xl font-bold tracking-wide">Music Recommender</h1>
      </div>

      {/* Desktop Logout Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLogout}
        className="hidden sm:flex items-center gap-2 bg-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition"
      >
        <FiLogOut className="text-lg" />
        Logout
      </motion.button>

      {/* Mobile Menu Button with Animation */}
      <motion.button
        whileTap={{ scale: 0.9, rotate: 90 }}
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden z-50"
      >
        {menuOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
      </motion.button>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 w-full bg-gray-900 flex flex-col items-center gap-4 p-4 sm:hidden shadow-lg"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition"
            >
              <FiLogOut className="text-lg" />
              Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
