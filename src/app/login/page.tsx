'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const TUTOR_CLASSES = [
  '9HEE','9VAN','9SMI','9BRO','9JON',
  '10HEE','10VAN','10SMI','10BRO','10JON',
  '11HEE','11VAN','11SMI','11BRO','11JON',
  '12HEE','12VAN','12SMI','12BRO','12JON',
  '13HEE','13VAN','13SMI','13BRO','13JON',
]

export default function LoginPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [tutorClass, setTutorClass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin() {
    if (!nickname.trim()) return setError('Please enter a nickname')
    if (!tutorClass) return setError('Please select your tutor class')
    setLoading(true)
    setError('')

    // Check if student already exists
    const { data: existing } = await supabase
      .from('students')
      .select('id, nickname, tutor_class, total_points, team_id')
      .eq('nickname', nickname.trim())
      .eq('tutor_class', tutorClass)
      .single()

    if (existing) {
      localStorage.setItem('eggs_student', JSON.stringify(existing))
      router.push('/')
      return
    }

    // Create new student
    const { data: newStudent, error: err } = await supabase
      .from('students')
      .insert({ nickname: nickname.trim(), tutor_class: tutorClass, total_points: 0 })
      .select()
      .single()

    if (err) {
      setError('Error: ' + err.message)
      
      setLoading(false)
      return
    }

    localStorage.setItem('eggs_student', JSON.stringify(newStudent))
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#f8faf5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥚🌿</div>
          <h1 className="text-2xl font-semibold text-green-700">EGGS EcoChallenge</h1>
          <p className="text-gray-500 text-sm mt-1">April 22 – May 22, 2025</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Your nickname</label>
            <input
              type="text"
              placeholder="e.g. EcoAroha"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
              maxLength={20}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Tutor class</label>
            <select
              value={tutorClass}
              onChange={e => setTutorClass(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white"
            >
              <option value="">Select your class...</option>
              {TUTOR_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Don't see yours? It'll be added soon.</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join the challenge →'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Same nickname + class = you're recognised next time
        </p>
      </div>
    </div>
  )
}
