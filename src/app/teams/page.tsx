'use client'
import { useEffect, useState } from 'react'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'

type Team = { id: string; name: string; description: string; total_points: number; member_count: number; creator_id: string }

export default function TeamsPage() {
  const { student, updateStudent } = useStudent(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [view, setView] = useState<'list' | 'create'>('list')
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [requestedTeams, setRequestedTeams] = useState<Set<string>>(new Set())

  useEffect(() => { loadTeams() }, [student])

  async function loadTeams() {
    const { data } = await supabase
      .from('teams')
      .select('id, name, description, total_points, member_count, creator_id')
      .order('total_points', { ascending: false })
    if (data) setTeams(data)

    if (student) {
      const { data: reqs } = await supabase
        .from('team_requests')
        .select('team_id')
        .eq('requester_id', student.id)
        .eq('status', 'pending')
      if (reqs) setRequestedTeams(new Set(reqs.map((r: any) => r.team_id)))
    }
    setLoading(false)
  }

  async function createTeam() {
    if (!student) { showToast('Log in first!'); return }
    if (!newName.trim()) { showToast('Please enter a team name'); return }
    if (student.team_id) { showToast('You are already in a team'); return }
    setCreating(true)

    const { data: team, error } = await supabase
      .from('teams')
      .insert({ name: newName.trim(), description: newDesc.trim(), total_points: 0, member_count: 1, creator_id: student.id })
      .select()
      .single()

    if (error || !team) { showToast('Could not create team'); setCreating(false); return }

    await supabase.from('students').update({ team_id: team.id }).eq('id', student.id)
    updateStudent({ team_id: team.id })
    showToast(`Team "${team.name}" created! You're in!`)
    setNewName('')
    setNewDesc('')
    setView('list')
    loadTeams()
    setCreating(false)
  }

  async function requestJoin(team: Team) {
    if (!student) { showToast('Log in first!'); return }
    if (student.team_id) { showToast('Leave your current team first'); return }
    if (requestedTeams.has(team.id)) { showToast('Request already sent!'); return }

    const { error } = await supabase
      .from('team_requests')
      .insert({ team_id: team.id, requester_id: student.id, status: 'pending' })

    if (error) { showToast('Could not send request'); return }

    setRequestedTeams(prev => new Set([...prev, team.id]))
    showToast(`Request sent to ${team.name}!`)
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

      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">Teams</h1>
        {!student?.team_id && student && (
          <button
            onClick={() => setView(view === 'create' ? 'list' : 'create')}
            className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {view === 'create' ? 'Cancel' : '+ Create team'}
          </button>
        )}
      </div>

      {view === 'create' && (
        <div className="m-4 bg-white rounded-xl border border-green-200 p-4 space-y-3">
          <h2 className="text-sm font-medium text-gray-800">Create a new team</h2>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Team name</label>
            <input
              type="text"
              placeholder="e.g. Eco Warriors"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              maxLength={30}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description (optional)</label>
            <input
              type="text"
              placeholder="What's your team about?"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              maxLength={60}
            />
          </div>
          <button
            onClick={createTeam}
            disabled={creating}
            className="w-full bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create team'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading...</div>
      ) : (
        <div className="p-4 space-y-3">
          {teams.map((team, i) => {
            const isMyTeam = student?.team_id === team.id
            const hasRequested = requestedTeams.has(team.id)
            const pct = Math.round(team.total_points / maxPts * 100)
            return (
              <div key={team.id} className={`bg-white rounded-xl border p-4 ${isMyTeam ? 'border-green-400' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{team.name}</span>
                      {isMyTeam && <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded-full">your team</span>}
                      {i === 0 && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded-full">🏆 leading</span>}
                    </div>
                    {team.description && <p className="text-xs text-gray-400 mt-0.5">{team.description}</p>}
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
                    onClick={() => requestJoin(team)}
                    disabled={hasRequested}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      hasRequested
                        ? 'border-gray-200 text-gray-400 cursor-default'
                        : 'border-green-400 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {hasRequested ? 'Request sent ✓' : 'Request to join'}
                  </button>
                )}
              </div>
            )
          })}
          {teams.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No teams yet — be the first to create one!</p>
          )}
        </div>
      )}
    </div>
  )
}
