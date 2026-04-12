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

  useEffect(() => {
    loadFeed()
  }, [student])

  async function loadFeed() {
    setLoading(true)

    const { data, error } = await supabase
      .from('activity_feed')
      .select('*, students(nickname, tutor_class)')
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (!data) {
      setLoading(false)
      return
    }

    const { data: likes } = await supabase
      .from('feed_likes')
      .select('feed_id, student_id')

    const { data: comments } = await supabase
      .from('feed_comments')
      .select('id, feed_id, comment, created_at, students(nickname)')
      .order('created_at')

    setFeed(
      data.map((item: any) => {
        const safeStudent = item.students ?? {}

        return {
          id: item.id,
          student_id: item.student_id,
          challenge_id: item.challenge_id,
          photo_url: item.photo_url,
          logged_date: item.logged_date,
          created_at: item.created_at,

          nickname: safeStudent.nickname ?? 'Student',
          tutor_class: safeStudent.tutor_class ?? '',

          likes:
            likes?.filter(l => l.feed_id === item.id).length || 0,

          liked:
            likes?.some(
              l => l.feed_id === item.id && l.student_id === student?.id
            ) || false,

          comments:
            comments
              ?.filter(c => c.feed_id === item.id)
              .map(c => ({
                id: c.id,
                comment: c.comment,
                nickname: c.students?.nickname ?? 'User',
                created_at: c.created_at,
              })) || [],

          showComments: false,
        }
      })
    )

    setLoading(false)
  }

  async function deletePost(item: FeedItem) {
    if (!student) return

    const { error } = await supabase
      .from('activity_feed')
      .update({ deleted: true })
      .eq('id', item.id)
      .eq('student_id', student.id)

    if (error) {
      console.error(error)
      showToast('Delete failed')
      return
    }

    setFeed(prev => prev.filter(f => f.id !== item.id))
    showToast('Post deleted')
  }

  async function toggleLike(item: FeedItem) {
    if (!student) return

    if (item.liked) {
      await supabase
        .from('feed_likes')
        .delete()
        .eq('feed_id', item.id)
        .eq('student_id', student.id)
    } else {
      await supabase
        .from('feed_likes')
        .insert({ feed_id: item.id, student_id: student.id })
    }

    setFeed(prev =>
      prev.map(f =>
        f.id === item.id
          ? {
              ...f,
              liked: !f.liked,
              likes: f.liked ? f.likes - 1 : f.likes + 1,
            }
          : f
      )
    )
  }

  async function addComment(item: FeedItem) {
    if (!student) return

    const text = newComment[item.id]?.trim()
    if (!text) return

    await supabase.from('feed_comments').insert({
      feed_id: item.id,
      student_id: student.id,
      comment: text,
    })

    setNewComment(prev => ({ ...prev, [item.id]: '' }))
    loadFeed()
  }

  function toggleComments(id: string) {
    setFeed(prev =>
      prev.map(f =>
        f.id === id ? { ...f, showComments: !f.showComments } : f
      )
    )
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
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
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-xl z-50">
          {toast}
        </div>
      )}

      <div className="p-4">
        <h1 className="font-semibold text-lg">Community Feed</h1>
      </div>

      {loading ? (
        <div className="p-6 text-gray-400">Loading...</div>
      ) : (
        <div className="p-4 space-y-4">
          {feed.map(item => {
            const isOwn = item.student_id === student?.id

            return (
              <div key={item.id} className="border rounded-xl p-3 bg-white">

                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{item.nickname}</p>
                    <p className="text-xs text-gray-500">{item.tutor_class}</p>
                  </div>

                  <p className="text-xs text-gray-400">
                    {timeAgo(item.created_at)}
                  </p>

                  {isOwn && (
                    <button
                      onClick={() => deletePost(item)}
                      className="text-red-400 text-xs"
                    >
                      delete
                    </button>
                  )}
                </div>

                {item.photo_url && (
                  <img
                    src={item.photo_url}
                    className="rounded-lg mt-2 max-h-72 w-full object-cover"
                  />
                )}

                <div className="flex gap-4 mt-2 text-sm">
                  <button onClick={() => toggleLike(item)}>
                    ❤️ {item.likes}
                  </button>

                  <button onClick={() => toggleComments(item.id)}>
                    💬 {item.comments.length}
                  </button>
                </div>

                {item.showComments && (
                  <div className="mt-2 space-y-2">
                    {item.comments.map(c => (
                      <p key={c.id} className="text-xs text-gray-600">
                        <b>{c.nickname}</b> {c.comment}
                      </p>
                    ))}

                    <input
                      className="border p-1 text-xs w-full"
                      placeholder="comment..."
                      value={newComment[item.id] || ''}
                      onChange={e =>
                        setNewComment(prev => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      onKeyDown={e =>
                        e.key === 'Enter' && addComment(item)
                      }
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}