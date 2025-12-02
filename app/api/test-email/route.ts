import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const hasFromEmail = !!process.env.RESEND_FROM_EMAIL;
    const hasConsultationEmail = !!process.env.CONSULTATION_EMAIL;

    console.log('Environment check:');
    console.log('- RESEND_API_KEY:', hasApiKey ? '✅ Set' : '❌ Not set');
    console.log('- RESEND_FROM_EMAIL:', hasFromEmail ? `✅ Set (${process.env.RESEND_FROM_EMAIL})` : '❌ Not set');
    console.log('- CONSULTATION_EMAIL:', hasConsultationEmail ? `✅ Set (${process.env.CONSULTATION_EMAIL})` : '❌ Not set');

    if (!hasApiKey) {
      return NextResponse.json({
        error: 'RESEND_API_KEY is not set',
        status: 'error'
      }, { status: 500 });
    }

    if (!hasFromEmail) {
      return NextResponse.json({
        error: 'RESEND_FROM_EMAIL is not set',
        status: 'error'
      }, { status: 500 });
    }

    if (!hasConsultationEmail) {
      return NextResponse.json({
        error: 'CONSULTATION_EMAIL is not set',
        status: 'error'
      }, { status: 500 });
    }

    // Try to send a test email
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('Attempting to send test email...');
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONSULTATION_EMAIL,
      subject: 'Test Email - Trade Aviator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3A8BFF;">Test Email</h2>
          <p>This is a test email to verify that email sending is working correctly.</p>
          <p>If you received this, your email configuration is working! ✅</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return NextResponse.json({
        error: 'Failed to send email',
        details: result.error,
        status: 'error'
      }, { status: 500 });
    }

    console.log('✅ Test email sent successfully!');
    console.log('Email ID:', result.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: result.data?.id,
      status: 'success'
    });

  } catch (error: any) {
    console.error('Error in test email endpoint:', error);
    return NextResponse.json({
      error: error.message || 'Unknown error',
      status: 'error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json({
        error: 'testEmail is required',
        status: 'error'
      }, { status: 400 });
    }

    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: 'RESEND_API_KEY is not set',
        status: 'error'
      }, { status: 500 });
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json({
        error: 'RESEND_FROM_EMAIL is not set',
        status: 'error'
      }, { status: 500 });
    }

    // Try to send a test email to the specified address
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log(`📧 Attempting to send test email to: ${testEmail}`);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: testEmail,
      subject: 'Test Email - Trade Aviator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3A8BFF;">Test Email</h2>
          <p>This is a test email to verify that email sending is working correctly.</p>
          <p>If you received this, your email configuration is working! ✅</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error('❌ Resend API error:', result.error);
      return NextResponse.json({
        error: 'Failed to send email',
        details: result.error,
        status: 'error'
      }, { status: 500 });
    }

    console.log('✅ Test email sent successfully to:', testEmail);
    console.log('📧 Email ID:', result.data?.id);

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
      emailId: result.data?.id,
      status: 'success'
    });

  } catch (error: any) {
    console.error('Error in test email POST endpoint:', error);
    return NextResponse.json({
      error: error.message || 'Unknown error',
      status: 'error'
    }, { status: 500 });
  }
}

