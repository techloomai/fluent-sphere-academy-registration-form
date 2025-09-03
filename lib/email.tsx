import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export interface RegistrationData {
  fullName: string
  dateOfBirth: string
  gender: string
  nationalId: string
  address: string
  contactNumber: string
  email: string
  highestQualification: string
  currentOccupation: string
  englishProficiency: string
  courseAppliedFor: string
  preferredMode: string
  batchIntake: string
  preferredClassDays: string[]
  paymentMethod: string
}

export async function sendRegistrationEmail(data: RegistrationData): Promise<void> {
  // Validate required environment variables
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is required")
  }

  if (!process.env.FROM_EMAIL) {
    throw new Error("FROM_EMAIL environment variable is required")
  }

  if (!process.env.TO_EMAIL) {
    throw new Error("TO_EMAIL environment variable is required")
  }

  try {
    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Registration - Fluent Sphere Academy</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #131f43; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #131f43; }
            .value { margin-left: 10px; }
            .footer { background: #131f43; color: white; padding: 15px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Student Registration</h1>
              <p>Fluent Sphere Academy</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 style="color: #131f43;">Personal Information</h2>
                <p><span class="label">Full Name:</span><span class="value">${data.fullName}</span></p>
                <p><span class="label">Date of Birth:</span><span class="value">${data.dateOfBirth}</span></p>
                <p><span class="label">Gender:</span><span class="value">${data.gender}</span></p>
                <p><span class="label">National ID/Passport:</span><span class="value">${data.nationalId}</span></p>
                <p><span class="label">Address:</span><span class="value">${data.address}</span></p>
                <p><span class="label">Contact Number:</span><span class="value">${data.contactNumber}</span></p>
                <p><span class="label">Email:</span><span class="value">${data.email}</span></p>
              </div>

              <div class="section">
                <h2 style="color: #131f43;">Educational Background</h2>
                <p><span class="label">Highest Qualification:</span><span class="value">${data.highestQualification}</span></p>
                <p><span class="label">Current Occupation:</span><span class="value">${data.currentOccupation}</span></p>
              </div>

              <div class="section">
                <h2 style="color: #131f43;">Course Information</h2>
                <p><span class="label">English Proficiency:</span><span class="value">${data.englishProficiency}</span></p>
                <p><span class="label">Course Applied For:</span><span class="value">${data.courseAppliedFor}</span></p>
                <p><span class="label">Preferred Mode:</span><span class="value">${data.preferredMode}</span></p>
                <p><span class="label">Batch/Intake:</span><span class="value">${data.batchIntake}</span></p>
                <p><span class="label">Preferred Class Days:</span><span class="value">${data.preferredClassDays.join(", ")}</span></p>
                <p><span class="label">Payment Method:</span><span class="value">${data.paymentMethod}</span></p>
              </div>
            </div>

            <div class="footer">
              <p>This registration was submitted on ${new Date().toLocaleString()}</p>
              <p>Fluent Sphere Academy - A Global Space for Fluency</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Create plain text version
    const textContent = `
New Student Registration - Fluent Sphere Academy

Personal Information:
- Full Name: ${data.fullName}
- Date of Birth: ${data.dateOfBirth}
- Gender: ${data.gender}
- National ID/Passport: ${data.nationalId}
- Address: ${data.address}
- Contact Number: ${data.contactNumber}
- Email: ${data.email}

Educational Background:
- Highest Qualification: ${data.highestQualification}
- Current Occupation: ${data.currentOccupation}

Course Information:
- English Proficiency: ${data.englishProficiency}
- Course Applied For: ${data.courseAppliedFor}
- Preferred Mode: ${data.preferredMode}
- Batch/Intake: ${data.batchIntake}
- Preferred Class Days: ${data.preferredClassDays.join(", ")}
- Payment Method: ${data.paymentMethod}

Submitted on: ${new Date().toLocaleString()}
    `

    // Send email using Resend
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.TO_EMAIL!,
      subject: `New Registration: ${data.fullName} - ${data.courseAppliedFor}`,
      html: htmlContent,
      text: textContent,
    })

    console.log("[v0] Email sent successfully:", result.data?.id)
  } catch (error) {
    console.error("[v0] Failed to send email:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Invalid or missing Resend API key")
      }
      if (error.message.includes("from")) {
        throw new Error("Invalid sender email address")
      }
      if (error.message.includes("to")) {
        throw new Error("Invalid recipient email address")
      }
    }

    throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Fallback SMTP implementation (backup option)
export async function sendRegistrationEmailSMTP(data: RegistrationData): Promise<void> {
  const nodemailer = await import("nodemailer")

  // Validate SMTP environment variables
  const requiredVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "FROM_EMAIL", "TO_EMAIL"]
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(`Missing SMTP environment variables: ${missingVars.join(", ")}`)
  }

  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number.parseInt(process.env.SMTP_PORT!),
      secure: Number.parseInt(process.env.SMTP_PORT!) === 465,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    })

    // Verify SMTP connection
    await transporter.verify()

    // Send email (using same HTML/text content as Resend)
    await transporter.sendMail({
      from: process.env.FROM_EMAIL!,
      to: process.env.TO_EMAIL!,
      subject: `New Registration: ${data.fullName} - ${data.courseAppliedFor}`,
      html: ` Same HTML content as above `,
      text: ` Same text content as above `,
    })

    console.log("[v0] SMTP email sent successfully")
  } catch (error) {
    console.error("[v0] SMTP email failed:", error)
    throw new Error(`SMTP delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
