'use client'
import Link from 'next/link'

const roles = [
  { title: 'Software Developer', desc: 'Built the full-stack web app using Next.js, React, and TypeScript', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { title: 'Data Analyst', desc: 'Designed the database schema, leaderboards, and CO₂ impact tracking', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { title: 'Digital Engineer', desc: 'Integrated Supabase cloud database, Vercel deployment, and real-time updates', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
  { title: 'Cybersecurity Specialist', desc: 'Implemented row-level security policies and safe public access controls', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { title: 'Energy Systems Designer', desc: 'Curated challenges specifically targeting energy use in schools and homes', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { title: 'UX Designer', desc: 'Designed an intuitive mobile-first interface with onboarding, streaks, and gamification', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> },
]

const features = [
  { title: 'Daily eco challenges', desc: 'Students log real actions like turning off lights, biking to school, and reducing waste — building habits that last beyond the challenge.', color: 'bg-green-50 border-green-200', iconColor: '#3B6D11' },
  { title: 'CO₂ impact tracking', desc: 'Every logged action is converted to a real CO₂ saving. Students can see their collective environmental impact grow in real time.', color: 'bg-blue-50 border-blue-200', iconColor: '#1d4ed8' },
  { title: 'School leaderboards', desc: 'Friendly competition between students and tutor classes drives engagement and makes sustainability social and fun.', color: 'bg-amber-50 border-amber-200', iconColor: '#92400e' },
  { title: 'Community feed', desc: 'Students share photo proof of their eco actions, creating a visible culture of sustainability across the school.', color: 'bg-purple-50 border-purple-200', iconColor: '#6b21a8' },
  { title: 'Team challenges', desc: 'Students form teams and work together toward shared goals — mirroring how real-world energy transition requires collective action.', color: 'bg-rose-50 border-rose-200', iconColor: '#9f1239' },
  { title: 'Streak & badge system', desc: 'Gamified rewards keep students logging daily, turning one-off actions into lasting sustainable habits.', color: 'bg-orange-50 border-orange-200', iconColor: '#c2410c' },
]

export default function GirlBossPage() {
  return (
    <div className="pb-16">
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white px-5 pt-10 pb-8">
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          GirlBoss Edge: Sustainability — Challenge 2
        </div>
        <h1 className="text-2xl font-bold mb-2 leading-tight">Powering a Carbon-Free Aotearoa</h1>
        <p className="text-green-100 text-sm leading-relaxed mb-6">
          How might we use technology to help schools across Aotearoa become more energy efficient?
        </p>
        <div className="bg-white/15 rounded-2xl p-4 border border-white/20">
          <p className="text-white font-semibold text-base mb-1">Our answer: EGGS EcoChallenge</p>
          <p className="text-green-100 text-sm">A live, working web platform that turns sustainable habits into a school-wide movement — built by an EGGS student, for EGGS students.</p>
        </div>
      </div>

      <div className="px-4 mt-6 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">The problem</h2>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Schools are a major source of energy waste</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          New Zealand schools consume enormous amounts of energy — lights left on, devices charging overnight, car trips that could be walks. The challenge isn't technology — it's behaviour change at scale.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Existing tools like EcoChallenge.org only run for a limited time and aren't tailored to NZ schools. We needed something built specifically for EGGS — and eventually, for schools across Aotearoa.
        </p>
      </div>

      <div className="mx-4 bg-green-50 rounded-2xl border border-green-200 p-4 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Our solution at a glance</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: '12+', l: 'Eco challenges' },
            { n: '5', l: 'TechStep roles used' },
            { n: '100%', l: 'Free to use' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-xl p-3 text-center border border-green-100">
              <div className="text-xl font-bold text-green-700">{s.n}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">How it drives energy efficiency</h2>
        <div className="space-y-3">
          {features.map(f => (
            <div key={f.title} className={`rounded-xl border p-4 ${f.color}`}>
              <div className="text-sm font-semibold mb-1" style={{ color: f.iconColor }}>{f.title}</div>
              <div className="text-xs text-gray-600 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">TechStep roles used</h2>
        <div className="space-y-2">
          {roles.map(r => (
            <div key={r.title} className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-700 flex-shrink-0">
                {r.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{r.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">The vision beyond EGGS</h2>
        <div className="bg-green-700 rounded-2xl p-5 text-white">
          <p className="text-sm leading-relaxed mb-3">
            EGGS EcoChallenge is designed to scale. With minor customisation, the same platform could be deployed to any school in Aotearoa — giving every student the tools to track their impact and compete toward a carbon-zero future.
          </p>
          <p className="text-sm leading-relaxed">
            If even 100 schools adopted this platform, with 1,000 students each logging one eco action per day, that's <span className="font-bold">100,000 sustainable actions every single day</span> — turning NZ's 2050 net-zero commitment into something students are actively working toward right now.
          </p>
        </div>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Try it yourself</h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
          {[
            { href: '/', label: 'Home — see live stats & countdown' },
            { href: '/challenges', label: 'Challenges — log an eco action' },
            { href: '/leaderboard', label: 'Leaderboard — see real student scores' },
            { href: '/feed', label: 'Feed — community photo sharing' },
            { href: '/about', label: 'About — Earth Month context' },
            { href: '/why', label: 'Why it helps — science behind each action' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 group">
              <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors">{l.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-4 bg-gray-50 rounded-2xl border border-gray-200 p-4 text-center">
        <p className="text-xs text-gray-400">Built by a Year 13 student at Epsom Girls Grammar School</p>
        <p className="text-xs text-gray-400 mt-0.5">GirlBoss Edge: Sustainability Challenge 2 — 2025</p>
      </div>
    </div>
  )
}
