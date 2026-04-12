'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const START = new Date('2025-04-22T00:00:00')
const END = new Date('2025-05-22T23:59:59')

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, started: false })

  useEffect(() => {
    function calc() {
      const now = new Date()
      const target = now < START ? START : END
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) return setTime({ days: 0, hours: 0, mins: 0, started: now >= START })
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        started: now >= START,
      })
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <p className="text-green-700 text-xs mb-2 opacity-80">
        {time.started ? 'Challenge ends in' : 'Challenge starts in'}
      </p>
      <div className="flex gap-2">
        {[['Days', time.days], ['Hours', time.hours], ['Mins', time.mins]].map(([l, n]) => (
          <div key={l as string} className="bg-white rounded-xl px-3 py-2 text-center border border-green-200 min-w-[56px]">
            <div className="text-2xl font-semibold text-green-700">{n}</div>
            <div className="text-[10px] text-green-600 uppercase tracking-wide">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { student, loading } = useStudent()
  const router = useRouter()
  const [stats, setStats] = useState({ students: 0, actions: 0, co2: 0 })
const [displayed, setDisplayed] = useState({ students: 0, actions: 0, co2: 0 })

  useEffect(() => {
    async function loadStats() {
      const [{ count: students }, { count: actions }] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('logs').select('*', { count: 'exact', head: true }),
      ])
      setStats({ students: students || 0, actions: actions || 0, co2: Math.round((actions || 0) * 0.4) })
    }
    // Animate counters
const target = { students: students || 0, actions: actions || 0, co2: Math.round((actions || 0) * 0.4) }
const duration = 1500
const steps = 40
const interval = duration / steps
let step = 0
const timer = setInterval(() => {
  step++
  const progress = step / steps
  const ease = 1 - Math.pow(1 - progress, 3)
  setDisplayed({
    students: Math.round(target.students * ease),
    actions: Math.round(target.actions * ease),
    co2: Math.round(target.co2 * ease),
  })
  if (step >= steps) clearInterval(timer)
}, interval)
    loadStats()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>

  return (
    <div>
      <div className="bg-green-50 px-4 pt-6 pb-5 border-b border-green-100">
        <h1 className="text-xl font-semibold text-green-800 mb-1">EGGS EcoChallenge 2025</h1>
        <p className="text-green-700 text-sm mb-4">Earth Day · April 22 – May 22</p>
        <Countdown />
        {student && (
          <div className="mt-4 bg-white rounded-xl p-3 border border-green-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700">
              {student.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Welcome back, {student.nickname}!</p>
              <p className="text-xs text-gray-500">{student.tutor_class} · {student.total_points} points</p>
            </div>
          </div>
        )}
        {!student && (
          <button
            onClick={() => router.push('/login')}
            className="mt-4 w-full bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-700"
          >
            Join the challenge →
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          ['Students', displayed.students, '👩'],
          ['Actions logged', displayed.actions, '✅'],
          [`${displayed.co2}kg CO₂`, 'saved', '🌍'],
        ].map(([n, l, e]) => (
          <div key={n as string} className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <div className="text-xl mb-0.5">{e}</div>
            <div className="text-base font-semibold text-green-700">{n}</div>
            <div className="text-xs text-gray-400">{l}</div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Quick links</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: '/challenges', emoji: '🌿', label: 'Log a challenge', sub: 'Earn points today' },
            { href: '/leaderboard', emoji: '🏆', label: 'Leaderboard', sub: 'See top students' },
            { href: '/teams', emoji: '👥', label: 'Teams', sub: 'Join your squad' },
            { href: '/me', emoji: '⭐', label: 'My badges', sub: 'See your progress' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-green-200 transition-colors">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-sm font-medium text-gray-800">{item.label}</div>
              <div className="text-xs text-gray-400">{item.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
