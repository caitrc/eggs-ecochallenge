'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        <path d="M2 12h20"/>
      </svg>
    ),
    title: 'Welcome to EGGS EcoChallenge!',
    desc: 'Join hundreds of EGGS students taking action for the planet this Earth Month — April 22 to May 22.',
    color: 'bg-green-50',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Join & log challenges',
    desc: 'Browse eco challenges, join the ones you want to do, and tap "Log it" each day you complete them to earn points.',
    color: 'bg-green-50',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Join a team',
    desc: 'Create or join a team with your friends. Your points contribute to your team\'s total — compete against other groups!',
    color: 'bg-green-50',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
        <path d="M12 2c0 0-6 5.5-6 10a6 6 0 0 0 12 0c0-4.5-6-10-6-10z"/>
        <path d="M12 12c0 0-3 2-3 4a3 3 0 0 0 6 0c0-2-3-4-3-4z" fill="#f97316" stroke="none"/>
      </svg>
    ),
    title: 'Build your streak',
    desc: 'Log actions every day to build a streak. The longer your streak, the more badges you unlock — don\'t break the chain!',
    color: 'bg-orange-50',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const current = steps[step]
  const isLast = step === steps.length - 1

  function next() {
    if (isLast) {
      localStorage.setItem('eggs_onboarded', 'true')
      router.push('/login')
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 ${current.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
            {current.icon}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">{current.title}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{current.desc}</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-green-600' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          {isLast ? 'Get started →' : 'Next →'}
        </button>

        {!isLast && (
          <button
            onClick={() => { localStorage.setItem('eggs_onboarded', 'true'); router.push('/login') }}
            className="w-full text-center text-xs text-gray-400 mt-3 py-2"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
