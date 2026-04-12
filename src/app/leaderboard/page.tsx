'use client'
import { useEffect, useState } from 'react'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'

type LeaderRow = { id: string; nickname: string; tutor_class: string; total_points: number; team_name?: string }

const COLORS = ['#EAF3DE','#E6F1FB','#FAEEDA','#FBEAF0','#F1EFE8','#E1F5EE']

export default function LeaderboardPage() {
  const { student } = useStudent(false)
  const [tab, setTab] = useState<'students' | 'classes'>('students')
  const [students, setStudents] = useState<LeaderRow[]>([])
  const [classes, setClasses] = useState<{ tutor_class: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('students')
        .select('id, nickname, tutor_class, total_points')
        .order('total_points', { ascending: false })
        .limit(50)

      if (data) {
        const rows = data.map((s: any) => ({ ...s, team_name: s.teams?.name }))
        setStudents(rows)

        // Aggregate by class
        const classMap: Record<string, number> = {}
        rows.forEach((s: any) => {
          classMap[s.tutor_class] = (classMap[s.tutor_class] || 0) + s.total_points
        })
        const classRows = Object.entries(classMap)
          .map(([tutor_class, total]) => ({ tutor_class, total }))
          .sort((a, b) => b.total - a.total)
        setClasses(classRows)
      }
      setLoading(false)
    }
    load()
  }, [])

  const maxPts = students[0]?.total_points || 1
  const maxClass = classes[0]?.total || 1

  return (
    <div>
      <div className="p-4 bg-white border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-800 mb-3">Leaderboard</h1>
        <div className="flex gap-2">
          {(['students', 'classes'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                tab === t ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-500'
              }`}
            >
              {t === 'students' ? 'Students' : 'Tutor classes'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading...</div>
      ) : (
        <div className="p-4 space-y-2">
          {tab === 'students' && students.map((s, i) => {
            const isMe = s.id === student?.id
            const pct = Math.round(s.total_points / maxPts * 100)
            const medals = ['🥇', '🥈', '🥉']
            return (
              <div key={s.id} className={`bg-white rounded-xl border p-3 flex items-center gap-3 ${isMe ? 'border-green-400' : 'border-gray-100'}`}>
                <div className="w-7 text-center text-sm font-medium text-gray-400">
                  {i < 3 ? medals[i] : i + 1}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: COLORS[i % COLORS.length], color: '#3B6D11' }}>
                  {s.nickname.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium truncate">{s.nickname}</span>
                    {isMe && <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded-full">you</span>}
                  </div>
                  <div className="text-xs text-gray-400">{s.tutor_class}{s.team_name ? ` · ${s.team_name}` : ''}</div>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1.5">
                    <div className="h-1.5 bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-sm font-semibold text-green-700 flex-shrink-0">{s.total_points}</div>
              </div>
            )
          })}

          {tab === 'classes' && classes.map((c, i) => {
            const pct = Math.round(c.total / maxClass * 100)
            return (
              <div key={c.tutor_class} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                <div className="w-7 text-center text-sm font-medium text-gray-400">{i + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.tutor_class}</div>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1.5">
                    <div className="h-1.5 bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-sm font-semibold text-green-700">{c.total} pts</div>
              </div>
            )
          })}

          {tab === 'students' && students.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No students yet — be the first to join!</p>
          )}
        </div>
      )}
    </div>
  )
}
