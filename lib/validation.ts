import { z } from "zod"

// Sri Lankan NIC validation regex (old and new formats)
const nicRegex = /^(?:\d{9}[vVxX]|\d{12})$/

// E.164 phone number format or Sri Lankan format
const phoneRegex = /^(?:\+94|0)?[1-9]\d{8}$/

export const registrationSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must not exceed 80 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full name can only contain letters, spaces, dots, hyphens, and apostrophes"),

  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date)
    const today = new Date()
    return birthDate < today
  }, "Date of birth must be in the past"),

  gender: z.enum(["Male", "Female", "Prefer not to say"], {
    required_error: "Please select your gender",
  }),

  nationalIdOrPassport: z
    .string()
    .min(1, "National ID or Passport is required")
    .refine((value) => {
      // Check if it's a valid NIC or reasonable passport format
      return nicRegex.test(value) || /^[A-Z0-9]{6,12}$/.test(value)
    }, "Please enter a valid National ID or Passport number"),

  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters"),

  contactNumber: z.string().regex(phoneRegex, "Please enter a valid Sri Lankan phone number"),

  email: z.string().email("Please enter a valid email address"),

  // Educational Background
  highestQualification: z.string().min(1, "Highest qualification is required"),

  currentOccupation: z.string().min(1, "Current occupation is required"),

  // Course Information
  englishProficiency: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Please select your English proficiency level",
  }),

  courseAppliedFor: z.enum(["IELTS Academic", "IELTS General Training"], {
    required_error: "Please select the course you are applying for",
  }),

  preferredMode: z.enum(["Onsite", "Online", "Hybrid"], {
    required_error: "Please select your preferred learning mode",
  }),

  batchIntake: z.string().min(1, "Batch/Intake information is required"),

  preferredClassDays: z.enum(["Weekdays", "Weekends", "Both"], {
    required_error: "Please select your preferred class days",
  }),

  paymentMethod: z.enum(["Cash", "Bank Transfer", "Card Payment"], {
    required_error: "Please select your preferred payment method",
  }),

  // Honeypot field for spam protection
  honeypot: z.string().optional(),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>
