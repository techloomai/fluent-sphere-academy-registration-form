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

    try {
      if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
        console.error("[v0] Resend configuration missing")
        return NextResponse.json({ error: "Email service not configured. Please contact support." }, { status: 500 })
      }

      console.log("[v0] Sending email via Resend...")
      const result = await sendRegistrationEmail(data)

      if (!result.success) {
        throw new Error(result.error)
      }

      console.log("[v0] Email sent successfully via Resend")
    } catch (emailError) {
      console.error("[v0] Email sending failed:", emailError)
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
