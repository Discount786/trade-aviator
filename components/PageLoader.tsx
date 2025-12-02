"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoadingGlobe from "./LoadingGlobe";

export default function PageLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show loading when pathname changes (navigation occurred)
    if (pathname && pathname !== prevPathnameRef.current) {
      setIsLoading(true);
      prevPathnameRef.current = pathname;
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Hide loading after page has loaded and rendered
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }
  }, [pathname]);

  // Listen for link clicks to show loading immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]');
      
      if (link) {
        const href = (link as HTMLAnchorElement).href;
        const currentOrigin = window.location.origin;
        const currentPath = window.location.pathname;
        
        // Only show loading for internal links that change the page
        if (href.startsWith(currentOrigin)) {
          const url = new URL(href);
          // Don't show for hash-only links (same page anchors like #video)
          // Only show loading if pathname actually changes (different page)
          if (url.pathname === currentPath && url.hash) {
            // This is a hash link on the same page - don't show loading
            return;
          }
          // Only show loading if navigating to a different page
          if (url.pathname !== currentPath && !isLoading) {
            setIsLoading(true);
          }
        }
      }
    };

    // Listen for programmatic navigation
    const handlePopState = () => {
      if (!isLoading) {
        setIsLoading(true);
      }
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.98) 0%, rgba(27, 29, 39, 0.98) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingGlobe size={120} />
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
                Loading
              </span>
              <motion.div
                className="flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#3bc7ff' }}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

