'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/leaderboard', label: 'Scores' },
  { href: '/teams', label: 'Teams' },
  { href: '/feed', label: 'Feed' },
  { href: '/about', label: 'About' },
  { href: '/rules', label: 'Rules' },
  { href: '/me', label: 'Me' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login' || pathname === '/onboarding'

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#f8faf5]" style={{ fontFamily: "'Figtree', sans-serif" }}>
        {!isLogin && (
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
            <span className="text-green-600 font-semibold flex-1 text-base">🌿 EGGS EcoChallenge</span>
            <nav className="flex gap-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
        )}
        <main className="max-w-2xl mx-auto">{children}</main>
      </body>
    </html>
  )
}