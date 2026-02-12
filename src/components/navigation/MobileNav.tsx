"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAGE_NAMES, SECTION_IDS } from "@/config/defaults";
import { scrollToSection } from "@/lib/utils";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  function handleNavigate(id: string) {
    scrollToSection(id);
    setIsOpen(false);
  }

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50">
      {/* Top bar with hamburger */}
      <div className="flex items-center justify-between px-4 py-3 bg-studio-white border-b border-terrazzo-grey">
        <span className="type-body font-bold text-carbon-black">Interviewleitfaden</span>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Menü öffnen"
          className="p-2 text-carbon-black"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-studio-white z-50 overflow-y-auto"
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-terrazzo-grey">
              <span className="type-body font-bold text-carbon-black">Interviewleitfaden</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Menü schließen"
                className="p-2 text-carbon-black"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation items */}
            <ul className="flex flex-col gap-1 p-4">
              {PAGE_NAMES.map((name, index) => (
                <li key={SECTION_IDS[index]}>
                  <button
                    onClick={() => handleNavigate(SECTION_IDS[index])}
                    className="w-full text-left px-4 py-3 text-base text-carbon-black hover:text-botanical-green hover:bg-terrazzo-grey/40 rounded-md transition-colors"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
