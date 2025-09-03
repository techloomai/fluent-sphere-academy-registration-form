import nodemailer from "nodemailer"

interface RegistrationData {
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

export async function sendRegistrationEmail(data: RegistrationData) {
  const requiredEnvVars = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FROM_EMAIL: process.env.FROM_EMAIL,
    TO_EMAIL: process.env.TO_EMAIL,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.log("[v0] Missing environment variables:", missingVars)
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }

  console.log("[v0] All environment variables found, creating transporter")

  const transporter = nodemailer.createTransport({
    host: requiredEnvVars.SMTP_HOST,
    port: Number.parseInt(requiredEnvVars.SMTP_PORT!),
    secure: Number.parseInt(requiredEnvVars.SMTP_PORT!) === 465,
    auth: {
      user: requiredEnvVars.SMTP_USER,
      pass: requiredEnvVars.SMTP_PASS,
    },
  })

  try {
    await transporter.verify()
    console.log("[v0] SMTP connection verified successfully")
  } catch (error) {
    console.log("[v0] SMTP verification failed:", error)
    throw new Error("Failed to connect to SMTP server. Please check your email configuration.")
  }

  const emailSubject = `New Registration: ${data.fullName} - ${data.courseAppliedFor}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #131f43 0%, #1a2951 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Fluent Sphere Academy</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">New Student Registration</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #131f43; margin-top: 0;">Personal Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Full Name:</td><td style="padding: 8px 0;">${data.fullName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Date of Birth:</td><td style="padding: 8px 0;">${data.dateOfBirth}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Gender:</td><td style="padding: 8px 0;">${data.gender}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">National ID/Passport:</td><td style="padding: 8px 0;">${data.nationalId}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Address:</td><td style="padding: 8px 0;">${data.address}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Contact Number:</td><td style="padding: 8px 0;">${data.contactNumber}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Email:</td><td style="padding: 8px 0;">${data.email}</td></tr>
        </table>

        <h2 style="color: #131f43; margin-top: 30px;">Educational Background</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Highest Qualification:</td><td style="padding: 8px 0;">${data.highestQualification}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Current Occupation:</td><td style="padding: 8px 0;">${data.currentOccupation}</td></tr>
        </table>

        <h2 style="color: #131f43; margin-top: 30px;">Course Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">English Proficiency:</td><td style="padding: 8px 0;">${data.englishProficiency}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Course Applied For:</td><td style="padding: 8px 0;">${data.courseAppliedFor}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Preferred Mode:</td><td style="padding: 8px 0;">${data.preferredMode}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Batch/Intake:</td><td style="padding: 8px 0;">${data.batchIntake}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Preferred Class Days:</td><td style="padding: 8px 0;">${data.preferredClassDays.join(", ")}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #131f43;">Payment Method:</td><td style="padding: 8px 0;">${data.paymentMethod}</td></tr>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-left: 4px solid #d6a557; border-radius: 5px;">
          <p style="margin: 0; color: #131f43; font-weight: bold;">Next Steps:</p>
          <p style="margin: 10px 0 0 0; color: #555;">Please review this registration and contact the student within 24 hours to confirm enrollment details.</p>
        </div>
      </div>
    </div>
  `

  const textContent = `
Fluent Sphere Academy - New Student Registration

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

Next Steps: Please review this registration and contact the student within 24 hours to confirm enrollment details.
  `

  try {
    console.log("[v0] Sending email to:", requiredEnvVars.TO_EMAIL)
    const info = await transporter.sendMail({
      from: `"Fluent Sphere Academy" <${requiredEnvVars.FROM_EMAIL}>`,
      to: requiredEnvVars.TO_EMAIL,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    })

    console.log("[v0] Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.log("[v0] Failed to send email:", error)
    throw new Error(`Failed to send registration email: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
