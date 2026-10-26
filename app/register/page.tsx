"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { registrationSchema, type RegistrationFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, AlertCircle, GraduationCap, User, BookOpen } from "lucide-react"
import Image from "next/image"

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  })

  const watchedFields = watch()
  const totalFields = Object.keys(registrationSchema.shape).length - 1 // Exclude honeypot
  const completedFields = Object.values(watchedFields).filter(
    (value) => value !== undefined && value !== "" && value !== null,
  ).length
  const progress = Math.round((completedFields / totalFields) * 100)

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.")
      }

      setSubmitStatus("success")
      reset()
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const alertVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="text-center py-8" variants={cardVariants}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-4"
          >
            <Image
              src="/images/fluent-sphere-logo.jpg"
              alt="Fluent Sphere Academy Logo"
              width={120}
              height={120}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-primary mb-2">Student Registration</h1>
          <p className="text-muted-foreground">Fluent Sphere Academy - IELTS Preparation</p>

          <motion.div
            className="mt-6 max-w-md mx-auto"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Form Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitStatus === "success" && (
            <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Registration submitted successfully! We will contact you soon with further details.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Please provide your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="Enter your full name"
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.fullName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.dateOfBirth && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.dateOfBirth.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      onValueChange={async (value) => {
                        setValue("gender", value as any)
                        await trigger("gender")
                      }}
                    >
                      <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.gender && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.gender.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="nationalIdOrPassport">National ID / Passport *</Label>
                    <Input
                      id="nationalIdOrPassport"
                      {...register("nationalIdOrPassport")}
                      placeholder="Enter NIC or Passport number"
                      className={errors.nationalIdOrPassport ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.nationalIdOrPassport && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.nationalIdOrPassport.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      {...register("contactNumber")}
                      placeholder="+94 77 123 4567"
                      className={errors.contactNumber ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.contactNumber && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.contactNumber.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="Enter your full address"
                    className={errors.address ? "border-red-500" : ""}
                    rows={3}
                  />
                  <AnimatePresence>
                    {errors.address && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-600"
                      >
                        {errors.address.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Educational Background
                </CardTitle>
                <CardDescription>Tell us about your educational and professional background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="highestQualification">Highest Qualification *</Label>
                    <Input
                      id="highestQualification"
                      {...register("highestQualification")}
                      placeholder="e.g., Bachelor's Degree, A/L, O/L"
                      className={errors.highestQualification ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.highestQualification && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.highestQualification.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="currentOccupation">Current Occupation *</Label>
                    <Input
                      id="currentOccupation"
                      {...register("currentOccupation")}
                      placeholder="e.g., Student, Engineer, Teacher"
                      className={errors.currentOccupation ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.currentOccupation && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.currentOccupation.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Information
                </CardTitle>
                <CardDescription>Select your preferred course and learning options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="englishProficiency">English Proficiency Level *</Label>
                    <Select
                      onValueChange={async (value) => {
                        setValue("englishProficiency", value as any)
                        await trigger("englishProficiency")
                      }}
                    >
                      <SelectTrigger className={errors.englishProficiency ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.englishProficiency && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.englishProficiency.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseAppliedFor">Course Applied For *</Label>
                    <Select
                      onValueChange={async (value) => {
                        setValue("courseAppliedFor", value as any)
                        await trigger("courseAppliedFor")
                      }}
                    >
                      <SelectTrigger className={errors.courseAppliedFor ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select course type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IELTS Academic">IELTS Academic</SelectItem>
                        <SelectItem value="IELTS General Training">IELTS General Training</SelectItem>
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.courseAppliedFor && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.courseAppliedFor.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredMode">Preferred Learning Mode *</Label>
                    <Select
                      onValueChange={async (value) => {
                        setValue("preferredMode", value as any)
                        await trigger("preferredMode")
                      }}
                    >
                      <SelectTrigger className={errors.preferredMode ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select learning mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.preferredMode && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.preferredMode.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Label htmlFor="batchIntake">Batch / Intake *</Label>
                    <Input
                      id="batchIntake"
                      {...register("batchIntake")}
                      placeholder="e.g., 2025 Q1, March 2025"
                      className={errors.batchIntake ? "border-red-500" : ""}
                    />
                    <AnimatePresence>
                      {errors.batchIntake && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.batchIntake.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredClassDays">Preferred Class Days *</Label>
                    <Select
                      onValueChange={async (value) => {
                        setValue("preferredClassDays", value as any)
                        await trigger("preferredClassDays")
                      }}
                    >
                      <SelectTrigger className={errors.preferredClassDays ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select class days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekdays">Weekdays</SelectItem>
                        <SelectItem value="Weekends">Weekends</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.preferredClassDays && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.preferredClassDays.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Preferred Payment Method *</Label>
                    <Select
                      onValueChange={async (value) => {
                        setValue("paymentMethod", value as any)
                        await trigger("paymentMethod")
                      }}
                    >
                      <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Card Payment">Card Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.paymentMethod && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-sm text-red-600"
                        >
                          {errors.paymentMethod.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Honeypot field for spam protection */}
          <input type="text" {...register("honeypot")} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <motion.div className="flex justify-center pt-6" variants={cardVariants}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="lg"
                disabled={!isValid || isSubmitting}
                className="w-full md:w-auto min-w-[200px] bg-primary hover:bg-primary/90 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>

        <motion.div className="text-center pt-8" variants={cardVariants}>
          <p className="text-sm text-muted-foreground">
            For support, contact us at{" "}
            <a href="mailto:info@fluentsphereacademy.lk" className="text-accent hover:underline transition-colors">
              info@fluentsphereacademy.lk
            </a>
          </p>
          <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
            <span>Made with love by</span>
            <a
              href="https://techloom.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition-opacity hover:opacity-80"
              aria-label="Techloom.ai"
            >
              <Image
                src="/techloom-logo.svg"
                alt="Techloom.ai"
                width={80}
                height={20}
                className="h-5 w-auto object-contain bg-[#1A1F13] rounded px-1.5 py-0.5"
              />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
