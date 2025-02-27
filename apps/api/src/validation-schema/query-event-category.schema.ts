import { z } from 'zod';

export const QueryEventCategorySchema = z
  .enum([
    'children_family',
    'business',
    'design_photo_video',
    'fashion_beauty',
    'film_cinema',
    'game_esports',
    'hobby_crafts',
    'investment_stocks',
    'career_self_development',
    'religion',
    'health_fitness',
    'finance',
    'environment',
    'food_drinks',
    'marketing',
    'music',
    'sports',
    'automotive',
    'science_technology',
    'arts_culture',
    'social_law_politics',
    'standup_comedy',
    'education_scholarships',
    'tech_startup',
    'travel_holidays',
    'others',
  ])
  .optional();
