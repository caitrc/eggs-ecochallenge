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
      supabase.from('feed_comments')
        .select('id, feed_id, comment, created_at, students(nickname)')
        .in('feed_id', ids)
        .order('created_at'),
    ])

    setFeed(data.map((item: any) => ({
      ...item,
      nickname: item.students?.nickname,
      tutor_class: item.students?.tutor_class,
      likes: likes?.filter((l: any) => l.feed_id === item.id).length || 0,
      liked: likes?.some((l: any) => l.feed_id === item.id && l.student_id === student?.id) || false,
      comments: comments?.filter((c: any) => c.feed_id === item.id).map((c: any) => ({
        id: c.id,
        comment: c.comment,
        nickname: c.students?.nickname,
        created_at: c.created_at,
      })) || [],
      showComments: false,
    })))

    setLoading(false)
  }

  async function deletePost(item: FeedItem) {
    if (!student) {
      showToast('You must be logged in')
      return
    }

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

  async function uploadPhoto(file: File) {
    if (!student) return
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo too large — please use one under 5MB')
      return
    }

    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${student.id}-${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('photos').upload(path, file)
    if (error) {
      showToast('Upload failed — try again')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path)

    await supabase.from('activity_feed').insert({
      student_id: student.id,
      challenge_id: uploadChallenge,
      photo_url: urlData.publicUrl,
      logged_date: new Date().toISOString().split('T')[0],
    })

    setShowUpload(false)
    loadFeed()
    setUploading(false)
  }

  async function toggleLike(item: FeedItem) {
    if (!student) {
      showToast('Log in to like posts!')
      return
    }

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
          ? { ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 }
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

      {/* EVERYTHING ELSE IN YOUR UI STAYS EXACTLY THE SAME */}
    </div>
  )
}