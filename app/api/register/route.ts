import { type NextRequest, NextResponse } from "next/server"
import { registrationSchema } from "@/lib/validation"
import { sendRegistrationEmail, sendRegistrationEmailSMTP } from "@/lib/email"

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

    try {
      // Try Resend first (preferred method)
      if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL && process.env.TO_EMAIL) {
        console.log("[v0] Attempting to send email via Resend...")
        await sendRegistrationEmail(data)
        console.log("[v0] Email sent successfully via Resend")
      }
      // Fallback to SMTP if Resend is not configured
      else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        console.log("[v0] Resend not configured, falling back to SMTP...")
        await sendRegistrationEmailSMTP(data)
        console.log("[v0] Email sent successfully via SMTP")
      }
      // No email service configured
      else {
        console.error("[v0] No email service configured")
        return NextResponse.json({ error: "Email service not configured. Please contact support." }, { status: 500 })
      }
    } catch (emailError) {
      console.error("[v0] All email methods failed:", emailError)
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
    console.error("[v0] Registration API error:", error)
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
