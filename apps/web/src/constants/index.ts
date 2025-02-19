import {
  Atom,
  Baby,
  BookOpen,
  Briefcase,
  Brush,
  Camera,
  Car,
  Church,
  Circle,
  Cpu,
  DollarSign,
  Dumbbell,
  Film,
  Gamepad2,
  Gavel,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutDashboard,
  Leaf,
  LineChart,
  Megaphone,
  Mic,
  Music,
  Palette,
  Plane,
  Settings,
  Shirt,
  User,
  Utensils,
} from 'lucide-react';

export const SIDEBAR_LINK = [
  {
    grouplabel: 'Dashboard',
    items: [
      {
        label: 'Overview',
        link: '/dashboard/overview',
        icon: Home,
      },
      {
        label: 'My Events',
        link: '/dashboard/my-events',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    grouplabel: 'Account',
    items: [
      {
        label: 'Profile',
        link: '/dashboard/profile',
        icon: User,
      },
      {
        label: 'Settings',
        link: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];

export const CREATE_EVENT_STEPS = [
  {
    title: 'Upload Your Banner',
    baseroute: 'upload-banner',
    link: '/dashboard/configure/upload-banner',
  },
  {
    title: 'Create Your Event',
    baseroute: 'create-event',
    link: '/dashboard/configure/create-event',
  },
  {
    title: 'Create Your Ticket',
    baseroute: 'create-ticket',
    link: '/dashboard/configure/create-ticket',
  },
  {
    title: 'Review Your Draft',
    baseroute: 'review-draft',
    link: '/dashboard/configure/review-draft',
  },
];

export const EVENT_CATEGORY = [
  { value: 'children_family', label: 'Children, Family', icon: Baby },
  { value: 'business', label: 'Business', icon: Briefcase },
  { value: 'design_photo_video', label: 'Design, Photo, Video', icon: Camera },
  { value: 'fashion_beauty', label: 'Fashion, Beauty', icon: Shirt },
  { value: 'film_cinema', label: 'Film, Cinema', icon: Film },
  { value: 'game_esports', label: 'Game, E-Sports', icon: Gamepad2 },
  { value: 'hobby_crafts', label: 'Hobby, Crafts', icon: Palette },
  { value: 'investment_stocks', label: 'Investment, Stocks', icon: LineChart },
  {
    value: 'career_self_development',
    label: 'Career, Self Development',
    icon: BookOpen,
  },
  { value: 'religion', label: 'Religion', icon: Church },
  { value: 'health_fitness', label: 'Health, Fitness', icon: HeartPulse },
  { value: 'finance', label: 'Finance', icon: DollarSign },
  { value: 'environment', label: 'Environment', icon: Leaf },
  { value: 'food_drinks', label: 'Food, Drinks', icon: Utensils },
  { value: 'marketing', label: 'Marketing', icon: Megaphone },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'sports', label: 'Sports', icon: Dumbbell },
  { value: 'automotive', label: 'Automotive', icon: Car },
  { value: 'science_technology', label: 'Science, Technology', icon: Atom },
  { value: 'arts_culture', label: 'Arts, Culture', icon: Brush },
  { value: 'social_law_politics', label: 'Social, Law, Politics', icon: Gavel },
  { value: 'standup_comedy', label: 'Standup Comedy', icon: Mic },
  {
    value: 'education_scholarships',
    label: 'Education, Scholarships',
    icon: GraduationCap,
  },
  { value: 'tech_startup', label: 'Tech, Start-Up', icon: Cpu },
  { value: 'travel_holidays', label: 'Travel & Holidays', icon: Plane },
  { value: 'others', label: 'Others', icon: Circle },
] as const;

export const EVENT_CATEGORY_MAP = {
  children_family: 'Children, Family',
  business: 'Business',
  design_photo_video: 'Design, Photo, Video',
  fashion_beauty: 'Fashion, Beauty',
  film_cinema: 'Film, Cinema',
  game_esports: 'Game, E-Sports',
  hobby_crafts: 'Hobby, Crafts',
  investment_stocks: 'Investment, Stocks',
  career_self_development: 'Career, Self Development',
  religion: 'Religion',
  health_fitness: 'Health, Fitness',
  finance: 'Finance',
  environment: 'Environment',
  food_drinks: 'Food, Drinks',
  marketing: 'Marketing',
  music: 'Music',
  sports: 'Sports',
  automotive: 'Automotive',
  science_technology: 'Science, Technology',
  arts_culture: 'Arts, Culture',
  social_law_politics: 'Social, Law, Politics',
  standup_comedy: 'Standup Comedy',
  education_scholarships: 'Education, Scholarships',
  tech_startup: 'Tech, Start-Up',
  travel_holidays: 'Travel & Holidays',
  others: 'Others',
};

export const SORTBY_OPTION = [
  { value: 'startDate', label: 'Start Time (Soonest First)' },
  { value: '-startDate', label: 'Start Time (Farthest First)' },
  { value: 'name', label: 'Event Name (A to Z)' },
  { value: '-name', label: 'Event Name (Z to A)' },
] as const;

export const EVENT_FORMAT_OPTION = [
  { value: 'online', label: 'Online' },
  { value: 'inperson', label: 'In Person' },
] as const;

export const EVENT_START_TIME_OPTION = [
  { value: 'this_day', label: 'This Day' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
] as const;

export const EVENT_PRICE_TYPE_OPTION = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
] as const;

export const BANNER_CAROUSEL = [
  '/banner-carousel-01.jpeg',
  '/banner-carousel-02.png',
];
