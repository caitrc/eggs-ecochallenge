'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home', emoji: '🏠' },
  { href: '/challenges', label: 'Challenges', emoji: '🌿' },
  { href: '/leaderboard', label: 'Scores', emoji: '🏆' },
  { href: '/teams', label: 'Teams', emoji: '👥' },
  { href: '/me', label: 'Me', emoji: '⭐' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8faf5]">
        {!isLogin && (
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
            <span className="text-green-600 font-semibold flex-1 text-base">🥚🌿 EGGS EcoChallenge</span>
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
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.emoji}</span>
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
