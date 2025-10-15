import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export interface UserStory {
  id: string;
  project_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Feature {
  id: string;
  project_id: string;
  user_story_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  feature_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}
