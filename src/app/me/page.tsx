'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'
import { BADGES } from '@/lib/challenges'

export default function MePage() {
  const { student } = useStudent()
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!student) return
    async function load() {
      const { data } = await supabase
        .from('logs')
        .select('*, challenges(title)')
        .eq('student_id', student!.id)
        .order('logged_date', { ascending: false })
        .limit(20)
      if (data) {
        setLogs(data)
        computeBadges(data)
      }
    }
    load()
  }, [student])

  function computeBadges(logs: any[]) {
    const earned = new Set<string>()
    const pts = student?.total_points || 0

    if (logs.length >= 1) earned.add('first_log')
    if (pts >= 50) earned.add('pts_50')
    if (pts >= 100) earned.add('pts_100')
    if (pts >= 250) earned.add('pts_250')
    if (student?.team_id) earned.add('team')

    const uniqueChallenges = new Set(logs.map((l: any) => l.challenge_id))
    if (uniqueChallenges.size >= 5) earned.add('variety')

    const transportLogs = logs.filter((l: any) => l.challenge_id === 2).length
    if (transportLogs >= 3) earned.add('transport')

    const waterLogs = logs.filter((l: any) => l.challenge_id === 3).length
    if (waterLogs >= 5) earned.add('water')

    const litterLogs = logs.filter((l: any) => l.challenge_id === 5).length
    if (litterLogs >= 5) earned.add('litter')

    const joinDate = new Date(student?.created_at || '')
    if (joinDate.getMonth() === 3 && joinDate.getDate() === 22) earned.add('earth_day')

    // Streak check
    const dates = [...new Set(logs.map((l: any) => l.logged_date))].sort().reverse()
    let streak = 0
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date()
      expected.setDate(expected.getDate() - i)
      if (dates[i] === expected.toISOString().split('T')[0]) streak++
      else break
    }
    if (streak >= 3) earned.add('streak_3')
    if (streak >= 7) earned.add('streak_7')

    setEarnedBadges(earned)
  }

  function logout() {
    localStorage.removeItem('eggs_student')
    router.push('/login')
  }

  if (!student) return null

  const recentDates = [...new Set(logs.map(l => l.logged_date))].slice(0, 7)

  return (
    <div>
      <div className="bg-green-50 border-b border-green-100 p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center text-xl font-semibold text-green-800">
            {student.nickname.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{student.nickname}</h1>
            <p className="text-sm text-gray-500">{student.tutor_class}</p>
            <p className="text-base font-semibold text-green-700 mt-0.5">{student.total_points} points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          [logs.length, 'Actions logged'],
          [earnedBadges.size, 'Badges earned'],
          [recentDates.length, 'Day streak'],
        ].map(([n, l]) => (
          <div key={l as string} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="text-xl font-semibold text-green-700">{n}</div>
            <div className="text-xs text-gray-400 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      <div className="px-4 mb-4">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Badges</h2>
        <div className="grid grid-cols-4 gap-2">
          {BADGES.map(badge => {
            const earned = earnedBadges.has(badge.id)
            return (
              <div key={badge.id} className={`rounded-xl border p-2 text-center transition-opacity ${earned ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-white opacity-35'}`}>
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-[10px] font-medium leading-tight" style={{ color: earned ? '#3B6D11' : '#888' }}>{badge.name}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-4 mb-4">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Recent activity</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing logged yet — head to Challenges!</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 8).map((log, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-sm">✅</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{log.challenges?.title || 'Challenge'}</div>
                  <div className="text-xs text-gray-400">{log.logged_date}</div>
                </div>
                <div className="text-sm font-semibold text-green-700">+{log.points}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-8">
        <button onClick={logout} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  )
}
