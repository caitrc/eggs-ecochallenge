export type Challenge = {
  id: number
  title: string
  description: string
  category: string
  color: string
  points: number
  daily: boolean
  impact: string
}

export const CHALLENGES: Challenge[] = [
  { id: 1, title: 'Bring a reusable bottle', description: 'Bring your own water bottle and refill it instead of buying plastic.', category: 'Food & Drink', color: '#639922', points: 5, daily: true, impact: '1 plastic bottle saved' },
  { id: 2, title: 'Walk or bike to school', description: 'Leave the car at home and get here under your own steam.', category: 'Transport', color: '#1D9E75', points: 10, daily: true, impact: '~1.2kg CO₂ saved' },
  { id: 3, title: '5-minute shower', description: 'Set a timer and keep your shower to 5 minutes or less.', category: 'Water', color: '#378ADD', points: 5, daily: true, impact: '45L water saved' },
  { id: 4, title: 'Eat a plant-based lunch', description: 'Go meat-free for your lunch today.', category: 'Food & Drink', color: '#639922', points: 8, daily: true, impact: '~0.5kg CO₂ saved' },
  { id: 5, title: 'Pick up 5 pieces of litter', description: 'Grab a handful of rubbish on your way through school.', category: 'School', color: '#BA7517', points: 10, daily: true, impact: '5 items removed' },
  { id: 6, title: 'Turn off lights when leaving', description: 'Last one out? Hit the switch.', category: 'Energy', color: '#E24B4A', points: 3, daily: true, impact: 'Energy saved' },
  { id: 7, title: 'No single-use plastic today', description: 'Get through the whole day without using any single-use plastic.', category: 'Waste', color: '#534AB7', points: 15, daily: true, impact: 'Plastic waste reduced' },
  { id: 8, title: 'Bring a reusable bag', description: 'Use a reusable bag for any shopping today.', category: 'Waste', color: '#534AB7', points: 5, daily: true, impact: '1 plastic bag saved' },
  { id: 9, title: 'Meatless Monday', description: 'Go fully meat-free for the whole day.', category: 'Food & Drink', color: '#639922', points: 20, daily: false, impact: '~1.5kg CO₂ saved' },
  { id: 10, title: 'Plant something', description: 'Plant a seed, seedling or tree anywhere.', category: 'Nature', color: '#3B6D11', points: 25, daily: false, impact: 'New plant in the world' },
  { id: 11, title: 'Start composting', description: 'Set up a compost bin or bokashi at home.', category: 'Waste', color: '#534AB7', points: 30, daily: false, impact: 'Food waste diverted' },
  { id: 12, title: 'Talk to someone about climate', description: 'Have a real conversation about environmental issues with someone.', category: 'Community', color: '#D4537E', points: 10, daily: false, impact: 'Awareness raised' },
]

export const BADGES = [
  { id: 'first_log', name: 'First step', icon: '🌱', description: 'Log your first action' },
  { id: 'streak_3', name: '3-day streak', icon: '🔥', description: '3 days in a row' },
  { id: 'streak_7', name: 'Week warrior', icon: '⚡', description: '7 days in a row' },
  { id: 'pts_50', name: 'Getting started', icon: '🌿', description: 'Earn 50 points' },
  { id: 'pts_100', name: '100 club', icon: '⭐', description: 'Earn 100 points' },
  { id: 'pts_250', name: 'Eco hero', icon: '🦸', description: 'Earn 250 points' },
  { id: 'transport', name: 'Cyclist', icon: '🚲', description: 'Walk/bike to school 3 times' },
  { id: 'water', name: 'Hydro hero', icon: '💧', description: 'Log water challenges 5 times' },
  { id: 'team', name: 'Team player', icon: '🤝', description: 'Join a team' },
  { id: 'earth_day', name: 'Earth Day', icon: '🌍', description: 'Joined on April 22' },
  { id: 'variety', name: 'All-rounder', icon: '🎨', description: 'Log 5 different challenges' },
  { id: 'litter', name: 'Litter legend', icon: '🧹', description: 'Pick up litter 5 times' },
]
