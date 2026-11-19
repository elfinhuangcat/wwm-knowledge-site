window.WWM_MESSAGES = {
  language: 'en',
  brand: '燕云行笺', subtitle: 'Your little handbook for WWM', home: '燕云行笺 home',
  menu: 'Menu', navigation: 'Main navigation', directory: ' index', closeImage: 'Close image',
  zoomClick: 'Click to enlarge', zoomDouble: 'Double-click to enlarge',
  changeLog: 'Changelog', languageLabel: 'Language',
  disclaimer: 'Unofficial fan-made guide. Where Winds Meet and related game assets are property of NetEase/Everstone Studio. This site is not affiliated with or endorsed by NetEase.',
  features: { checklist: 'Checklist', 'no-miss': 'Worth Doing', guild: 'Guild 101', wiki: 'Encyclopedia' },
  categories: { develop: 'Progression', farm: 'Farming', jianghu: 'Jianghu' },
  pages: {
    checklist: 'Checklist', changelog: 'Changelog', 'hexi-glazed-tiles': 'Hexi Prismatic Essence', merchants: 'Merchants Worth Visiting',
    'activity-guide': 'Guild Activity and Wonder Jade Guide', 'perk-guide': 'Guild Perks',
    divinecraft: 'Divinecraft', 'stores-must-buy': 'Weekly Shop Priorities', 'energy-well-spent': 'Spending Energy',
    'fire-oil-farming': 'Farming Fire Oil in Solo Mode', 'mohist-blueprint': 'Mohist Hill Construction and Diagrams', 'trading-guide': 'Market Trading Guide'
  },
  checklist: {
    locale: 'en', completed: 'Done', activity: 'Activity', category: 'Category', priority: 'Priority', rewards: 'Rewards / Goals', rewardLabel: 'Rewards', time: 'Time', deadline: 'Deadline',
    sortCompletion: 'Sort by completion', sortCategory: 'Sort by category', sortPriority: 'Sort by priority', sortTime: 'Sort by time',
    markCompleted: name => `Mark ${name} complete`, monthly: 'Monthly', guild: 'Guild activity', details: 'Toggle details',
    guide: 'How to complete', notes: 'Notes', none: 'None', loadError: 'Limited-time events could not load. Refresh to try again.',
    empty: 'No activities match the current filters.', lessThanDay: 'Less than 1 day', remainingDays: days => `${days} days left`,
    priorities: { 高: 'High', 中: 'Medium', 低: 'Low' },
    timeLevels: { 极低: 'Very short', 低: 'Short', 中: 'Medium', 高: 'Long', '不定，通常久': 'Varies (usually long)' },
    progress: { Limited: 'Limited-time progress', Daily: 'Today’s progress', Recurring: 'Weekly / monthly progress' },
    beijingTime: (hour, minute) => `Beijing time ${hour}:${minute}`,
    reset: { Limited: 'Completion resets vary by event', Daily: 'Resets daily at 05:00', Recurring: 'Resets Mondays / 1st of the month at 05:00' }
  }
};
