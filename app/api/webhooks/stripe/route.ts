import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import type { Resend } from 'resend';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Prevent static generation
export const dynamicParams = true;

export async function POST(request: NextRequest) {
  // Skip execution during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Not available during build' }, { status: 503 });
  }
  
  console.log('🔔 Webhook endpoint called');
  
  // Dynamic imports to prevent build-time execution
  const StripeModule = (await import('stripe')).default;
  const ResendModule = await import('resend');
  
  // Initialize Stripe inside the function to avoid build-time errors
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
    return NextResponse.json(
      { error: 'Server configuration error. STRIPE_SECRET_KEY is not set.' },
      { status: 500 }
    );
  }
  
  const stripe = new StripeModule(process.env.STRIPE_SECRET_KEY);
  
  // Initialize Resend with error checking
  let resend: InstanceType<typeof ResendModule.Resend> | null = null;
  if (process.env.RESEND_API_KEY) {
    try {
      resend = new ResendModule.Resend(process.env.RESEND_API_KEY);
      console.log('✅ Resend initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Resend:', error);
    }
  } else {
    console.error('❌ RESEND_API_KEY is not set in environment variables');
  }
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  console.log('📋 Webhook signature present:', !!signature);
  console.log('📋 STRIPE_WEBHOOK_SECRET set:', !!process.env.STRIPE_WEBHOOK_SECRET);
  console.log('📋 RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);
  console.log('📋 RESEND_FROM_EMAIL set:', !!process.env.RESEND_FROM_EMAIL);

  let event: Stripe.Event;

  // Verify webhook signature if webhook secret is configured
  if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
  } else {
    // For local development without webhook secret, parse the event directly
    // WARNING: This should only be used in development!
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set - skipping signature verification (development mode)');
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (err: any) {
      console.error('Failed to parse webhook event:', err.message);
      return NextResponse.json(
        { error: 'Invalid webhook event' },
        { status: 400 }
      );
    }
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    console.log('✅ Webhook received: checkout.session.completed');
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('📋 Session ID:', session.id);
    console.log('📋 Event type:', event.type);

    try {
      // Retrieve full session details including line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      // Get customer email from multiple possible locations (metadata is most reliable)
      const customerEmail = session.metadata?.customerEmail  // First check metadata (from form)
        || session.customer_email 
        || session.customer_details?.email 
        || fullSession.customer_details?.email
        || fullSession.customer_email
        || null;
      
      const customerName = session.customer_details?.name 
        || fullSession.customer_details?.name 
        || session.metadata?.customerName 
        || 'Valued Customer';
      
      const customerPhone = session.metadata?.customerPhone 
        || session.customer_details?.phone 
        || fullSession.customer_details?.phone 
        || 'N/A';
      
      const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      const totalAmount = (session.amount_total || 0) / 100; // Convert from pence to pounds
      const orderId = session.id;

      console.log('📋 Customer information extracted:', {
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        hasEmail: !!customerEmail
      });

      // Send confirmation email to customer (ALWAYS send when purchase is made)
      if (customerEmail) {
        if (!resend) {
          console.error('❌ Resend is not initialized. Cannot send email.');
          console.error('RESEND_API_KEY check:', !!process.env.RESEND_API_KEY);
        } else if (!process.env.RESEND_FROM_EMAIL) {
          console.error('❌ RESEND_FROM_EMAIL is not set. Cannot send email.');
        } else {
          try {
            console.log('📧 ===== ATTEMPTING TO SEND CUSTOMER EMAIL =====');
            console.log('📧 Customer Email:', customerEmail);
            console.log('📧 Customer Name:', customerName);
            console.log('📧 From Email:', process.env.RESEND_FROM_EMAIL);
            console.log('📧 Resend API Key Present:', !!process.env.RESEND_API_KEY);
            
            const emailResult = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: customerEmail,
            subject: 'Payment Confirmed - Trade Aviator',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                <div style="background: linear-gradient(135deg, #3A8BFF 0%, #56E0FF 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: #FFFFFF; margin: 0; font-size: 28px;">Payment Confirmed!</h1>
                </div>
                
                <div style="background: #FFFFFF; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${customerName},</p>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Thank you for your purchase! Your payment of <strong>£${totalAmount.toFixed(2)}</strong> has been successfully processed.
                  </p>

                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3A8BFF;">
                    <h2 style="color: #333; margin-top: 0; font-size: 20px;">Order Details</h2>
                    <p style="color: #666; margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    ${items.length > 0 ? `
                      <div style="margin-top: 15px;">
                        <strong style="color: #333;">Items Purchased:</strong>
                        <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
                          ${items.map((item: any) => `<li>${item.name} - ${item.price === 0 ? 'FREE' : '£' + item.price}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>

                  <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p style="color: #2e7d32; margin: 0; font-weight: bold;">✓ Your order is being processed</p>
                    <p style="color: #2e7d32; margin: 5px 0 0 0; font-size: 14px;">One of our specialists will contact you within 24 hours with your access details and setup instructions.</p>
                  </div>

                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                    If you have any questions or need assistance, please don't hesitate to contact us at 
                    <a href="mailto:tradeaviatorbot@gmail.com" style="color: #3A8BFF; text-decoration: none;">tradeaviatorbot@gmail.com</a>
                  </p>

                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Thank you for choosing Trade Aviator!
                  </p>

                  <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    Best regards,<br>
                    <strong>The Trade Aviator Team</strong>
                  </p>
                </div>
              </div>
            `,
          });

            console.log('✅ ===== CUSTOMER EMAIL SENT SUCCESSFULLY =====');
            console.log('✅ Customer Email:', customerEmail);
            if (emailResult.data?.id) {
              console.log('📧 Resend Email ID:', emailResult.data.id);
            }
            if (emailResult.error) {
              console.error('❌ ===== RESEND API ERROR =====');
              console.error('❌ Error:', JSON.stringify(emailResult.error, null, 2));
            } else {
              console.log('✅ Email sent without errors - customer should receive it');
              console.log('⚠️  If customer doesn\'t receive email, check spam folder');
            }
          } catch (emailError: any) {
            console.error('❌ Error sending customer confirmation email:', emailError);
            console.error('Error details:', {
              message: emailError?.message,
              name: emailError?.name,
              stack: emailError?.stack
            });
            // Don't fail the webhook if email fails, but log it
          }
        }
      } else {
        console.warn('⚠️  No customer email found in session. Email not sent.');
        console.log('Session details:', {
          customer_email: session.customer_email,
          customer_details: session.customer_details,
          metadata: session.metadata
        });
      }

      // Send notification email to business
      if (process.env.CONSULTATION_EMAIL) {
        if (!resend) {
          console.error('❌ Resend is not initialized. Cannot send business notification email.');
        } else {
          try {
            console.log('📧 Sending notification email to business:', process.env.CONSULTATION_EMAIL);
            await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.CONSULTATION_EMAIL,
            subject: `New Payment Received - £${totalAmount.toFixed(2)} - Trade Aviator`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3A8BFF; margin-bottom: 20px;">New Payment Received</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="margin: 10px 0;"><strong style="color: #333;">Customer Name:</strong> <span style="color: #666;">${customerName}</span></p>
                  <p style="margin: 10px 0;"><strong style="color: #333;">Customer Email:</strong> <span style="color: #666;">${customerEmail || 'N/A'}</span></p>
                  <p style="margin: 10px 0;"><strong style="color: #333;">Customer Phone:</strong> <span style="color: #666;">${customerPhone}</span></p>
                  <p style="margin: 10px 0;"><strong style="color: #333;">Amount:</strong> <span style="color: #666;">£${totalAmount.toFixed(2)}</span></p>
                  <p style="margin: 10px 0;"><strong style="color: #333;">Order ID:</strong> <span style="color: #666;">${orderId}</span></p>
                  ${items.length > 0 ? `
                    <p style="margin: 10px 0;"><strong style="color: #333;">Items:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      ${items.map((item: any) => `<li style="color: #666; margin: 5px 0;">${item.name} - ${item.price === 0 ? 'FREE' : '£' + item.price}</li>`).join('')}
                    </ul>
                  ` : ''}
                  <p style="margin: 10px 0;"><strong style="color: #333;">Payment Date:</strong> <span style="color: #666;">${new Date().toLocaleString('en-GB')}</span></p>
                  ${session.metadata?.discountCode ? `
                    <p style="margin: 10px 0;"><strong style="color: #333;">Discount Code Used:</strong> <span style="color: #666;">${session.metadata.discountCode}</span></p>
                  ` : ''}
                </div>
                <p style="color: #666; font-size: 14px;">This is an automated notification from your Trade Aviator website.</p>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  <a href="https://dashboard.stripe.com/payments/${session.payment_intent}" style="color: #3A8BFF; text-decoration: none;">View in Stripe Dashboard →</a>
                </p>
              </div>
            `,
          });

            console.log('✅ Notification email sent to business:', process.env.CONSULTATION_EMAIL);
          } catch (emailError: any) {
            console.error('❌ Error sending business notification email:', emailError);
            console.error('Error details:', {
              message: emailError?.message,
              name: emailError?.name,
              stack: emailError?.stack
            });
          }
        }
      } else {
        console.warn('⚠️  CONSULTATION_EMAIL is not set. Business notification email not sent.');
      }

      return NextResponse.json({ received: true });
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }
  }

  // Log unhandled event types
  console.log('⚠️  Unhandled webhook event type:', event.type);
  
  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true, eventType: event.type });
}

