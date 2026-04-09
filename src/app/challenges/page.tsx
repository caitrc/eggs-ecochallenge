'use client'
import { useEffect, useState } from 'react'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'
import { CHALLENGES } from '@/lib/challenges'

export default function ChallengesPage() {
  const { student, updateStudent } = useStudent()
  const [joined, setJoined] = useState<Set<number>>(new Set())
  const [logCounts, setLogCounts] = useState<Record<number, number>>({})
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(CHALLENGES.map(c => c.category)))]

  useEffect(() => {
    if (!student) return
    async function load() {
      const { data } = await supabase
        .from('student_challenges')
        .select('challenge_id, log_count')
        .eq('student_id', student!.id)
      if (data) {
        setJoined(new Set(data.map((r: any) => r.challenge_id)))
        const counts: Record<number, number> = {}
        data.forEach((r: any) => counts[r.challenge_id] = r.log_count)
        setLogCounts(counts)
      }
    }
    load()
  }, [student])

  async function joinChallenge(id: number) {
    if (!student) return
    await supabase.from('student_challenges').upsert({ student_id: student.id, challenge_id: id, log_count: 0 })
    setJoined(prev => new Set([...prev, id]))
    showToast('Joined! Now log it each day.')
  }

  async function logChallenge(challenge: typeof CHALLENGES[0]) {
    if (!student) return
    const today = new Date().toISOString().split('T')[0]

    // Check already logged today
    const { data: existing } = await supabase
      .from('logs')
      .select('id')
      .eq('student_id', student.id)
      .eq('challenge_id', challenge.id)
      .eq('logged_date', today)
      .single()

    if (existing) {
      showToast("Already logged today! Come back tomorrow.")
      return
    }

    // Insert log
    await supabase.from('logs').insert({
      student_id: student.id,
      challenge_id: challenge.id,
      points: challenge.points,
      logged_date: today,
    })

    // Update student points
    const newPts = (student.total_points || 0) + challenge.points
    await supabase.from('students').update({ total_points: newPts }).eq('id', student.id)
    updateStudent({ total_points: newPts })

    // Update student_challenges log_count
    const newCount = (logCounts[challenge.id] || 0) + 1
    await supabase.from('student_challenges')
      .update({ log_count: newCount })
      .eq('student_id', student.id)
      .eq('challenge_id', challenge.id)

    setLogCounts(prev => ({ ...prev, [challenge.id]: newCount }))
    showToast(`+${challenge.points} points! ${challenge.impact}`)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const filtered = filter === 'All' ? CHALLENGES : CHALLENGES.filter(c => c.category === filter)

  return (
    <div>
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-semibold text-gray-800">Challenges</h1>
          {student && <span className="text-sm text-green-700 font-medium">{student.total_points} pts</span>}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap border transition-colors ${
                filter === cat ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-500 hover:border-green-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filtered.map(c => {
          const isJoined = joined.has(c.id)
          const count = logCounts[c.id] || 0
          return (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: c.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-800">{c.title}</span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{c.points} pts</span>
                    {c.daily && <span className="text-xs text-gray-400">Daily</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{c.description}</p>
                  <p className="text-xs text-green-600 mt-1">💚 {c.impact}</p>
                  {count > 0 && <p className="text-xs text-gray-400 mt-1">Logged {count}× so far</p>}
                </div>
                <div className="flex-shrink-0">
                  {!student ? (
                    <span className="text-xs text-gray-400">Log in first</span>
                  ) : !isJoined ? (
                    <button onClick={() => joinChallenge(c.id)} className="text-xs px-3 py-1.5 border border-green-400 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                      Join
                    </button>
                  ) : (
                    <button onClick={() => logChallenge(c)} className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Log it ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
