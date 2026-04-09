'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type Student = {
  id: string
  nickname: string
  tutor_class: string
  total_points: number
  team_id: string | null
}

export function useStudent(required = true) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('eggs_student')
    if (!raw) {
      if (required) router.push('/login')
      setLoading(false)
      return
    }
    setStudent(JSON.parse(raw))
    setLoading(false)
  }, [required, router])

  function updateStudent(updates: Partial<Student>) {
    if (!student) return
    const updated = { ...student, ...updates }
    setStudent(updated)
    localStorage.setItem('eggs_student', JSON.stringify(updated))
  }

  return { student, loading, updateStudent }
}
