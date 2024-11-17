import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/providers/auth-provider"

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Smart Parking System',
  description: 'Manage your parking spots efficiently with real-time monitoring and booking',
  keywords: ['parking', 'smart parking', 'parking management', 'parking booking'],
  authors: [
    { 
      name: 'Smart Parking System',
      url: 'https://github.com/devdaim6' 
    },
    {
      name: 'DevDaim',
      url: 'https://github.com/devdaim6',
      portfolio: 'https://devdaim.vercel.app'
    }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}