/*
  # Create PBI (Product Backlog Items) Schema

  1. New Tables
    - `user_stories`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `order_index` (integer, for sorting)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `features`
      - `id` (uuid, primary key)
      - `user_story_id` (uuid, foreign key to user_stories)
      - `title` (text, not null)
      - `description` (text)
      - `order_index` (integer, for sorting)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `feature_id` (uuid, foreign key to features)
      - `title` (text, not null)
      - `description` (text)
      - `order_index` (integer, for sorting)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (no auth required for this demo)
    - Add policies for public write access (no auth required for this demo)

  3. Indexes
    - Add indexes on foreign keys for better query performance
    - Add indexes on order_index for sorting
*/

-- Create user_stories table
CREATE TABLE IF NOT EXISTS user_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_story_id uuid NOT NULL REFERENCES user_stories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Allow public read access to user stories"
  ON user_stories FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to user stories"
  ON user_stories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to user stories"
  ON user_stories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from user stories"
  ON user_stories FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to features"
  ON features FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to features"
  ON features FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to features"
  ON features FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from features"
  ON features FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to tasks"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to tasks"
  ON tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to tasks"
  ON tasks FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from tasks"
  ON tasks FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS features_user_story_id_idx ON features(user_story_id);
CREATE INDEX IF NOT EXISTS tasks_feature_id_idx ON tasks(feature_id);
CREATE INDEX IF NOT EXISTS user_stories_order_idx ON user_stories(order_index);
CREATE INDEX IF NOT EXISTS features_order_idx ON features(order_index);
CREATE INDEX IF NOT EXISTS tasks_order_idx ON tasks(order_index);