'use client'
import Link from 'next/link'

const facts = [
  { icon: '🌡️', stat: '1.1°C', desc: 'Average global temperature rise since pre-industrial times' },
  { icon: '🌊', stat: '3.3mm', desc: 'Sea levels rising every year due to melting ice' },
  { icon: '🌲', stat: '15B', desc: 'Trees cut down every single year worldwide' },
  { icon: '🐟', stat: '8M tons', desc: 'Plastic entering our oceans annually' },
  { icon: '⚡', stat: '73%', desc: 'Of global emissions come from energy use' },
  { icon: '🥩', stat: '14.5%', desc: 'Of emissions come from animal agriculture' },
]

const timeline = [
  { year: '1970', event: 'First Earth Day — 20 million Americans took to the streets' },
  { year: '1990', event: 'Earth Day goes global — 200 million people in 141 countries' },
  { year: '1992', event: 'UN Earth Summit in Rio — world leaders address climate change' },
  { year: '2016', event: 'Paris Agreement signed on Earth Day by 175 countries' },
  { year: '2025', event: 'EGGS EcoChallenge launches — your turn to make a difference!' },
]

export default function AboutPage() {
  return (
    <div className="pb-12">
      <div className="bg-green-600 text-white px-4 pt-8 pb-10">
        <div className="text-5xl mb-3 text-center">🌍</div>
        <h1 className="text-2xl font-semibold text-center mb-2">About Earth Month</h1>
        <p className="text-green-100 text-sm text-center max-w-sm mx-auto">
          Every April, millions of people around the world take action for our planet. Here's why it matters.
        </p>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="text-base font-semibold text-gray-800 mb-1">What is Earth Day?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Earth Day is celebrated every April 22nd. It started in 1970 as a response to a massive oil spill in California, and has grown into the largest civic event on Earth. Earth Month extends that to the whole of April — a time to reflect, act, and inspire others.
          </p>
        </div>

        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Why it's urgent</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {facts.map(f => (
            <div key={f.stat} className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-lg font-semibold text-green-700">{f.stat}</div>
              <div className="text-xs text-gray-500 leading-tight">{f.desc}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">History of Earth Day</h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          {timeline.map((t, i) => (
            <div key={t.year} className="flex gap-3 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700 flex-shrink-0">{t.year.slice(2)}</div>
                {i < timeline.length - 1 && <div className="w-0.5 bg-green-100 flex-1 mt-1" />}
              </div>
              <div className="pt-1 pb-4">
                <div className="text-xs font-semibold text-green-700 mb-0.5">{t.year}</div>
                <div className="text-sm text-gray-600">{t.event}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 rounded-2xl border border-green-100 p-4 mb-6">
          <h2 className="text-base font-semibold text-green-800 mb-2">🥚 Why EGGS?</h2>
          <p className="text-sm text-green-700 leading-relaxed">
            Epsom Girls Grammar School is joining thousands of schools worldwide in taking action this Earth Month. Every small action you take adds up — and when 1,000 students act together, the impact is huge. This is your chance to be part of something bigger.
          </p>
        </div>

        <Link href="/why" className="block bg-green-600 text-white text-center rounded-xl py-3 text-sm font-medium hover:bg-green-700 transition-colors mb-3">
          See why each action helps →
        </Link>
        <Link href="/rules" className="block bg-white border border-gray-200 text-gray-700 text-center rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors">
          Read the rules
        </Link>
      </div>
    </div>
  )
}