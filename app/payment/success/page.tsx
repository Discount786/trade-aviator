"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

// Force dynamic rendering - useSearchParams requires this
export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      setIsLoading(false);
      // Clear cart on successful payment
      localStorage.removeItem('tradeAviatorCart');
      
      // Send confirmation email as backup (in case webhook didn't trigger)
      // Wait a moment to let webhook process first, then send as backup
      setTimeout(async () => {
        try {
          console.log('📧 Attempting to send backup confirmation email for session:', sessionIdParam);
          const response = await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: sessionIdParam }),
          });
          
          const data = await response.json();
          if (response.ok) {
            console.log('✅ Backup confirmation email sent successfully');
          } else {
            console.warn('⚠️  Backup email failed (webhook may have already sent it):', data.error);
          }
        } catch (error) {
          console.error('❌ Error sending backup confirmation email:', error);
          // Don't show error to user - webhook might have already sent it
        }
      }, 2000); // Wait 2 seconds for webhook to process first
    } else {
      // No session ID, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)',
        color: '#FFFFFF'
      }}>
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ 
      background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)',
      color: '#FFFFFF'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
            border: '3px solid #4ade80'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#FFFFFF' }}
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl mb-8"
          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
        >
          Thank you for your purchase. Your order has been confirmed and you will receive access details via email shortly.
        </motion.p>

        {/* Order Details */}
        {sessionId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-6 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Order ID
            </p>
            <p className="font-mono text-sm" style={{ color: '#FFFFFF' }}>
              {sessionId}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-bold text-lg"
              style={{
                background: 'linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(58, 139, 255, 0.4)',
              }}
            >
              Return to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          If you have any questions, please contact us at{" "}
          <a href="mailto:tradeaviatorbot@gmail.com" className="underline" style={{ color: '#56E0FF' }}>
            tradeaviatorbot@gmail.com
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, #0F0F12 0%, #1B1D27 100%)',
        color: '#FFFFFF'
      }}>
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

