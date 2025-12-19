export const EVENT_CATEGORIES = [
  'Arts & Theater',
  'Concerts',
  'Conference',
  'Family',
  'Festival',
  'Musical',
  'Sports',
  'Workshop',
  'Exhibition',
  'Other'
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];