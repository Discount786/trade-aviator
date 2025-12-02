import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, customerName, customerPhone, discountCode } = body;

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Customer email and name are required' },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price, 0);

    console.log('📋 Processing free purchase:', {
      customerEmail,
      customerName,
      customerPhone,
      itemsCount: items.length,
      discountCode
    });

    // Initialize Resend inside the function to ensure env vars are loaded
    let emailSent = false;
    let emailError: any = null;
    let emailId: string | null = null;

    // Send confirmation email to customer - simplified approach
    console.log('🔍 Checking environment variables...');
    console.log('🔍 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('🔍 RESEND_API_KEY starts with re_:', process.env.RESEND_API_KEY?.startsWith('re_'));
    console.log('🔍 RESEND_FROM_EMAIL exists:', !!process.env.RESEND_FROM_EMAIL);
    console.log('🔍 RESEND_FROM_EMAIL value:', process.env.RESEND_FROM_EMAIL);
    
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        console.log('📧 ===== SENDING FREE PURCHASE CONFIRMATION EMAIL =====');
        console.log('📧 To:', customerEmail);
        console.log('📧 From:', process.env.RESEND_FROM_EMAIL);
        console.log('📧 API Key (first 10 chars):', process.env.RESEND_API_KEY.substring(0, 10) + '...');
        
        let emailResult: any;
        try {
          emailResult = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
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
                <p style="color: #666; margin: 5px 0;"><strong>Order ID:</strong> FREE-${Date.now()}</p>
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
          
          // If we get here, the API call completed without throwing an exception
          console.log('📧 Email API call completed (no exception)');
          console.log('📧 Full emailResult type:', typeof emailResult);
          console.log('📧 Full emailResult:', JSON.stringify(emailResult, null, 2));
          console.log('📧 emailResult.error:', emailResult?.error);
          console.log('📧 emailResult.data:', emailResult?.data);
          console.log('📧 emailResult.data?.id:', emailResult?.data?.id);
          
          // Check for error in response (same as test email endpoint)
          if (emailResult?.error) {
            console.error('❌ ===== RESEND API ERROR =====');
            console.error('❌ Error object:', emailResult.error);
            console.error('❌ Error type:', typeof emailResult.error);
            console.error('❌ Error stringified:', JSON.stringify(emailResult.error, null, 2));
            
            // Check for domain verification error
            if (emailResult.error?.statusCode === 403 || 
                (emailResult.error?.message && emailResult.error.message.includes('verify a domain'))) {
              console.error('❌ ===== DOMAIN VERIFICATION REQUIRED =====');
              console.error('❌ Resend requires domain verification to send emails to customers');
              console.error('❌ Current FROM address:', process.env.RESEND_FROM_EMAIL);
              console.error('❌ To fix: Go to https://resend.com/domains and verify your domain');
              console.error('❌ Then update RESEND_FROM_EMAIL in .env.local to use your verified domain');
              emailError = 'Domain verification required. Please verify your domain at resend.com/domains and update RESEND_FROM_EMAIL to use your verified domain email address.';
            } else {
              emailError = typeof emailResult.error === 'string' 
                ? emailResult.error 
                : JSON.stringify(emailResult.error);
            }
            console.error('❌ EMAIL WAS NOT SENT - Resend returned an error');
            console.error('❌ This error needs to be fixed for emails to be sent');
            // Don't set emailSent = true if there's an actual error
          } else if (emailResult?.data?.id) {
            // Success - email was sent and we have an ID
            console.log('✅ ===== FREE PURCHASE EMAIL SENT SUCCESSFULLY =====');
            console.log('✅ Customer Email:', customerEmail);
            emailId = emailResult.data.id;
            console.log('📧 Resend Email ID:', emailId);
            console.log('✅ Email was accepted by Resend and should be delivered');
            console.log('✅ Check Resend dashboard: https://resend.com/emails');
            emailSent = true;
            console.log('✅ emailSent set to TRUE');
          } else {
            // No error, but also no ID - this is unusual
            console.error('❌ UNEXPECTED RESPONSE STRUCTURE');
            console.error('❌ No error returned, but also no email ID');
            console.error('❌ emailResult structure:', Object.keys(emailResult || {}));
            console.error('❌ This might indicate the email was not sent');
            emailError = 'Unexpected response from Resend API - no error but no email ID';
            // Don't mark as sent if we don't have confirmation
          }
        } catch (sendErr: any) {
          // Exception during the send call itself
          console.error('❌ Exception during resend.emails.send:', sendErr);
          emailError = sendErr?.message || JSON.stringify(sendErr);
          throw sendErr; // Re-throw to outer catch
        }
      } catch (err: any) {
        // Outer catch - any other errors
        console.error('❌ Exception in email sending block:', err);
        console.error('❌ Exception details:', {
          message: err?.message,
          name: err?.name,
          stack: err?.stack?.substring(0, 300)
        });
        if (!emailError) {
          emailError = err?.message || JSON.stringify(err);
        }
      }
    } else {
      console.warn('⚠️  Email not sent - missing RESEND_API_KEY or RESEND_FROM_EMAIL');
      emailError = 'Email configuration missing';
    }

    // Send notification email to business
    if (process.env.CONSULTATION_EMAIL && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log('📧 Sending business notification email for free purchase');
        const businessEmailResult = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: process.env.CONSULTATION_EMAIL,
          subject: `New Free Purchase - Trade Aviator`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3A8BFF; margin-bottom: 20px;">New Free Purchase</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 10px 0;"><strong style="color: #333;">Customer Name:</strong> <span style="color: #666;">${customerName}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Customer Email:</strong> <span style="color: #666;">${customerEmail}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Customer Phone:</strong> <span style="color: #666;">${customerPhone || 'N/A'}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Amount:</strong> <span style="color: #666;">FREE (Discount Code Applied)</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Order ID:</strong> <span style="color: #666;">FREE-${Date.now()}</span></p>
                ${items.length > 0 ? `
                  <p style="margin: 10px 0;"><strong style="color: #333;">Items:</strong></p>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    ${items.map((item: any) => `<li style="color: #666; margin: 5px 0;">${item.name} - ${item.price === 0 ? 'FREE' : '£' + item.price}</li>`).join('')}
                  </ul>
                ` : ''}
                <p style="margin: 10px 0;"><strong style="color: #333;">Purchase Date:</strong> <span style="color: #666;">${new Date().toLocaleString('en-GB')}</span></p>
                ${discountCode ? `
                  <p style="margin: 10px 0;"><strong style="color: #333;">Discount Code Used:</strong> <span style="color: #666;">${discountCode}</span></p>
                ` : ''}
              </div>
              <p style="color: #666; font-size: 14px;">This is an automated notification from your Trade Aviator website.</p>
            </div>
          `,
        });

        if (businessEmailResult.error) {
          console.error('❌ Error sending business notification email:', businessEmailResult.error);
        } else {
          console.log('✅ Business notification email sent successfully');
          if (businessEmailResult.data?.id) {
            console.log('📧 Business Email ID:', businessEmailResult.data.id);
          }
        }
      } catch (emailError: any) {
        console.error('❌ Error sending business notification email:', emailError);
        console.error('Error details:', {
          message: emailError?.message,
          name: emailError?.name
        });
        // Don't fail the request if business email fails
      }
    } else {
      console.warn('⚠️  CONSULTATION_EMAIL is not set. Business notification email not sent.');
    }

    // Log final state BEFORE any forced changes
    console.log('📤 Final state BEFORE safety check - emailSent:', emailSent, 'emailId:', emailId, 'hasError:', !!emailError);
    
    // IMPORTANT: Only mark as sent if we have NO ERROR
    // If there's an error, we should NOT mark it as sent
    if (!emailSent && !emailError && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      console.warn('⚠️  WARNING: emailSent is false but no error was recorded');
      console.warn('⚠️  This might indicate the email was sent but response structure was unexpected');
      console.warn('⚠️  However, we cannot confirm delivery without an email ID');
      // Don't mark as sent if we can't confirm - let the user know there might be an issue
      // emailSent remains false so we can track this issue
    }
    
    // If there's an error, make sure emailSent is false
    if (emailError) {
      emailSent = false;
      console.error('❌ emailSent forced to FALSE due to error:', emailError);
    }
    
    console.log('📤 Final state AFTER safety check - emailSent:', emailSent, 'emailId:', emailId, 'hasError:', !!emailError);
    
    return NextResponse.json({ 
      success: true,
      message: 'Free purchase processed successfully',
      emailSent: emailSent,
      emailId: emailId,
      emailError: emailError ? (typeof emailError === 'string' ? emailError : JSON.stringify(emailError)) : null,
      debug: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        hasFromEmail: !!process.env.RESEND_FROM_EMAIL,
        customerEmail: customerEmail,
        emailAttempted: !emailError || emailSent,
        finalEmailSent: emailSent
      }
    });
  } catch (error: any) {
    console.error('Error processing free purchase:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process free purchase' },
      { status: 500 }
    );
  }
}

