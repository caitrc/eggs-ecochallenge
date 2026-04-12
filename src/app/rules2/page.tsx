import Link from 'next/link'

const rules = [
  { num: '1', title: 'Sign up with a nickname', desc: 'Choose a nickname and your tutor class to join. Use the same ones each time to keep your progress.' },
  { num: '2', title: 'Join challenges', desc: 'Browse the challenges page and tap "Join" on any challenge you want to take part in.' },
  { num: '3', title: 'Log your actions daily', desc: 'Each day you complete a challenge, tap "Log it" to earn your points. You can only log each challenge once per day.' },
  { num: '4', title: 'Earn points', desc: 'Each challenge is worth different points based on its impact. Bigger actions = more points!' },
  { num: '5', title: 'Join or create a team', desc: 'Join a team to compete together. Your points contribute to your team\'s total score.' },
  { num: '6', title: 'Earn badges', desc: 'Complete milestones to unlock badges — streaks, point totals, and special achievements.' },
  { num: '7', title: 'Be honest', desc: 'This challenge works on the honour system. Only log actions you\'ve actually completed. The planet is counting on you! 🌍' },
]

const faqs = [
  { q: 'Can I log the same challenge multiple days in a row?', a: 'Yes! Daily challenges can be logged once per day, every day. That\'s how you build streaks and rack up points.' },
  { q: 'What if I forget to log on a day?', a: 'Unfortunately you can\'t backdate logs — so try to log on the same day you complete the action!' },
  { q: 'Can I be in more than one team?', a: 'No, you can only be in one team at a time. Choose wisely!' },
  { q: 'When does the challenge end?', a: 'The challenge runs from April 22 (Earth Day) to May 22, 2025 — exactly one month.' },
  { q: 'Is there a prize?', a: 'That\'s up to your teachers — but bragging rights and a healthier planet are pretty good prizes too!' },
]

export default function RulesPage() {
  return (
    <div className="pb-12">
      <div className="bg-green-600 text-white px-4 pt-8 pb-6 mb-4">
        <h1 className="text-2xl font-semibold mb-1">How to play</h1>
        <p className="text-green-100 text-sm">Everything you need to know to get started.</p>
      </div>

      <div className="px-4">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">The rules</h2>
        <div className="space-y-3 mb-6">
          {rules.map(r => (
            <div key={r.num} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700 flex-shrink-0">
                {r.num}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800 mb-0.5">{r.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">FAQs</h2>
        <div className="space-y-3 mb-6">
          {faqs.map(f => (
            <div key={f.q} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-sm font-medium text-gray-800 mb-1">{f.q}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 rounded-2xl border border-green-100 p-4 mb-4">
          <p className="text-sm text-green-700 text-center font-medium">Ready to make a difference? 🌿</p>
        </div>

        <Link href="/challenges" className="block bg-green-600 text-white text-center rounded-xl py-3 text-sm font-medium hover:bg-green-700 transition-colors">
          Start logging challenges →
        </Link>
      </div>
    </div>
  )
}