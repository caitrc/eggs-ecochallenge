'use client'
import { useState } from 'react'

const actions = [
  {
    id: 1, icon: '💧', title: 'Bring a reusable bottle', category: 'Waste',
    co2: '0kg CO₂', water: '1 bottle saved', energy: '-',
    why: 'Single-use plastic bottles take 450 years to decompose. New Zealand uses over 1 billion plastic bottles a year. Bringing your own means one less bottle in landfill or the ocean.',
    funFact: 'It takes 3 litres of water just to manufacture 1 litre of bottled water!',
    color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-700',
  },
  {
    id: 2, icon: '🚲', title: 'Walk or bike to school', category: 'Transport',
    co2: '~1.2kg CO₂', water: '-', energy: 'Zero fuel',
    why: 'Transport is one of New Zealand\'s biggest sources of emissions. A typical car trip to school produces over 1kg of CO₂. Walking or cycling produces zero — and it\'s better for your health too!',
    funFact: 'If every EGGS student biked to school once a week, we\'d save over 60kg of CO₂ every week!',
    color: 'bg-green-50 border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-700',
  },
  {
    id: 3, icon: '🚿', title: '5-minute shower', category: 'Water',
    co2: '0.2kg CO₂', water: '45L saved', energy: 'Less hot water',
    why: 'The average New Zealander uses 150 litres of water a day. Cutting your shower from 10 to 5 minutes saves 45 litres — and reduces the energy needed to heat that water.',
    funFact: 'A 5-minute shower uses the same water as flushing a toilet 9 times.',
    color: 'bg-cyan-50 border-cyan-100', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-700',
  },
  {
    id: 4, icon: '🥗', title: 'Eat a plant-based lunch', category: 'Food',
    co2: '~0.5kg CO₂', water: '500L saved', energy: '-',
    why: 'Meat production uses enormous amounts of land, water, and energy. A beef burger produces 5x more emissions than a veggie burger. One plant-based meal a day can cut your food emissions by 50%.',
    funFact: 'Producing 1kg of beef requires 15,000 litres of water. A kg of vegetables needs just 300 litres.',
    color: 'bg-lime-50 border-lime-100', iconBg: 'bg-lime-100', iconColor: 'text-lime-700',
  },
  {
    id: 5, icon: '🧹', title: 'Pick up 5 pieces of litter', category: 'School',
    co2: '-', water: 'Waterways protected', energy: '-',
    why: 'Litter doesn\'t just look bad — it kills wildlife and pollutes waterways. In New Zealand, 80% of ocean pollution starts on land. Picking up just 5 pieces a day makes a real difference at scale.',
    funFact: 'A cigarette butt can contaminate up to 1,000 litres of water with toxic chemicals.',
    color: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-700',
  },
  {
    id: 6, icon: '💡', title: 'Turn off lights when leaving', category: 'Energy',
    co2: '~0.05kg CO₂', water: '-', energy: '60W saved/hour',
    why: 'New Zealand generates about 80% of its electricity from renewables — but that other 20% still matters. Lights left on in empty rooms waste energy that could power something useful.',
    funFact: 'If every school in NZ turned off lights in empty rooms, it would save enough energy to power 1,000 homes.',
    color: 'bg-yellow-50 border-yellow-100', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-700',
  },
  {
    id: 7, icon: '🚫', title: 'No single-use plastic today', category: 'Waste',
    co2: '~0.1kg CO₂', water: '-', energy: '-',
    why: 'Only 9% of plastic ever made has been recycled. The rest ends up in landfill, oceans, or burned. Single-use plastics like straws, bags and packaging are the worst offenders.',
    funFact: 'There are now more pieces of microplastic in the ocean than stars in the Milky Way.',
    color: 'bg-purple-50 border-purple-100', iconBg: 'bg-purple-100', iconColor: 'text-purple-700',
  },
  {
    id: 8, icon: '👜', title: 'Bring a reusable bag', category: 'Waste',
    co2: '~0.02kg CO₂', water: '-', energy: '-',
    why: 'A single plastic bag is used for an average of 12 minutes but takes 1,000 years to break down. New Zealand banned single-use plastic bags in 2019 — but reusable bags still make a difference globally.',
    funFact: 'A cotton tote bag needs to be used 131 times to have a lower impact than a plastic bag — so keep using yours!',
    color: 'bg-orange-50 border-orange-100', iconBg: 'bg-orange-100', iconColor: 'text-orange-700',
  },
]

export default function WhyPage() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="pb-12">
      <div className="bg-green-600 text-white px-4 pt-8 pb-6 mb-4">
        <h1 className="text-2xl font-semibold mb-1">Why it all helps</h1>
        <p className="text-green-100 text-sm">Tap any action to see the science behind it.</p>
      </div>

      <div className="px-4 space-y-3">
        {actions.map(a => (
          <div
            key={a.id}
            className={`rounded-2xl border ${a.color} overflow-hidden cursor-pointer`}
            onClick={() => setExpanded(expanded === a.id ? null : a.id)}
          >
            <div className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center text-xl flex-shrink-0`}>
                {a.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{a.title}</div>
                <div className="text-xs text-gray-500">{a.category}</div>
              </div>
              <div className={`text-lg transition-transform ${expanded === a.id ? 'rotate-180' : ''}`}>⌄</div>
            </div>

            {expanded === a.id && (
              <div className="px-4 pb-4 border-t border-white/50">
                <div className="flex gap-2 mt-3 mb-3 flex-wrap">
                  {a.co2 !== '-' && <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">🌍 {a.co2}</span>}
                  {a.water !== '-' && <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">💧 {a.water}</span>}
                  {a.energy !== '-' && <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-600">⚡ {a.energy}</span>}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{a.why}</p>
                <div className="bg-white/60 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">💡 Fun fact</p>
                  <p className="text-sm text-gray-700">{a.funFact}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}