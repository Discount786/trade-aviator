"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('tradeAviatorCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('tradeAviatorCart', JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Save cart to localStorage and redirect to payment
    localStorage.setItem('tradeAviatorCart', JSON.stringify(cartItems));
    router.push('/payment');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)',
      color: '#FFFFFF'
    }}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
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
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'transparent', padding: '20px 0' }}>
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <svg width="244" height="49" viewBox="0 0 200 40" style={{ opacity: 1 }}>
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
          </Link>
        </div>
      </nav>

      {/* Cart Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20" style={{ zIndex: 10, paddingTop: '120px' }}>
        <div className="max-w-4xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Shopping Cart
            </h1>
            <Link href="/" className="text-base" style={{ color: '#A78BFA' }}>
              ← Continue Shopping
            </Link>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <p className="text-xl mb-4" style={{ color: '#FFFFFF' }}>Your cart is empty</p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 50%, #A78BFA 100%)',
                    color: '#FFFFFF',
                  }}
                >
                  Browse Products
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl p-6 flex justify-between items-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
                        {item.name}
                      </h3>
                      <div className="text-2xl font-bold" style={{ color: '#A78BFA' }}>
                        {item.price === 0 ? 'FREE' : `£${item.price}`}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => removeFromCart(item.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg"
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span style={{ color: '#E5E7EB' }}>{item.name}</span>
                      <span style={{ color: '#FFFFFF' }}>
                        {item.price === 0 ? 'FREE' : `£${item.price}`}
                      </span>
                    </div>
                  ))}
                  <div className="pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Total</span>
                      <span className="text-3xl font-bold" style={{ color: '#A78BFA' }}>
                        £{total}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={handleCheckout}
                  disabled={isSubmitting || cartItems.length === 0}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className="w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 50%, #A78BFA 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(86, 224, 255, 0.3)',
                  }}
                >
                  {isSubmitting ? 'Processing...' : `Proceed to Checkout - £${total}`}
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

