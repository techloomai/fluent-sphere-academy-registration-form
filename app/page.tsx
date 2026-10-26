import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/fluent-sphere-logo.jpg"
              alt="Fluent Sphere Academy Logo"
              width={120}
              height={120}
              className="rounded-lg shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-primary">Fluent Sphere Academy</h1>
          <p className="text-lg text-muted-foreground">Unlock your English potential with expert IELTS preparation</p>
        </div>

        <div className="space-y-4">
          <Link href="/register">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
              Register Now
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">
            Join thousands of successful students who achieved their IELTS goals
          </p>
        </div>

        <div className="pt-8 border-t">
          <p className="text-xs text-muted-foreground">
            For support, contact us at{" "}
            <a href="mailto:info@fluentsphereacademy.lk" className="text-accent hover:underline">
              info@fluentsphereacademy.lk
            </a>
          </p>
          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
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
        </div>
      </div>
    </div>
  )
}
