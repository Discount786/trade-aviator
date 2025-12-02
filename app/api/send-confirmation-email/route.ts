import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Initialize services
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Retrieve session from Stripe
    console.log('📋 Retrieving Stripe session:', sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      console.warn('⚠️  Payment status is not paid:', session.payment_status);
      return NextResponse.json(
        { error: 'Payment not completed', paymentStatus: session.payment_status },
        { status: 400 }
      );
    }

    // Get customer information from multiple possible locations (metadata is most reliable)
    const customerEmail = session.metadata?.customerEmail  // First check metadata (from form)
      || session.customer_email 
      || session.customer_details?.email 
      || null;
    
    const customerPhone = session.metadata?.customerPhone 
      || session.customer_details?.phone 
      || 'N/A';
    
    const customerName = session.customer_details?.name 
      || session.metadata?.customerName 
      || 'Valued Customer';
    
    const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
    const totalAmount = (session.amount_total || 0) / 100;
    const orderId = session.id;

    console.log('📋 Customer information from session:', {
      email: customerEmail,
      name: customerName,
      phone: customerPhone,
      hasEmail: !!customerEmail
    });

    if (!customerEmail) {
      console.error('❌ No customer email found in session');
      return NextResponse.json(
        { error: 'Customer email not found' },
        { status: 400 }
      );
    }

    console.log('📧 Sending confirmation email to:', customerEmail);
    console.log('📧 From email:', process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev');

    // Send confirmation email
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

    if (emailResult.error) {
      console.error('❌ Resend API error:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      );
    }

    console.log('✅ Confirmation email sent successfully!');
    console.log('📧 Email ID:', emailResult.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: emailResult.data?.id
    });

  } catch (error: any) {
    console.error('❌ Error in send-confirmation-email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

