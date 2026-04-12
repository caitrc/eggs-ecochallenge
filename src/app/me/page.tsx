'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'
import { BADGES } from '@/lib/challenges'

type Request = { id: string; requester_id: string; team_id: string; nickname: string; tutor_class: string }

export default function MePage() {
  const { student, updateStudent } = useStudent()
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set())
  const [pendingRequests, setPendingRequests] = useState<Request[]>([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!student) return
    loadData()
  }, [student])

  async function loadData() {
    const { data: logData } = await supabase
      .from('logs')
      .select('*, challenges(title)')
      .eq('student_id', student!.id)
      .order('logged_date', { ascending: false })
      .limit(20)
    if (logData) {
      setLogs(logData)
      computeBadges(logData)
    }

    if (student!.team_id) {
      const { data: reqs } = await supabase
        .from('team_requests')
        .select('id, requester_id, team_id, students(nickname, tutor_class)')
        .eq('team_id', student!.team_id)
        .eq('status', 'pending')
      if (reqs) {
        setPendingRequests(reqs.map((r: any) => ({
          id: r.id,
          requester_id: r.requester_id,
          team_id: r.team_id,
          nickname: r.students?.nickname,
          tutor_class: r.students?.tutor_class,
        })))
      }
    }
  }

  async function handleRequest(req: Request, accept: boolean) {
    if (accept) {
      await supabase.from('students').update({ team_id: req.team_id }).eq('id', req.requester_id)
      const { data: requester } = await supabase
        .from('students').select('total_points').eq('id', req.requester_id).single()
      const { data: team } = await supabase
        .from('teams').select('member_count, total_points').eq('id', req.team_id).single()
      if (team) {
        await supabase.from('teams').update({
          member_count: team.member_count + 1,
          total_points: team.total_points + (requester?.total_points || 0),
        }).eq('id', req.team_id)
      }
      showToast(`${req.nickname} has joined the team!`)
    } else {
      showToast(`Request from ${req.nickname} declined`)
    }
    await supabase.from('team_requests').update({ status: accept ? 'accepted' : 'declined' }).eq('id', req.id)
    setPendingRequests(prev => prev.filter(r => r.id !== req.id))
  }

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
    if (logs.filter((l: any) => l.challenge_id === 2).length >= 3) earned.add('transport')
    if (logs.filter((l: any) => l.challenge_id === 3).length >= 5) earned.add('water')
    if (logs.filter((l: any) => l.challenge_id === 5).length >= 5) earned.add('litter')
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

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function logout() {
    localStorage.removeItem('eggs_student')
    router.push('/login')
  }

  if (!student) return null

  return (
    <div>
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

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

      {pendingRequests.length > 0 && (
        <div className="mx-4 mt-4">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Team join requests ({pendingRequests.length})
          </h2>
          <div className="space-y-2">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-amber-200 p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-700 flex-shrink-0">
                  {req.nickname?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{req.nickname}</div>
                  <div className="text-xs text-gray-400">{req.tutor_class} wants to join your team</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleRequest(req, true)} className="text-xs px-2.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Accept
                  </button>
                  <button onClick={() => handleRequest(req, false)} className="text-xs px-2.5 py-1.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          [logs.length, 'Actions logged'],
          [earnedBadges.size, 'Badges earned'],
          [[...new Set(logs.map(l => l.logged_date))].length, 'Active days'],
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
              <div key={badge.id} className={`rounded-xl border p-2 text-center ${earned ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-white opacity-35'}`}>
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
        <button onClick={logout} className="text-xs text-gray-400 hover:text-red-400 transition-colors">Sign out</button>
      </div>
    </div>
  )
}