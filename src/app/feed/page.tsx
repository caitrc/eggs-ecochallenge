'use client'
import { useEffect, useState, useRef } from 'react'
import { useStudent } from '@/lib/useStudent'
import { supabase } from '@/lib/supabase'
import { CHALLENGES } from '@/lib/challenges'

type FeedItem = {
  id: string
  student_id: string
  challenge_id: number
  photo_url: string | null
  logged_date: string
  created_at: string
  nickname: string
  tutor_class: string
}

export default function FeedPage() {
  const { student } = useStudent(false)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadChallenge, setUploadChallenge] = useState<number | null>(null)

  useEffect(() => { loadFeed() }, [])

  async function loadFeed() {
    const { data } = await supabase
      .from('activity_feed')
      .select('*, students(nickname, tutor_class)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      setFeed(data.map((item: any) => ({
        ...item,
        nickname: item.students?.nickname,
        tutor_class: item.students?.tutor_class,
      })))
    }
    setLoading(false)
  }

  async function uploadPhoto(file: File, challengeId: number) {
    if (!student) return
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${student.id}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(path, file)

    if (uploadError) { showToast('Upload failed — try a smaller photo'); setUploading(false); return }

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path)

    await supabase.from('activity_feed').insert({
      student_id: student.id,
      challenge_id: challengeId,
      photo_url: urlData.publicUrl,
      logged_date: new Date().toISOString().split('T')[0],
    })

    // Check if contributor badge needed (5+ photos)
    const { count } = await supabase
      .from('activity_feed')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', student.id)
      .not('photo_url', 'is', null)

    if (count && count >= 5) {
      showToast('Contributor badge unlocked! 📸')
    } else {
      showToast('Photo shared to the feed!')
    }

    setUploadChallenge(null)
    loadFeed()
    setUploading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function getChallenge(id: number) {
    return CHALLENGES.find(c => c.id === id)
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-800">Activity feed</h1>
            <p className="text-xs text-gray-400 mt-0.5">See what everyone's up to</p>
          </div>
          {student && (
            <button
              onClick={() => setUploadChallenge(uploadChallenge ? null : 1)}
              className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Share proof
            </button>
          )}
        </div>

        {uploadChallenge !== null && student && (
          <div className="mt-3 bg-green-50 rounded-xl p-3 border border-green-200">
            <p className="text-xs font-medium text-green-800 mb-2">Which challenge are you sharing proof for?</p>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs mb-2 bg-white"
              value={uploadChallenge}
              onChange={e => setUploadChallenge(Number(e.target.value))}
            >
              {CHALLENGES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file && uploadChallenge) uploadPhoto(file, uploadChallenge)
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full bg-green-600 text-white rounded-lg py-2 text-xs font-medium disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Choose photo →'}
            </button>
            <p className="text-xs text-gray-400 mt-1 text-center">Upload 5 photos to earn the Contributor badge!</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading feed...</div>
      ) : feed.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-gray-500 text-sm">No activity yet — be the first to log a challenge!</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {feed.map(item => {
            const challenge = getChallenge(item.challenge_id)
            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {item.photo_url && (
                  <img src={item.photo_url} alt="proof" className="w-full h-48 object-cover" />
                )}
                <div className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700 flex-shrink-0">
                    {item.nickname?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-sm font-medium text-gray-800">{item.nickname}</span>
                      <span className="text-xs text-gray-400">{item.tutor_class}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span style={{ color: challenge?.color }}>●</span>
                      {challenge?.title}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{timeAgo(item.created_at)}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}