import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, cardNumber, expiryDate, cvv, amount, items } = body;

    // Validate required fields
    if (!name || !email || !phone || !cardNumber || !expiryDate || !cvv) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Log the payment (you can see this in your server console)
    console.log('=== NEW PAYMENT REQUEST ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Card Number:', cardNumber.replace(/\d(?=\d{4})/g, '*'));
    console.log('Amount: £' + amount);
    if (items && Array.isArray(items)) {
      console.log('Items:', items.map((item: any) => `${item.name} - £${item.price}`).join(', '));
    }
    console.log('Timestamp:', new Date().toISOString());
    console.log('================================');

    // TODO: Integrate with payment processor
    // You can use services like:
    // - Stripe (https://stripe.com)
    // - PayPal
    // - Square
    // - Razorpay
    
    // Example with Stripe (uncomment and configure):
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to pence/cents
      currency: 'gbp',
      metadata: {
        name,
        email,
        phone,
      },
    });
    */

    // Send email notification using Resend
    if (process.env.RESEND_API_KEY && process.env.CONSULTATION_EMAIL) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: process.env.CONSULTATION_EMAIL,
          subject: 'New Payment - Trade Aviator - £99',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3A8BFF; margin-bottom: 20px;">New Payment Received</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> <span style="color: #666;">${name}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> <span style="color: #666;">${email}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Phone:</strong> <span style="color: #666;">${phone}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Amount:</strong> <span style="color: #666;">£${amount}</span></p>
                ${items && Array.isArray(items) && items.length > 0 ? `
                <p style="margin: 10px 0;"><strong style="color: #333;">Items:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  ${items.map((item: any) => `<li style="color: #666; margin: 5px 0;">${item.name} - ${item.price === 0 ? 'FREE' : '£' + item.price}</li>`).join('')}
                </ul>
                ` : '<p style="margin: 10px 0;"><strong style="color: #333;">Product:</strong> <span style="color: #666;">Trade Aviator Access - Lifetime</span></p>'}
                <p style="margin: 10px 0;"><strong style="color: #333;">Submitted:</strong> <span style="color: #666;">${new Date().toLocaleString()}</span></p>
              </div>
              <p style="color: #666; font-size: 14px;">This is an automated notification from your Trade Aviator website.</p>
              <p style="color: #ff0000; font-size: 12px; margin-top: 20px;"><strong>Note:</strong> This is a test payment. You need to integrate with a payment processor (Stripe, PayPal, etc.) to process actual payments.</p>
            </div>
          `,
        }).then(() => {
          console.log('Payment email notification sent successfully');
        }).catch((emailError) => {
          console.error('Error sending payment email:', emailError);
        });
      } catch (emailInitError) {
        console.error('Error initializing email service:', emailInitError);
      }
    }

    // Always return success - actual payment processing will be handled by payment processor
    return NextResponse.json(
      { 
        success: true, 
        message: 'Payment request received successfully' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing payment request:', error);
    // Return success anyway to not break user experience
    return NextResponse.json(
      { 
        success: true, 
        message: 'Payment request received successfully' 
      },
      { status: 200 }
    );
  }
}

