"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import MenuBar from "./MenuBar";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-60 h-12 w-12 rounded-full bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <span className="sr-only">Toggle menu</span>
        <motion.span
          className="relative block h-4 w-6"
          initial={false}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: -6 },
              open: { rotate: 45, y: 0 },
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white rounded-full"
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white rounded-full"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 6 },
              open: { rotate: -45, y: 0 },
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white rounded-full"
          />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm rounded-3xl border border-white/10 bg-black/80 p-6 shadow-2xl"
              >
                <MenuBar onNavigate={closeMenu} />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

