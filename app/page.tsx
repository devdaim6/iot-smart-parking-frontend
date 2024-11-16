import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Car, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Card className="w-[90%] max-w-4xl shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Car className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Smart Parking System
          </CardTitle>
          <CardDescription className="text-xl">
            Manage your parking spots efficiently with real-time monitoring and booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full group">
                Login
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full group">
                Register
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}