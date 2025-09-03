import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
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
        </div>
      </div>
    </div>
  )
}
