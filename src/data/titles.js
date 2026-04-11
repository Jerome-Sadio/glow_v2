export const TITLES = [
  {
    id: 'novice',
    name: 'Novice de l\'Éveil',
    description: 'Premier pas dans le Système.',
    icon: 'Zap',
    requirement: (state) => true, // Toujours débloqué
  },
  {
    id: 'scout',
    name: 'Éclaireur de l\'Ombre',
    description: 'Atteindre le niveau 10.',
    icon: 'Eye',
    requirement: (state) => state.progress.level >= 10,
  },
  {
    id: 'rank_d',
    name: 'Chasseur de Rang D',
    description: 'Atteindre le niveau 20.',
    icon: 'Shield',
    requirement: (state) => state.progress.level >= 20,
  },
  {
    id: 'rank_c',
    name: 'Guerrier de Rang C',
    description: 'Atteindre le niveau 40.',
    icon: 'Sword',
    requirement: (state) => state.progress.level >= 40,
  },
  {
    id: 'rank_b',
    name: 'Maître de Rang B',
    description: 'Atteindre le niveau 60.',
    icon: 'Crown',
    requirement: (state) => state.progress.level >= 60,
  },
  {
    id: 'slayer',
    name: 'Tueur de Procrastination',
    description: 'Vaincre le premier Boss.',
    icon: 'Skull',
    requirement: (state) => state.bossIndex > 0,
  },
  {
    id: 'constant',
    name: 'L\'Indomptable',
    description: 'Maintenir une séquence de 7 jours.',
    icon: 'Flame',
    requirement: (state) => state.streak >= 7,
  },
  {
    id: 'discipline',
    name: 'Architecte du Destin',
    description: 'Atteindre 50 en Discipline.',
    icon: 'Scroll',
    requirement: (state) => state.stats.discipline >= 50,
  },
  {
    id: 'infinite',
    name: 'Le Seul à S\'élever',
    description: 'Atteindre le niveau 100.',
    icon: 'Sparkles',
    requirement: (state) => state.progress.level >= 100,
  }
];
