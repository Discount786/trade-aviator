"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export default function PaymentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');
  
  const validCodes = ['NZ57', 'FREE26', 'TA26'];

  useEffect(() => {
    setIsClient(true);
    try {
      const savedCart = localStorage.getItem('tradeAviatorCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  const applyDiscount = (code: string) => {
    const upperCode = code.toUpperCase().trim();
    if (validCodes.includes(upperCode)) {
      setDiscountApplied(true);
      setDiscountError('');
      setDiscountCode(upperCode);
      // Update cart items to apply discount to Trade Aviator
      const updatedItems = cartItems.map(item => {
        if (item.id === 'trade-aviator' || item.name === 'TRADE AVIATOR ACCESS') {
          return { ...item, price: 0, originalPrice: item.price };
        }
        return item;
      });
      setCartItems(updatedItems);
      localStorage.setItem('tradeAviatorCart', JSON.stringify(updatedItems));
    } else {
      setDiscountError('Invalid discount code');
      setDiscountApplied(false);
    }
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountApplied(false);
    setDiscountError('');
    // Restore original prices
    const updatedItems = cartItems.map(item => {
      if (item.id === 'trade-aviator' || item.name === 'TRADE AVIATOR ACCESS') {
        return { ...item, price: (item as any).originalPrice || 199 };
      }
      return item;
    });
    setCartItems(updatedItems);
    localStorage.setItem('tradeAviatorCart', JSON.stringify(updatedItems));
  };

  const total = cartItems.reduce((sum: number, item: CartItem) => {
    return sum + item.price;
  }, 0);
  
  const hasTradeAviator = cartItems.some(item => item.id === 'trade-aviator' || item.name === 'TRADE AVIATOR ACCESS');

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)', color: '#FFFFFF' }}>
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)', color: '#FFFFFF', position: 'relative' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
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
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(15, 15, 18, 0.8)', backdropFilter: 'blur(10px)', padding: '20px 0' }}>
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

      {/* Payment Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20" style={{ zIndex: 10, paddingTop: '120px' }}>
        <div className="max-w-7xl w-full mx-auto" style={{ position: 'relative', zIndex: 20 }}>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Secure Checkout
            </h1>
            <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Complete your purchase in just a few steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary - Left Side */}
            <div className="lg:col-span-1">
              {cartItems.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-3xl p-8 sticky top-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
                    border: '2px solid rgba(167, 139, 250, 0.3)',
                    boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
                    Order Summary
                  </h3>
                  <div className="space-y-5 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="pb-5 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold pr-4" style={{ color: '#FFFFFF' }}>
                            {item.name}
                          </h4>
                          <span className="text-xl font-bold whitespace-nowrap" style={{ color: '#FFFFFF' }}>
                            {item.price === 0 ? 'FREE' : `£${item.price}`}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {item.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#A78BFA" opacity="0.2"/>
                                <path d="M9 12L11 14L15 10" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Discount Code Section */}
                  {hasTradeAviator && (
                    <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                      {!discountApplied ? (
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#E5E7EB' }}>
                            Discount Code
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={discountCode}
                              onChange={(e) => setDiscountCode(e.target.value)}
                              placeholder="Enter code"
                              className="flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderColor: discountError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.15)',
                                color: '#FFFFFF',
                                fontSize: '14px',
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#56E0FF';
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = discountError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.15)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (discountCode) {
                                    applyDiscount(discountCode);
                                  }
                                }
                              }}
                            />
                            <motion.button
                              type="button"
                              onClick={() => discountCode && applyDiscount(discountCode)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 rounded-lg font-semibold text-sm"
                              style={{
                                background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                                color: '#FFFFFF',
                              }}
                            >
                              Apply
                            </motion.button>
                          </div>
                          {discountError && (
                            <p className="text-xs mt-2" style={{ color: '#f87171' }}>{discountError}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                          <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4ade80" strokeWidth="2"/>
                              <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
                              Code Applied: {discountCode.toUpperCase()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={removeDiscount}
                            className="text-xs underline"
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-5 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Subtotal</span>
                      <span className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
                        £{total}
                      </span>
                    </div>
                    {discountApplied && hasTradeAviator && (() => {
                      const tradeAviatorItem = cartItems.find(item => item.id === 'trade-aviator' || item.name === 'TRADE AVIATOR ACCESS');
                      const discountAmount = (tradeAviatorItem as any)?.originalPrice || 199;
                      return (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm" style={{ color: '#4ade80' }}>Discount Applied</span>
                          <span className="text-sm font-bold" style={{ color: '#4ade80' }}>
                            -£{discountAmount}
                          </span>
                        </div>
                      );
                    })()}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Total</span>
                      <span className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
                        £{total}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-3xl p-8 text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <p className="text-lg mb-4" style={{ color: '#FFFFFF' }}>Your cart is empty</p>
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 50%, #A78BFA 100%)',
                        color: '#FFFFFF',
                      }}
                    >
                      Browse Products
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Payment Form - Right Side */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl p-8 md:p-10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
                    Secure SSL Encrypted Checkout
                  </span>
                </div>

                <form
                  className="space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    setSubmitStatus('idle');

                    const formData = new FormData(e.currentTarget);
                    const name = formData.get('name') as string;
                    const email = formData.get('email') as string;
                    const phone = formData.get('phone') as string;

                    try {
                      // Handle free purchases directly (skip Stripe)
                      if (total === 0) {
                        // Process free purchase and send email
                        try {
                          const freeResponse = await fetch('/api/process-free-purchase', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              items: cartItems,
                              customerEmail: email,
                              customerName: name,
                              customerPhone: phone,
                              discountCode: discountApplied ? discountCode : null,
                            }),
                          });

                          if (freeResponse.ok) {
                            const freeData = await freeResponse.json();
                            console.log('✅ Free purchase processed - FULL RESPONSE:', JSON.stringify(freeData, null, 2));
                            console.log('📊 Email Status:', {
                              emailSent: freeData.emailSent,
                              emailId: freeData.emailId,
                              emailError: freeData.emailError,
                              debug: freeData.debug
                            });
                            
                            // Log email status
                            if (freeData.emailSent) {
                              console.log('✅ Customer confirmation email was sent successfully');
                              console.log('📧 Email ID:', freeData.emailId || 'N/A');
                            } else {
                              console.error('❌ Customer confirmation email was NOT sent');
                              console.error('❌ Full debug info:', freeData.debug);
                              if (freeData.emailError) {
                                console.error('❌ Email error:', freeData.emailError);
                              } else {
                                console.error('❌ No email error provided, but emailSent is false');
                                console.error('❌ This suggests the email attempt was not made or failed silently');
                              }
                              // Show alert to user that email might not have been sent
                              alert('⚠️ Your order was processed successfully, but there was an issue sending your confirmation email. Please check your spam folder or contact us at tradeaviatorbot@gmail.com if you don\'t receive it within a few minutes.');
                            }
                            
                            // Clear cart and redirect to success page
                            localStorage.removeItem('tradeAviatorCart');
                            setDiscountCode('');
                            setDiscountApplied(false);
                            window.location.href = '/payment/success?session_id=FREE-' + Date.now();
                          } else {
                            const errorData = await freeResponse.json().catch(() => ({}));
                            console.error('❌ Free purchase failed:', errorData);
                            throw new Error(errorData.error || 'Failed to process free purchase');
                          }
                        } catch (freeError: any) {
                          console.error('Error processing free purchase:', freeError);
                          setSubmitStatus('error');
                          setIsSubmitting(false);
                          alert(`Error processing your order: ${freeError.message || 'Please try again.'}`);
                          return;
                        }
                      } else {
                        // Handle paid purchases with Stripe
                        const response = await fetch('/api/create-checkout-session', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            items: cartItems,
                            customerEmail: email,
                            customerName: name,
                            customerPhone: phone,
                            discountCode: discountApplied ? discountCode : null,
                          }),
                        });

                        // Check if response is JSON
                        const contentType = response.headers.get('content-type');
                        if (!contentType || !contentType.includes('application/json')) {
                          const text = await response.text();
                          console.error('Non-JSON response received:', text.substring(0, 500));
                          throw new Error(`API route returned HTML instead of JSON. Status: ${response.status}. The route may not be found. Please restart your dev server.`);
                        }

                        const data = await response.json();

                        if (response.ok && data.url) {
                          // Redirect to Stripe Checkout for paid purchases
                          window.location.href = data.url;
                        } else {
                          setSubmitStatus('error');
                          setIsSubmitting(false);
                          console.error('Failed to create checkout session:', data);
                          alert(`Payment Error: ${data.error || 'Unknown error. Please check the console for details.'}`);
                        }
                      }
                    } catch (error: any) {
                      console.error('Error processing payment:', error);
                      setSubmitStatus('error');
                      setIsSubmitting(false);
                      alert(`Payment Error: ${error.message || 'Failed to connect to payment server. Please try again.'}`);
                    }
                  }}
                >
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#FFFFFF' }}>Personal Information</h3>
                    <p className="text-sm mb-6" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      We'll use this to send you order confirmation and updates
                    </p>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#E5E7EB' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="John Doe"
                          className="w-full px-5 py-4 rounded-xl border transition-all focus:outline-none"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            color: '#FFFFFF',
                            fontSize: '16px',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#56E0FF';
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(86, 224, 255, 0.15)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#E5E7EB' }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="your.email@example.com"
                          className="w-full px-5 py-4 rounded-xl border transition-all focus:outline-none"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            color: '#FFFFFF',
                            fontSize: '16px',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#56E0FF';
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(86, 224, 255, 0.15)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#E5E7EB' }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+44 7700 900000"
                          className="w-full px-5 py-4 rounded-xl border transition-all focus:outline-none"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            color: '#FFFFFF',
                            fontSize: '16px',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#56E0FF';
                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(86, 224, 255, 0.15)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information Note - Only show for paid purchases */}
                  {total > 0 && (
                    <div className="mb-8 p-6 rounded-xl" style={{
                      background: 'rgba(58, 139, 255, 0.1)',
                      border: '1px solid rgba(58, 139, 255, 0.3)',
                    }}>
                      <div className="flex items-start gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3A8BFF" strokeWidth="2"/>
                          <path d="M12 8V12M12 16H12.01" stroke="#3A8BFF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <div>
                          <h4 className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>Secure Payment Processing</h4>
                          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            You'll be redirected to Stripe's secure checkout page to complete your payment. All payment information is encrypted and processed securely by Stripe.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Free Purchase Note - Only show for free purchases */}
                  {total === 0 && (
                    <div className="mb-8 p-6 rounded-xl" style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}>
                      <div className="flex items-start gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4ade80" strokeWidth="2"/>
                          <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div>
                          <h4 className="font-semibold mb-1" style={{ color: '#FFFFFF' }}>Free Access - No Payment Required</h4>
                          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Your discount code has been applied! Click "Start for Free Now" to complete your order. You'll receive confirmation and access details via email.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg text-center mb-4"
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#4ade80',
                      }}
                    >
                      ✓ Payment successful! You will receive access details via email shortly.
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg text-center mb-4"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                      }}
                    >
                      ✗ Payment failed. Please try again.
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    whileHover={!isSubmitting && cartItems.length > 0 ? { scale: 1.02, boxShadow: '0 10px 30px rgba(58, 139, 255, 0.5)' } : {}}
                    whileTap={!isSubmitting && cartItems.length > 0 ? { scale: 0.98 } : {}}
                    className="w-full py-5 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    style={{
                      background: isSubmitting || cartItems.length === 0
                        ? 'rgba(58, 139, 255, 0.3)'
                        : 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 50%, #A78BFA 100%)',
                      color: '#FFFFFF',
                      boxShadow: cartItems.length > 0 ? '0 4px 20px rgba(58, 139, 255, 0.4)' : 'none',
                    }}
                  >
                    <span className="relative z-10">
                      {isSubmitting 
                        ? (total === 0 ? 'Processing...' : 'Redirecting to Secure Checkout...') 
                        : cartItems.length > 0 
                          ? (total === 0 ? 'Start for Free Now' : `Proceed to Payment - £${total}`) 
                          : 'Add Items to Cart'}
                    </span>
                  </motion.button>

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t flex items-center justify-center gap-6 flex-wrap" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4ade80" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4ade80" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>256-bit Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4ade80" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>PCI Compliant</span>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
