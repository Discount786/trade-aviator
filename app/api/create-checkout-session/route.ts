import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe secret key is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.trim() === '') {
      console.error('STRIPE_SECRET_KEY is not set or is empty');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
      return NextResponse.json(
        { error: 'Payment server configuration error. STRIPE_SECRET_KEY is not set.' },
        { status: 500 }
      );
    }

    // Validate key format
    if (!stripeKey.startsWith('sk_')) {
      console.error('STRIPE_SECRET_KEY does not appear to be a valid Stripe key (should start with sk_)');
      return NextResponse.json(
        { error: 'Invalid Stripe configuration. Please check your API keys.' },
        { status: 500 }
      );
    }

    // Initialize Stripe after checking the key exists
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = await request.json();
    const { items, customerEmail, customerName, customerPhone, discountCode } = body;

    console.log('Creating checkout session with:', { 
      itemsCount: items?.length, 
      customerEmail,
      hasDiscount: !!discountCode 
    });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    // Calculate total amount in pence (Stripe uses smallest currency unit)
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * 100); // Convert to pence
    }, 0);

    // Handle free purchases (Stripe doesn't allow £0 checkout sessions)
    if (totalAmount <= 0) {
      // For free purchases, we'll process them directly without Stripe
      // The frontend will handle the redirect to success page
      return NextResponse.json({
        isFree: true,
        message: 'Free purchase - no payment required',
        items: items,
        customerEmail: customerEmail,
        customerName: customerName,
      });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.features ? item.features.join(', ') : '',
        },
        unit_amount: Math.round(item.price * 100), // Convert to pence
      },
      quantity: 1,
    }));

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001');

    console.log('Creating Stripe checkout session...');
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment`,
      customer_email: customerEmail,
      metadata: {
        customerName: customerName || '',
        customerEmail: customerEmail || '', // Store email in metadata as backup
        customerPhone: customerPhone || '',
        discountCode: discountCode || '',
        items: JSON.stringify(items),
      },
      allow_promotion_codes: true, // Allow customers to enter promo codes
    });

    console.log('Checkout session created successfully:', session.id);
    console.log('📧 Customer email for this session:', customerEmail);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}

