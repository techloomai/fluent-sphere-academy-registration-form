import { Resend } from "resend"
import nodemailer from "nodemailer"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface RegistrationData {
  fullName: string
  email: string
  contactNumber: string
  dateOfBirth: string
  gender: string
  nationalId: string
  address: string
  highestQualification: string
  currentOccupation: string
  englishProficiency: string
  courseAppliedFor: string
  preferredMode: string
  batchIntake: string
  preferredClassDays: string[]
  paymentMethod: string
}

export async function sendRegistrationEmail(data: RegistrationData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[v0] Starting email send process")

    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Missing RESEND_API_KEY")
      return await sendRegistrationEmailSMTP(data)
    }

    if (!process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
      console.log("[v0] Missing FROM_EMAIL or TO_EMAIL")
      throw new Error("Email addresses not configured. Missing FROM_EMAIL or TO_EMAIL.")
    }

    console.log("[v0] Environment variables validated")

    const emailHtml = `
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
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #131f43; }
            .value { margin-left: 10px; }
            .footer { background: #131f43; color: white; padding: 15px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Student Registration</h1>
              <p>Fluent Sphere Academy</p>
            </div>
            <div class="content">
              <h2>Registration Details</h2>
              
              <h3>Personal Information</h3>
              <div class="field"><span class="label">Full Name:</span><span class="value">${data.fullName}</span></div>
              <div class="field"><span class="label">Email:</span><span class="value">${data.email}</span></div>
              <div class="field"><span class="label">Contact Number:</span><span class="value">${data.contactNumber}</span></div>
              <div class="field"><span class="label">Date of Birth:</span><span class="value">${data.dateOfBirth}</span></div>
              <div class="field"><span class="label">Gender:</span><span class="value">${data.gender}</span></div>
              <div class="field"><span class="label">National ID/Passport:</span><span class="value">${data.nationalId}</span></div>
              <div class="field"><span class="label">Address:</span><span class="value">${data.address}</span></div>
              
              <h3>Educational Background</h3>
              <div class="field"><span class="label">Highest Qualification:</span><span class="value">${data.highestQualification}</span></div>
              <div class="field"><span class="label">Current Occupation:</span><span class="value">${data.currentOccupation}</span></div>
              
              <h3>Course Information</h3>
              <div class="field"><span class="label">English Proficiency:</span><span class="value">${data.englishProficiency}</span></div>
              <div class="field"><span class="label">Course Applied For:</span><span class="value">${data.courseAppliedFor}</span></div>
              <div class="field"><span class="label">Preferred Mode:</span><span class="value">${data.preferredMode}</span></div>
              <div class="field"><span class="label">Batch/Intake:</span><span class="value">${data.batchIntake}</span></div>
              <div class="field"><span class="label">Preferred Class Days:</span><span class="value">${data.preferredClassDays.join(", ")}</span></div>
              <div class="field"><span class="label">Payment Method:</span><span class="value">${data.paymentMethod}</span></div>
            </div>
            <div class="footer">
              <p>This registration was submitted through the Fluent Sphere Academy website.</p>
              <p>Please contact the student at ${data.email} or ${data.contactNumber} for further communication.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Student Registration - Fluent Sphere Academy

Personal Information:
- Full Name: ${data.fullName}
- Email: ${data.email}
- Contact Number: ${data.contactNumber}
- Date of Birth: ${data.dateOfBirth}
- Gender: ${data.gender}
- National ID/Passport: ${data.nationalId}
- Address: ${data.address}

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

Please contact the student at ${data.email} or ${data.contactNumber} for further communication.
    `

    console.log("[v0] Sending email via Resend")

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.TO_EMAIL!,
      subject: `New Registration: ${data.fullName} - ${data.courseAppliedFor}`,
      html: emailHtml,
      text: emailText,
    })

    console.log("[v0] Email sent successfully:", result)

    return { success: true }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return {
      success: false,
      error: `Failed to send registration email: ${errorMessage}`,
    }
  }
}

export async function sendRegistrationEmailSMTP(data: RegistrationData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[v0] Starting SMTP email send process")

    // Validate required SMTP environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("[v0] Missing SMTP configuration")
      throw new Error("SMTP service not configured. Missing SMTP environment variables.")
    }

    if (!process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
      console.log("[v0] Missing FROM_EMAIL or TO_EMAIL")
      throw new Error("Email addresses not configured. Missing FROM_EMAIL or TO_EMAIL.")
    }

    console.log("[v0] SMTP environment variables validated")

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT),
      secure: Number.parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify SMTP connection
    await transporter.verify()
    console.log("[v0] SMTP connection verified")

    const emailHtml = `
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
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #131f43; }
            .value { margin-left: 10px; }
            .footer { background: #131f43; color: white; padding: 15px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Student Registration</h1>
              <p>Fluent Sphere Academy</p>
            </div>
            <div class="content">
              <h2>Registration Details</h2>
              
              <h3>Personal Information</h3>
              <div class="field"><span class="label">Full Name:</span><span class="value">${data.fullName}</span></div>
              <div class="field"><span class="label">Email:</span><span class="value">${data.email}</span></div>
              <div class="field"><span class="label">Contact Number:</span><span class="value">${data.contactNumber}</span></div>
              <div class="field"><span class="label">Date of Birth:</span><span class="value">${data.dateOfBirth}</span></div>
              <div class="field"><span class="label">Gender:</span><span class="value">${data.gender}</span></div>
              <div class="field"><span class="label">National ID/Passport:</span><span class="value">${data.nationalId}</span></div>
              <div class="field"><span class="label">Address:</span><span class="value">${data.address}</span></div>
              
              <h3>Educational Background</h3>
              <div class="field"><span class="label">Highest Qualification:</span><span class="value">${data.highestQualification}</span></div>
              <div class="field"><span class="label">Current Occupation:</span><span class="value">${data.currentOccupation}</span></div>
              
              <h3>Course Information</h3>
              <div class="field"><span class="label">English Proficiency:</span><span class="value">${data.englishProficiency}</span></div>
              <div class="field"><span class="label">Course Applied For:</span><span class="value">${data.courseAppliedFor}</span></div>
              <div class="field"><span class="label">Preferred Mode:</span><span class="value">${data.preferredMode}</span></div>
              <div class="field"><span class="label">Batch/Intake:</span><span class="value">${data.batchIntake}</span></div>
              <div class="field"><span class="label">Preferred Class Days:</span><span class="value">${data.preferredClassDays.join(", ")}</span></div>
              <div class="field"><span class="label">Payment Method:</span><span class="value">${data.paymentMethod}</span></div>
            </div>
            <div class="footer">
              <p>This registration was submitted through the Fluent Sphere Academy website.</p>
              <p>Please contact the student at ${data.email} or ${data.contactNumber} for further communication.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Student Registration - Fluent Sphere Academy

Personal Information:
- Full Name: ${data.fullName}
- Email: ${data.email}
- Contact Number: ${data.contactNumber}
- Date of Birth: ${data.dateOfBirth}
- Gender: ${data.gender}
- National ID/Passport: ${data.nationalId}
- Address: ${data.address}

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

Please contact the student at ${data.email} or ${data.contactNumber} for further communication.
    `

    console.log("[v0] Sending email via SMTP")

    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `New Registration: ${data.fullName} - ${data.courseAppliedFor}`,
      html: emailHtml,
      text: emailText,
    })

    console.log("[v0] SMTP email sent successfully:", result.messageId)

    return { success: true }
  } catch (error) {
    console.error("[v0] SMTP email sending failed:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return {
      success: false,
      error: `Failed to send registration email via SMTP: ${errorMessage}`,
    }
  }
}
