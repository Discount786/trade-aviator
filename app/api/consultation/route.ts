import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Log the submission (you can see this in your server console)
    console.log('=== NEW CONSULTATION REQUEST ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Timestamp:', new Date().toISOString());
    console.log('================================');

    // Send email notification using Resend (non-blocking)
    // This runs asynchronously and won't block the response
    if (process.env.RESEND_API_KEY && process.env.CONSULTATION_EMAIL) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Don't await - let it run in background
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: process.env.CONSULTATION_EMAIL,
          subject: 'New Consultation Request - Trade Aviator',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3A8BFF; margin-bottom: 20px;">New Consultation Request</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> <span style="color: #666;">${name}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> <span style="color: #666;">${email}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Phone:</strong> <span style="color: #666;">${phone}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Submitted:</strong> <span style="color: #666;">${new Date().toLocaleString()}</span></p>
              </div>
              <p style="color: #666; font-size: 14px;">This is an automated notification from your Trade Aviator website.</p>
            </div>
          `,
        }).then(() => {
          console.log('Email notification sent successfully');
        }).catch((emailError) => {
          console.error('Error sending email (non-blocking):', emailError);
          // Don't fail the request if email fails
        });
      } catch (emailInitError) {
        console.error('Error initializing email service:', emailInitError);
        // Continue even if email service fails
      }
    } else {
      console.warn('Resend API key or consultation email not configured. Email notification skipped.');
    }

    // Always return success - email is optional
    return NextResponse.json(
      { 
        success: true, 
        message: 'Consultation request received successfully' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing consultation request:', error);
    // Return success anyway to not break user experience
    // The data is still logged in console
    return NextResponse.json(
      { 
        success: true, 
        message: 'Consultation request received successfully' 
      },
      { status: 200 }
    );
  }
}

