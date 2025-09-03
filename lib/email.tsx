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

export async function sendRegistrationEmail(data: RegistrationData): Promise<void> {
  // Validate environment variables
  const requiredEnvVars = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FROM_EMAIL: process.env.FROM_EMAIL,
    TO_EMAIL: process.env.TO_EMAIL,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`)
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Verify connection
  try {
    await transporter.verify()
  } catch (error) {
    console.error("SMTP connection failed:", error)
    throw new Error("Email service connection failed")
  }

  // Create email content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Registration - Fluent Sphere Academy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #131f43; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; color: #131f43; }
        .value { margin-left: 10px; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Student Registration</h1>
        <p>Fluent Sphere Academy</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h2>Personal Information</h2>
          <p><span class="label">Full Name:</span><span class="value">${data.fullName}</span></p>
          <p><span class="label">Date of Birth:</span><span class="value">${data.dateOfBirth}</span></p>
          <p><span class="label">Gender:</span><span class="value">${data.gender}</span></p>
          <p><span class="label">National ID/Passport:</span><span class="value">${data.nationalId}</span></p>
          <p><span class="label">Address:</span><span class="value">${data.address}</span></p>
          <p><span class="label">Contact Number:</span><span class="value">${data.contactNumber}</span></p>
          <p><span class="label">Email:</span><span class="value">${data.email}</span></p>
        </div>

        <div class="section">
          <h2>Educational Background</h2>
          <p><span class="label">Highest Qualification:</span><span class="value">${data.highestQualification}</span></p>
          <p><span class="label">Current Occupation:</span><span class="value">${data.currentOccupation}</span></p>
        </div>

        <div class="section">
          <h2>Course Information</h2>
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
    </body>
    </html>
  `

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
Fluent Sphere Academy - A Global Space for Fluency
  `

  // Send email
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: `New Registration: ${data.fullName} - ${data.courseAppliedFor}`,
    text: textContent,
    html: htmlContent,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log("Registration email sent successfully:", result.messageId)
  } catch (error) {
    console.error("Failed to send email:", error)
    throw new Error("Failed to send registration email")
  }
}
