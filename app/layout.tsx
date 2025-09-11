import './globals.css'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <main className="h-screen  max-w-full pt-2 pb-0 px-3 overflow-hidden">{children}</main>
      </body>
    </html>
  )
}
