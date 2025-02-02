export const SORTBY_OPTION = [
  { value: 'startDate', label: 'Start Time (Soonest First)' },
  { value: '-startDate', label: 'Start Time (Farthest First)' },
  { value: 'name', label: 'Event Name (A to Z)' },
  { value: '-name', label: 'Event Name (Z to A)' },
] as const;
