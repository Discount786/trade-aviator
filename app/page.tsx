"use client";

import { motion } from "framer-motion";
import DigitalGlobe3D from "@/components/DigitalGlobe3D";
import { useState, useEffect } from "react";

export default function Home() {
  const [showNav, setShowNav] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [showConsultation, setShowConsultation] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Calculate countdown from 7 days, 8 hours, 6 minutes, 32 seconds
    const initialTime = {
      days: 7,
      hours: 8,
      minutes: 6,
      seconds: 32,
    };
    
    // Store the start time when component mounts
    const startTime = new Date().getTime();
    const totalInitialSeconds = 
      initialTime.days * 24 * 60 * 60 +
      initialTime.hours * 60 * 60 +
      initialTime.minutes * 60 +
      initialTime.seconds;
    const endTime = startTime + totalInitialSeconds * 1000;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Countdown reached zero
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTimeLeft();
    // Optimized: Update every second directly instead of checking every 100ms
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ticking = false;
    let rafId: number | null = null;
    
    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          // Show nav and banner only when at the top of the page (within 100px)
          const scrollY = window.scrollY;
          if (scrollY < 100) {
        setShowNav(true);
            setShowBanner(true);
      } else {
        setShowNav(false);
            setShowBanner(false);
          }
          ticking = false;
          rafId = null;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)',
      color: '#FFFFFF'
    }}>
      {/* Countdown Banner */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ 
          opacity: showBanner ? 1 : 0,
          y: showBanner ? 0 : -100,
          pointerEvents: showBanner ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.40) 0%, rgba(37, 99, 235, 0.40) 50%, rgba(59, 130, 246, 0.40) 100%)',
          paddingTop: '4px',
          paddingBottom: 'calc(4px * 0.855625)',
          minHeight: 'auto',
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-5 flex flex-row items-center justify-center gap-1 md:gap-6 py-0.5 md:py-0">
          <div className="text-center md:text-left flex-shrink min-w-0">
            <span 
              className="font-bold text-[9px] md:text-lg lg:text-xl md:leading-tight banner-text-mobile" 
              style={{ 
                color: '#FFFFFF', 
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                display: 'block'
              }}
            >
              <span style={{ display: 'block', lineHeight: '1em' }}>FREE FOR A LIMITED TIME ONLY</span>
              <span style={{ display: 'block', lineHeight: '1em', marginTop: '0.1em' }}>USE CODE TA26 AT CHECKOUT</span>
            </span>
          </div>
          <div className="flex items-center gap-0.5 md:gap-4 flex-shrink-0">
            <div className="flex items-center gap-0.5 md:gap-2">
              <div className="text-center px-1 md:px-3 py-0.5 md:py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="font-bold text-xs md:text-xl" style={{ color: '#FFFFFF' }}>
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[8px] md:text-sm" style={{ color: '#FFFFFF', opacity: 0.9 }}>D</div>
              </div>
              <span className="font-bold text-xs md:text-xl" style={{ color: '#FFFFFF' }}>:</span>
              <div className="text-center px-1 md:px-3 py-0.5 md:py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="font-bold text-xs md:text-xl" style={{ color: '#FFFFFF' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[8px] md:text-sm" style={{ color: '#FFFFFF', opacity: 0.9 }}>H</div>
              </div>
              <span className="font-bold text-xs md:text-xl" style={{ color: '#FFFFFF' }}>:</span>
              <div className="text-center px-1 md:px-3 py-0.5 md:py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="font-bold text-xs md:text-xl" style={{ color: '#FFFFFF' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[8px] md:text-sm" style={{ color: '#FFFFFF', opacity: 0.9 }}>M</div>
              </div>
              <span className="font-bold text-xs md:text-xl" style={{ color: '#FFFFFF' }}>:</span>
              <div className="text-center px-1 md:px-3 py-0.5 md:py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="font-bold text-xs md:text-xl" style={{ color: '#FFFFFF' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[8px] md:text-sm" style={{ color: '#FFFFFF', opacity: 0.9 }}>S</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Digital 3D Globe */}
      <DigitalGlobe3D />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0, willChange: 'transform' }}>
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)',
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #3A8BFF 0%, transparent 70%)',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #56E0FF 0%, transparent 70%)',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: showNav ? 1 : 0,
          y: showNav ? 0 : -100,
          pointerEvents: showNav ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 right-0 z-50 ${showBanner ? 'nav-below-banner' : ''}`}
        style={{
          background: 'rgba(15, 15, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          top: showBanner ? undefined : '0px', // Use CSS class when banner is shown
        }}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-5 flex justify-between items-center h-14 md:h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center flex-1 min-w-0"
          >
            {/* Trade Aviator Logo */}
            <svg 
              className="h-auto" 
              viewBox="0 0 200 40" 
              style={{ 
                opacity: 1, 
                width: 'clamp(140px, 30vw, 244px)', 
                height: 'auto',
                maxWidth: '100%'
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              <rect x="5" y="25" width="4" height="8" fill="#D1D5DB" />
              <rect x="11" y="20" width="4" height="13" fill="#D1D5DB" />
              <rect x="17" y="12" width="4" height="21" fill="#D1D5DB" />
              <text 
                x="28" 
                y="18" 
                fontFamily="Arial, sans-serif" 
                fontSize="14.64" 
                fontWeight="bold" 
                fill="#FFFFFF" 
                letterSpacing="1.22"
              >
                TRADE
              </text>
              <text 
                x="28" 
                y="32" 
                fontFamily="Arial, sans-serif" 
                fontSize="14.64" 
                fontWeight="bold" 
                fill="#FFFFFF" 
                letterSpacing="1.22"
              >
                AVIATOR
              </text>
            </svg>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 md:gap-6 flex-shrink-0 ml-2"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-bold rounded-lg get-access-btn whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #3A8BFF, #56E0FF)',
                color: '#FFFFFF',
              }}
              onClick={(e) => {
                e.preventDefault();
                // Scroll directly to TRADE AVIATOR ACCESS product
                const tradeAviatorProduct = document.getElementById('trade-aviator-product');
                if (tradeAviatorProduct) {
                  const offset = 80; // Account for fixed navigation
                  const elementPosition = tradeAviatorProduct.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                } else {
                  // Fallback to products section if product not found
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    const offset = 80;
                    const elementPosition = productsSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
            >
              Get Access
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section 
        className={`relative min-h-screen px-5 ${showBanner ? 'hero-with-banner' : 'hero-no-banner'}`}
        style={{ zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Text Content - Centered, fixed position */}
          <div className="flex flex-col items-center justify-center" style={{ minHeight: '38.4vh' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-4 leading-[1.1] text-center digital-text"
              style={{ 
                color: '#FFFFFF', 
                fontWeight: 700, 
                maxWidth: '100%', 
                fontSize: 'clamp(1.4375rem, 4.6vw, 6.9rem)',
                fontFamily: 'monospace',
                textShadow: `
                  0 0 10px rgba(58, 139, 255, 0.8),
                  0 0 20px rgba(86, 224, 255, 0.6),
                  0 0 30px rgba(58, 139, 255, 0.4),
                  2px 2px 0px rgba(58, 139, 255, 0.3),
                  -1px -1px 0px rgba(86, 224, 255, 0.3)
                `,
                letterSpacing: '0.05em',
                willChange: 'text-shadow',
                transform: 'translateZ(0)',
                contain: 'layout style',
              }}
            >
              Advanced Trading Automation                            No<br />
              Experience Required.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block px-6 py-4 rounded-lg shiny-border"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                willChange: 'transform',
              }}
            >
              <p className="text-lg md:text-xl font-semibold text-center md:text-left" style={{ 
                color: '#FFFFFF', 
                fontSize: '1.15em',
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(255, 255, 255, 0.3)',
              }}>
                Trade consistently without spending hours in front of charts.{" "}
                <a 
                  href="#video"
                  onClick={(e) => {
                    e.preventDefault();
                    // Small delay to ensure smooth scroll on mobile
                    setTimeout(() => {
                      const videoElement = document.querySelector('video') || document.getElementById('video');
                    if (videoElement) {
                        const offset = 100; // Account for fixed navigation/banner
                        const elementPosition = videoElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }, 50);
                  }}
                  className="underline hover:no-underline font-bold cursor-pointer"
                  style={{ 
                    color: '#60a5fa',
                    textShadow: '0 0 8px rgba(96, 165, 250, 0.5)',
                  }}
                >
                  Watch this!
                </a>
              </p>
            </motion.div>
          </div>

          {/* Video Section - Positioned below without affecting text */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-2 md:px-0 mt-[2px] md:mt-8"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <div className="video-animated-border">
              <div className="relative rounded-xl overflow-hidden" style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}>
                <video
                  id="video"
                  className="w-full aspect-video object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
                  preload="metadata"
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                    contain: 'layout style paint',
                }}
                onError={(e) => {
                  console.error('Video failed to load:', e);
                }}
                onLoadedData={(e) => {
                  const video = e.currentTarget;
                  video.play().catch(() => {
                    // Auto-play was prevented, user interaction required
                  });
                }}
                onCanPlay={() => {
                  // Video is ready to play smoothly
                }}
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              </div>
            </div>
          </motion.div>

          {/* Featured On Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 mb-0"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold">
                <span style={{ 
                  background: 'linear-gradient(135deg, #A78BFA 0%, #3A8BFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Featured
                </span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {" "}On
                </span>
              </h3>
            </motion.div>
            
            {/* Animated Logos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative overflow-hidden" 
              style={{ height: '120px' }}
            >
              <motion.div
                className="flex items-center"
                animate={{
                  x: [0, -1200],
                }}
                transition={{
                  x: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
                style={{
                  position: 'absolute',
                  width: 'max-content',
                  willChange: 'transform',
                }}
              >
                {/* Multiple sets for seamless continuous loop */}
                {Array.from({ length: 4 }).map((_, setIndex) => (
                  <div key={setIndex} className="flex items-center" style={{ gap: '0px' }}>
                    <div className="text-3xl md:text-4xl font-bold italic px-8" style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                      MarketWatch
                    </div>
                    <div className="flex flex-col text-2xl md:text-3xl font-bold px-8" style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                      <span>BUSINESS</span>
                      <span>INSIDER</span>
                    </div>
                    <div className="text-2xl md:text-3xl font-normal px-8" style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                      yahoo!<span className="font-semibold">finance</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Most Traders FAIL Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative pt-0 pb-20 px-5" 
        style={{ zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Why Most Traders FAIL
            </h2>
            <p className="text-lg md:text-xl" style={{ color: '#A78BFA' }}>
              Top 3 reasons most fail - Here's Why...
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="rounded-xl p-4 md:p-6 flex flex-col items-center text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div 
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg mb-3 md:mb-4 flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #3A8BFF 100%)',
                }}
              >
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm md:text-xl" style={{ color: '#FFFFFF', lineHeight: '1.4', minHeight: '2.8rem', marginBottom: '0.5rem' }}>
                TIME WASTED
              </h3>
              <p className="leading-relaxed text-xs md:text-base" style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                Hours glued to charts — missing life & still missing the best moves.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-xl p-4 md:p-6 flex flex-col items-center text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div 
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg mb-3 md:mb-4 flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #3A8BFF 100%)',
                }}
              >
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm md:text-xl" style={{ color: '#FFFFFF', lineHeight: '1.4', minHeight: '2.8rem', marginBottom: '0.5rem' }}>
                FOMO = LOSS
              </h3>
              <p className="leading-relaxed text-xs md:text-base" style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                Overtrading & revenge trading — chasing setups to claw back losses until accounts blow.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="rounded-xl p-4 md:p-6 flex flex-col items-center text-center col-span-2 md:col-span-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div 
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg mb-3 md:mb-4 flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #3A8BFF 100%)',
                }}
              >
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm md:text-xl" style={{ color: '#FFFFFF', lineHeight: '1.4', minHeight: '2.8rem', marginBottom: '0.5rem' }}>
                LACKING CONSISTENCY
              </h3>
              <p className="leading-relaxed text-xs md:text-base" style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                Inconsistent results — no steady edge, just random wins and losses.
              </p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <motion.button
              onClick={() => {
                const tradeAviatorProduct = document.getElementById('trade-aviator-product');
                if (tradeAviatorProduct) {
                  const offset = 100; // Account for fixed navigation/banner
                  const elementPosition = tradeAviatorProduct.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                } else {
                  // Fallback to products section if product not found
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    const offset = 100;
                    const elementPosition = productsSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-bold text-lg"
              style={{
                background: 'linear-gradient(135deg, #3A8BFF 0%, #A78BFA 100%)',
                color: '#FFFFFF',
              }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Trade Aviator Works Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative pt-8 pb-20 px-5" 
        style={{ zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Why Trade Aviator Works
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#A78BFA' }}></div>
              <p className="text-lg md:text-xl" style={{ color: '#FFFFFF' }}>
                Intelligent AI flow. Risk aligned with precision.
              </p>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="rounded-xl p-4 md:p-6 flex flex-col items-center text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div 
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg mb-3 md:mb-4 flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #3A8BFF 100%)',
                }}
              >
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm md:text-xl" style={{ color: '#FFFFFF', lineHeight: '1.4', minHeight: '2.8rem', marginBottom: '0.5rem' }}>
                HUMAN EMOTION - REMOVED
              </h3>
              <p className="leading-relaxed text-xs md:text-base" style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                Emotion-free execution - rules-based quant logic removes fear, greed & hesitation.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-xl p-4 md:p-6 flex flex-col items-center text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div 
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg mb-3 md:mb-4 flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #3A8BFF 100%)',
                }}
              >
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm md:text-xl" style={{ color: '#FFFFFF', lineHeight: '1.4', minHeight: '2.8rem', marginBottom: '0.5rem' }}>
                FREEDOM
              </h3>
              <p className="leading-relaxed text-xs md:text-base" style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                Freedom from the charts - trade without being chained to charts all day.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="rounded-xl p-4 md:p-6 flex flex-col items-center text-center col-span-2 md:col-span-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div 
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg mb-3 md:mb-4 flex items-center justify-center mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #3A8BFF 100%)',
                }}
              >
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm md:text-xl" style={{ color: '#FFFFFF', lineHeight: '1.4', minHeight: '2.8rem', marginBottom: '0.5rem' }}>
                DATA DRIVEN PERFORMANCE
              </h3>
              <p className="leading-relaxed text-xs md:text-base" style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                Reliable performance - a steady edge designed to deliver repeatable results.
              </p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <motion.button
              onClick={() => {
                const tradeAviatorProduct = document.getElementById('trade-aviator-product');
                if (tradeAviatorProduct) {
                  const offset = 100; // Account for fixed navigation/banner
                  const elementPosition = tradeAviatorProduct.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                } else {
                  // Fallback to products section if product not found
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    const offset = 100;
                    const elementPosition = productsSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-bold text-lg"
              style={{
                background: 'linear-gradient(135deg, #3A8BFF 0%, #A78BFA 100%)',
                color: '#FFFFFF',
              }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Real Traders. Real Results. Section */}
      <motion.section 
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative pt-10 pb-20 px-5" 
        style={{ zIndex: 10, contain: 'layout style paint' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Real Traders. Real Results.
            </h2>
            <p className="text-lg md:text-xl" style={{ color: '#A78BFA' }}>
              Smart Entries. Real Edge.
            </p>
          </motion.div>

          {/* Trading Interfaces Row */}
          <div className="mb-6">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
            {[
              { num: 5, name: 'trading1' },
              { num: 6, name: 'trading2' },
              { num: 7, name: 'trading3' }
            ].map((item, i) => (
              <motion.div
                key={`trading-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="flex items-center justify-center"
                style={{
                  position: 'relative',
                }}
              >
                  <div className="animated-blue-border w-full" style={{ display: 'block', maxWidth: '100%' }}>
                  <img
                    src={`/trading${i + 1}.jpg.png`}
                    alt={`Trading interface ${item.num}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto"
                      style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                </div>
              </motion.div>
            ))}
            </div>
          </div>

          {/* Chat Interfaces Row */}
          <div className="mb-16">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
            {[
              { num: 8, name: 'chat1' },
              { num: 9, name: 'chat2' },
              { num: 10, name: 'chat3' }
            ].map((item, i) => (
              <motion.div
                key={`chat-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (i + 3) * 0.1 }}
                className="flex items-center justify-center"
                style={{
                  position: 'relative',
                }}
              >
                  <div className="animated-blue-border w-full" style={{ display: 'block', maxWidth: '100%' }}>
                  <img
                    src={`/chat${i + 1}.jpg.png`}
                    alt={`Chat interface ${item.num}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto"
                      style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                </div>
              </motion.div>
            ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="rounded-xl p-3 md:p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                <div 
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg"
                  style={{ background: '#A78BFA', color: '#FFFFFF' }}
                >
                  SS
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-base" style={{ color: '#FFFFFF' }}>Saim Saudagar</h4>
                  <p className="text-xs md:text-sm" style={{ color: '#A78BFA' }}>TA MEMBER</p>
                </div>
              </div>
              <p className="text-xs md:text-base leading-relaxed" style={{ color: '#E5E7EB' }}>
                "Such an easy set up and great returns, forever thankful to be part of this great investment!"
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-xl p-3 md:p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                <div 
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg"
                  style={{ background: '#A78BFA', color: '#FFFFFF' }}
                >
                  BA
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-base" style={{ color: '#FFFFFF' }}>Basheer Abdullah</h4>
                  <p className="text-xs md:text-sm" style={{ color: '#A78BFA' }}>TA MEMBER</p>
                </div>
              </div>
              <p className="text-xs md:text-base leading-relaxed" style={{ color: '#E5E7EB' }}>
                "I used to trade manually all day and lost 4 challenges. Now the EA earns while I sleep. Made 10% in 5 days. Highly recommended!"
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="rounded-xl p-3 md:p-6 col-span-2 md:col-span-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '200px',
                height: '100%',
              }}
            >
              <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                <div 
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg"
                  style={{ background: '#A78BFA', color: '#FFFFFF' }}
                >
                  DA
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-base" style={{ color: '#FFFFFF' }}>Daniell</h4>
                  <p className="text-xs md:text-sm" style={{ color: '#A78BFA' }}>TA MEMBER</p>
                </div>
              </div>
              <p className="text-xs md:text-base leading-relaxed" style={{ color: '#E5E7EB' }}>
                "First Auto Trader i have used and its worked wonders. Every week compounding my account for greater profits!"
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Product Purchase Section */}
      <motion.section
        id="products"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-4 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.95) 0%, rgba(27, 29, 39, 0.95) 100%)',
          zIndex: 10,
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Choose Your Trading Journey
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Select the perfect option to start your automated trading journey
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 items-stretch">
            {/* Product 1: A FREE TRADING EBOOK */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="rounded-3xl p-4 md:p-10 relative overflow-hidden flex flex-col group"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                border: '2px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                minHeight: '100%',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                }}
              />
              
              <div className="relative z-10 flex flex-col flex-grow">
                <div className="mb-6" style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div className="inline-block px-3 py-1 rounded-full mb-4"
                    style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#4ade80' }}>
                      Free
                    </span>
                  </div>
                  <motion.h3 
                    className="text-xl md:text-4xl font-bold mb-2"
                    style={{ 
                      color: '#FFFFFF',
                      textShadow: '0 0 15px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.3)',
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      textShadow: [
                        '0 0 15px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.3)',
                        '0 0 25px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.5)',
                        '0 0 15px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    FREE E BOOK
                  </motion.h3>
                </div>
                <div className="mb-4 md:mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-5xl font-bold" style={{ color: '#FFFFFF' }}>FREE</span>
                  </div>
                  <p className="text-xs md:text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    No credit card required
                  </p>
                </div>
                <div className="mb-4 md:mb-8">
                  <p className="text-xs md:text-base mb-2 md:mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Learn the fundamentals of trading with our comprehensive guide. Download instantly and start your journey.
                  </p>
                </div>
                <div className="mb-4 md:mb-8 space-y-2 md:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#4ade80" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Comprehensive Trading Guide</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#4ade80" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Instant Download</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#4ade80" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>PDF Format</span>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    const product = {
                      id: 'ebook',
                      name: 'FREE E BOOK',
                      price: 0,
                      features: ['Comprehensive Trading Guide', 'Instant Download', 'PDF Format']
                    };
                    localStorage.setItem('tradeAviatorCart', JSON.stringify([product]));
                    window.location.href = '/payment';
                  }}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all mt-auto relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <span className="relative z-10">Purchase Now</span>
                </motion.button>
            </div>
          </motion.div>

            {/* Product 2: TRADE AVIATOR - Featured */}
            <motion.div
              id="trade-aviator-product"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="rounded-3xl p-4 md:p-10 relative overflow-visible flex flex-col group"
              style={{
                background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
                border: '2px solid rgba(167, 139, 250, 0.5)',
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
                minHeight: '100%',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Popular Badge */}
              <div className="absolute -top-3 right-6 z-20">
                <div className="px-4 py-1.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)', boxShadow: '0 4px 15px rgba(58, 139, 255, 0.4)' }}>
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#FFFFFF' }}>
                    Most Popular
                  </span>
                </div>
              </div>

              {/* Animated gradient overlay */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                  background: 'linear-gradient(135deg, rgba(58, 139, 255, 0.1) 0%, rgba(86, 224, 255, 0.1) 100%)',
                }}
              />
              
              <div className="relative z-10 flex flex-col flex-grow">
                <div className="mb-6" style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '40px' }}>
                  <motion.h3 
                    className="text-xl md:text-4xl font-bold mb-2"
                    style={{ 
                      color: '#FFFFFF',
                      textShadow: '0 0 15px rgba(167, 139, 250, 0.6), 0 0 30px rgba(58, 139, 255, 0.3)',
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      textShadow: [
                        '0 0 15px rgba(167, 139, 250, 0.6), 0 0 30px rgba(58, 139, 255, 0.3)',
                        '0 0 25px rgba(167, 139, 250, 0.8), 0 0 40px rgba(58, 139, 255, 0.5)',
                        '0 0 15px rgba(167, 139, 250, 0.6), 0 0 30px rgba(58, 139, 255, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    TRADE AVIATOR ACCESS
                  </motion.h3>
                </div>
                <div className="mb-4 md:mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-5xl font-bold" style={{ color: '#FFFFFF' }}>£199</span>
                    <span className="text-sm md:text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Lifetime</span>
                  </div>
                  <p className="text-xs md:text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    One-time payment, lifetime access
                  </p>
                </div>
                <div className="mb-4 md:mb-8">
                  <p className="text-xs md:text-base mb-2 md:mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Ideal for Get started with Trade Aviator. Complete setup and lifetime access included.
                  </p>
                </div>
                <div className="mb-4 md:mb-8 space-y-2 md:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#A78BFA" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Trade Aviator Set Up</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#A78BFA" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Access to our Members Community</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#A78BFA" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Life time Auto Trading</span>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    const product = {
                      id: 'trade-aviator',
                      name: 'TRADE AVIATOR ACCESS',
                      price: 199,
                      features: ['Trade Aviator Set Up', 'Access to our Members Community', 'Life time Auto Trading']
                    };
                    localStorage.setItem('tradeAviatorCart', JSON.stringify([product]));
                    window.location.href = '/payment';
                  }}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(167, 139, 250, 0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all mt-auto relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                  color: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(58, 139, 255, 0.4)',
                  }}
                >
                  <span className="relative z-10">Purchase Now</span>
                </motion.button>
              </div>
          </motion.div>

            {/* Product 3: FUNDED ACCOUNTS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="rounded-3xl p-4 md:p-10 relative overflow-hidden flex flex-col group col-span-2 md:col-span-1"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                border: '2px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                minHeight: '100%',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                }}
              />
              
              <div className="relative z-10 flex flex-col flex-grow">
                <div className="mb-6" style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '40px' }}>
                  <motion.h3 
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ 
                      color: '#FFFFFF',
                      textShadow: '0 0 15px rgba(58, 139, 255, 0.6), 0 0 30px rgba(86, 224, 255, 0.3)',
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      textShadow: [
                        '0 0 15px rgba(58, 139, 255, 0.6), 0 0 30px rgba(86, 224, 255, 0.3)',
                        '0 0 25px rgba(58, 139, 255, 0.8), 0 0 40px rgba(86, 224, 255, 0.5)',
                        '0 0 15px rgba(58, 139, 255, 0.6), 0 0 30px rgba(86, 224, 255, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    FUNDED ACCOUNT SERVICE
                  </motion.h3>
                </div>
                <div className="mb-4 md:mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-5xl font-bold" style={{ color: '#FFFFFF' }}>POA</span>
                  </div>
                  <p className="text-xs md:text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Price On Application
                  </p>
                </div>
                <div className="mb-4 md:mb-8">
                  <p className="text-xs md:text-base mb-2 md:mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Guaranteed passed funded account within 48 hours. Professional trading support and private members community included.
                  </p>
                </div>
                <div className="mb-4 md:mb-8 space-y-2 md:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#3A8BFF" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#3A8BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Guaranteed Passed Funded Account Within 48 Hours</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#3A8BFF" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#3A8BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Professional Trading Support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#3A8BFF" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#3A8BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Private Members Community</span>
                  </div>
                </div>
            <motion.button
                  onClick={() => {
                    setShowConsultation(true);
                    setTimeout(() => {
                      const formSection = document.getElementById('consultation-form');
                      if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(58, 139, 255, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all mt-auto relative overflow-hidden"
              style={{
                    background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                color: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(58, 139, 255, 0.3)',
              }}
            >
                  <span className="relative z-10">Book Consultation</span>
            </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Consultation Form Section - Only visible when showConsultation is true */}
      {showConsultation && (
        <motion.section
          id="consultation-form"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-20 px-5"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.95) 0%, rgba(27, 29, 39, 0.95) 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Book Your Consultation
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Get in touch with our team to discuss your funded account needs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                border: '2px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: '#FFFFFF' }}>
                Book Your Consultation Today!
              </h3>
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <svg className="w-20 h-20 mx-auto" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.2"/>
                      <path d="M9 12L11 14L15 10" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                    Submitted. One Of Our Specialists Will Contact You.
                  </h3>
                  <motion.button
                    onClick={() => {
                      setShowConsultation(false);
                      setSubmitStatus('idle');
                      setConsultationForm({ name: '', email: '', phone: '' });
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-xl font-bold text-lg mt-6"
                    style={{
                      background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                      color: '#FFFFFF',
                    }}
                  >
                    Close
                  </motion.button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
              e.preventDefault();
                    setIsSubmitting(true);
                    setSubmitStatus('idle');

                    try {
                      const response = await fetch('/api/consultation', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(consultationForm),
                      });

                      const data = await response.json();

                      if (response.ok || data.success) {
                        setSubmitStatus('success');
                        setConsultationForm({ name: '', email: '', phone: '' });
                      } else {
                        setSubmitStatus('error');
                      }
                    } catch (error) {
                      console.error('Error submitting consultation:', error);
                      setSubmitStatus('error');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-6"
          >
            <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontSize: '16px',
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                      value={consultationForm.email}
                      onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                        fontSize: '16px',
                      }}
                      placeholder="Enter your email address"
              />
            </div>

            <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                required
                      value={consultationForm.phone}
                      onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl border transition-all focus:outline-none focus:ring-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                        fontSize: '16px',
                      }}
                      placeholder="Enter your phone number"
              />
            </div>

                  {submitStatus === 'error' && (
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      <p className="text-sm" style={{ color: '#f87171' }}>
                        Something went wrong. Please try again.
                      </p>
                    </div>
                  )}

            <motion.button
              type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, boxShadow: isSubmitting ? 'none' : '0 10px 25px rgba(58, 139, 255, 0.4)' }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all relative overflow-hidden"
              style={{
                      background: isSubmitting
                        ? 'rgba(58, 139, 255, 0.5)'
                        : 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                color: '#FFFFFF',
                      boxShadow: '0 4px 20px rgba(58, 139, 255, 0.3)',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
                    <span className="relative z-10">
                      {isSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
                    </span>
            </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowConsultation(false);
                      setSubmitStatus('idle');
                      setConsultationForm({ name: '', email: '', phone: '' });
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-semibold text-base transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                    }}
                  >
                    Cancel
                  </motion.button>
                </form>
              )}
            </motion.div>
        </div>
      </motion.section>
      )}

    </div>
  );
}
