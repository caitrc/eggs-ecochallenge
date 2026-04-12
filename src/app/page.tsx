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
      setTime({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), mins: Math.floor((diff%3600000)/60000), started: now >= START })
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [])
  return (
    <div>
      <p className="text-green-700 text-xs mb-2 opacity-80">{time.started ? 'Challenge ends in' : 'Challenge starts in'}</p>
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

const quickLinks = [
  { href: '/challenges', label: 'Log a challenge', sub: 'Earn points today', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { href: '/leaderboard', label: 'Leaderboard', sub: 'See top students', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { href: '/teams', label: 'Teams', sub: 'Join your squad', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: '/feed', label: 'Community feed', sub: 'See what others do', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { href: '/about', label: 'About', sub: 'Earth Month info', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg> },
  { href: '/rules', label: 'Rules', sub: 'How to play', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
]

export default function HomePage() {
  const { student, loading } = useStudent(false)
  const router = useRouter()
  const [stats, setStats] = useState({ students: 0, actions: 0, co2: 0 })
  const [displayed, setDisplayed] = useState({ students: 0, actions: 0, co2: 0 })

  useEffect(() => {
    async function loadStats() {
      const [{ count: students }, { count: actions }] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('logs').select('*', { count: 'exact', head: true }),
      ])
      const target = { students: students || 0, actions: actions || 0, co2: Math.round((actions || 0) * 0.4) }
      setStats(target)
      const steps = 40
      let step = 0
      const timer = setInterval(() => {
        step++
        const ease = 1 - Math.pow(1 - step / steps, 3)
        setDisplayed({ students: Math.round(target.students * ease), actions: Math.round(target.actions * ease), co2: Math.round(target.co2 * ease) })
        if (step >= steps) clearInterval(timer)
      }, 1500 / steps)
    }
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
          <button onClick={() => router.push('/login')} className="mt-4 w-full bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-700">
            Join the challenge →
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, n: displayed.students, l: 'Students' },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, n: displayed.actions, l: 'Actions' },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>, n: `${displayed.co2}kg`, l: 'CO₂ saved' },
        ].map(({ icon, n, l }) => (
          <div key={l} className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <div className="flex justify-center mb-1">{icon}</div>
            <div className="text-base font-semibold text-green-700">{n}</div>
            <div className="text-xs text-gray-400">{l}</div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-6">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Quick links</h2>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map(item => (
            <Link key={item.href} href={item.href} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-green-200 transition-colors">
              <div className="mb-2">{item.icon}</div>
              <div className="text-sm font-medium text-gray-800">{item.label}</div>
              <div className="text-xs text-gray-400">{item.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
