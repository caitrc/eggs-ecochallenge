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
  likes: number
  liked: boolean
  comments: Comment[]
  showComments: boolean
}

type Comment = {
  id: string
  comment: string
  nickname: string
  created_at: string
}

export default function FeedPage() {
  const { student } = useStudent(false)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadChallenge, setUploadChallenge] = useState(1)
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadFeed() }, [student])

  async function loadFeed() {
    const { data } = await supabase
      .from('activity_feed')
      .select('*, students(nickname, tutor_class)')
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!data) { setLoading(false); return }

    const ids = data.map((i: any) => i.id)

    const [{ data: likes }, { data: comments }] = await Promise.all([
      supabase.from('feed_likes').select('feed_id, student_id').in('feed_id', ids),
      supabase.from('feed_comments').select('id, feed_id, comment, created_at, students(nickname)').in('feed_id', ids).order('created_at'),
    ])

    setFeed(data.map((item: any) => ({
      ...item,
      nickname: item.students?.nickname,
      tutor_class: item.students?.tutor_class,
      likes: likes?.filter((l: any) => l.feed_id === item.id).length || 0,
      liked: likes?.some((l: any) => l.feed_id === item.id && l.student_id === student?.id) || false,
      comments: comments?.filter((c: any) => c.feed_id === item.id).map((c: any) => ({
        id: c.id, comment: c.comment, nickname: c.students?.nickname, created_at: c.created_at,
      })) || [],
      showComments: false,
    })))
    setLoading(false)
  }

  async function uploadPhoto(file: File) {
    if (!student) return
    if (file.size > 5 * 1024 * 1024) { showToast('Photo too large — please use one under 5MB'); return }
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${student.id}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('photos').upload(path, file)
    if (error) { showToast('Upload failed — try again'); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path)
    await supabase.from('activity_feed').insert({
      student_id: student.id,
      challenge_id: uploadChallenge,
      photo_url: urlData.publicUrl,
      logged_date: new Date().toISOString().split('T')[0],
    })
    const { count } = await supabase
      .from('activity_feed')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', student.id)
      .not('photo_url', 'is', null)
    showToast(count && count >= 5 ? 'Contributor badge unlocked!' : 'Shared to the feed!')
    setShowUpload(false)
    loadFeed()
    setUploading(false)
  }

  async function toggleLike(item: FeedItem) {
    if (!student) { showToast('Log in to like posts!'); return }
    if (item.liked) {
      await supabase.from('feed_likes').delete().eq('feed_id', item.id).eq('student_id', student.id)
    } else {
      await supabase.from('feed_likes').insert({ feed_id: item.id, student_id: student.id })
    }
    setFeed(prev => prev.map(f => f.id === item.id ? {
      ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1
    } : f))
  }

  async function addComment(item: FeedItem) {
    if (!student) { showToast('Log in to comment!'); return }
    const text = newComment[item.id]?.trim()
    if (!text) return
    await supabase.from('feed_comments').insert({ feed_id: item.id, student_id: student.id, comment: text })
    setNewComment(prev => ({ ...prev, [item.id]: '' }))
    loadFeed()
  }

  async function deletePost(item: FeedItem) {
    await supabase.from('activity_feed').update({ deleted: true }).eq('id', item.id)
    setFeed(prev => prev.filter(f => f.id !== item.id))
    showToast('Post deleted')
  }

  function toggleComments(id: string) {
    setFeed(prev => prev.map(f => f.id === id ? { ...f, showComments: !f.showComments } : f))
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
    if (mins < 1) return 'just now'
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
        <h1 className="text-base font-semibold text-gray-800 mb-0.5">Community feed</h1>
        <p className="text-xs text-gray-400 mb-3">See what your EGGS community is up to</p>
        {student && (
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="text-xs px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {showUpload ? 'Cancel' : '+ Share your journey'}
          </button>
        )}

        {showUpload && student && (
          <div className="mt-3 bg-green-50 rounded-xl p-3 border border-green-200">
            <p className="text-xs font-medium text-green-800 mb-2">What are you sharing?</p>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs mb-2 bg-white"
              value={uploadChallenge}
              onChange={e => setUploadChallenge(Number(e.target.value))}
            >
              {CHALLENGES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f) }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full bg-green-600 text-white rounded-lg py-2 text-xs font-medium disabled:opacity-50">
              {uploading ? 'Uploading...' : 'Choose photo →'}
            </button>
            <p className="text-xs text-gray-400 mt-1.5 text-center">Max 5MB · Upload 5 photos to earn the Contributor badge!</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading feed...</div>
      ) : feed.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium">No posts yet</p>
          <p className="text-gray-400 text-xs mt-1">Be the first to share your journey!</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {feed.map(item => {
            const challenge = getChallenge(item.challenge_id)
            const isOwn = item.student_id === student?.id
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {item.photo_url && (
                  <div className="relative">
                    <img
                      src={item.photo_url}
                      alt="eco action proof"
                      className="w-full object-cover"
                      style={{ maxHeight: '320px' }}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700 flex-shrink-0">
                      {item.nickname?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-800">{item.nickname}</span>
                        <span className="text-xs text-gray-400">{item.tutor_class}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span style={{ color: challenge?.color }}>●</span>
                        {challenge?.title}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{timeAgo(item.created_at)}</span>
                    {isOwn && (
                      <button onClick={() => deletePost(item)} className="text-xs text-gray-300 hover:text-red-400 transition-colors ml-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                    <button
                      onClick={() => toggleLike(item)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${item.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={item.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {item.likes > 0 && <span>{item.likes}</span>}
                    </button>
                    <button
                      onClick={() => toggleComments(item.id)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      {item.comments.length > 0 && <span>{item.comments.length}</span>}
                    </button>
                  </div>

                  {item.showComments && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      {item.comments.map(c => (
                        <div key={c.id} className="flex gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-semibold text-green-700 flex-shrink-0">
                            {c.nickname?.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="bg-gray-50 rounded-lg px-2.5 py-1.5 flex-1">
                            <span className="text-xs font-medium text-gray-700">{c.nickname} </span>
                            <span className="text-xs text-gray-500">{c.comment}</span>
                          </div>
                        </div>
                      ))}
                      {student && (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[item.id] || ''}
                            onChange={e => setNewComment(prev => ({ ...prev, [item.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && addComment(item)}
                            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-green-400"
                          />
                          <button onClick={() => addComment(item)} className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg">
                            Post
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
