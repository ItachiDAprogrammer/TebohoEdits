import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Check if API key exists
const resendApiKey = process.env.RESEND_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    if (!resendApiKey) {
      console.error('Resend API key is not configured')
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 503 } // Service Unavailable
      )
    }

    // Initialize Resend with API key
    const resend = new Resend(resendApiKey)

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'Teboho Edits Portfolio <onboarding@resend.dev>',
      to: 'tebohoentene@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E50914;">New Contact Form Submission</h2>
          <p>You have received a new message from your portfolio website:</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
          </div>

          <p>You can reply directly to ${email} to respond to this inquiry.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

          <p style="font-size: 12px; color: #888;">
            This message was sent from the Teboho Edits portfolio website.
          </p>
        </div>
      `,
      replyTo: email,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 502 } // Bad Gateway
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error sending contact form:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
