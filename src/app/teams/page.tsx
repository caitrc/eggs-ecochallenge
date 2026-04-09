'use client'
import { useEffect, useState } from 'react'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'

type Team = { id: string; name: string; description: string; total_points: number; member_count: number }

export default function TeamsPage() {
  const { student, updateStudent } = useStudent(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => { loadTeams() }, [])

  async function loadTeams() {
    const { data } = await supabase
      .from('teams')
      .select('id, name, description, total_points, member_count')
      .order('total_points', { ascending: false })
    if (data) setTeams(data)
    setLoading(false)
  }

  async function joinTeam(team: Team) {
    if (!student) { showToast('Log in first!'); return }
    if (student.team_id) { showToast('Leave your current team first'); return }
    setJoining(team.id)

    await supabase.from('students').update({ team_id: team.id }).eq('id', student.id)
    await supabase.from('teams').update({
      total_points: team.total_points + student.total_points,
      member_count: team.member_count + 1,
    }).eq('id', team.id)

    updateStudent({ team_id: team.id })
    showToast(`Joined ${team.name}!`)
    loadTeams()
    setJoining(null)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const maxPts = teams[0]?.total_points || 1

  return (
    <div>
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="p-4 bg-white border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-800">Teams</h1>
        {student?.team_id && (
          <p className="text-xs text-green-700 mt-1">You're in a team — keep logging to boost your team's score!</p>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading...</div>
      ) : (
        <div className="p-4 space-y-3">
          {teams.map((team, i) => {
            const isMyTeam = student?.team_id === team.id
            const pct = Math.round(team.total_points / maxPts * 100)
            return (
              <div key={team.id} className={`bg-white rounded-xl border p-4 ${isMyTeam ? 'border-green-400' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{team.name}</span>
                      {isMyTeam && <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded-full">your team</span>}
                      {i === 0 && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded-full">🏆 leading</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{team.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-green-700">{team.total_points} pts</div>
                    <div className="text-xs text-gray-400">{team.member_count} members</div>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                  <div className="h-1.5 bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                {!isMyTeam && student && !student.team_id && (
                  <button
                    onClick={() => joinTeam(team)}
                    disabled={joining === team.id}
                    className="text-xs px-3 py-1.5 border border-green-400 text-green-700 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    {joining === team.id ? 'Joining...' : 'Join this team'}
                  </button>
                )}
              </div>
            )
          })}
          {teams.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No teams yet — ask your teacher to set them up!</p>
          )}
        </div>
      )}
    </div>
  )
}
