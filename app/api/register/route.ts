import { type NextRequest, NextResponse } from "next/server"
import { registrationSchema } from "@/lib/validation"
import { sendRegistrationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request data
    const validationResult = registrationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const data = validationResult.data

    // Check honeypot field for spam protection
    if (data.honeypot && data.honeypot.trim() !== "") {
      // This is likely spam, silently reject
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    // Check if required environment variables are set
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Email configuration missing. Please set SMTP environment variables.")
      return NextResponse.json({ error: "Email service not configured. Please contact support." }, { status: 500 })
    }

    // Send registration email
    try {
      await sendRegistrationEmail(data)
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError)
      return NextResponse.json(
        { error: "Failed to send registration email. Please try again or contact support." },
        { status: 500 },
      )
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Registration submitted successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Registration API error:", error)

    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
