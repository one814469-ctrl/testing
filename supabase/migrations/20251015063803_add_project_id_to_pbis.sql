/*
  # Add project_id to PBI tables

  1. Changes
    - Add `project_id` column to `user_stories` table
    - Add `project_id` column to `features` table
    - Add `project_id` column to `tasks` table
    - Add indexes on `project_id` columns for better query performance
    - Update existing data to use a default project_id

  2. Notes
    - All existing PBIs will be assigned to project_id '00000000-0000-0000-0000-000000000001'
    - New queries will filter by project_id
*/

-- Add project_id column to user_stories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stories' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE user_stories ADD COLUMN project_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';
  END IF;
END $$;

-- Add project_id column to features
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'features' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE features ADD COLUMN project_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';
  END IF;
END $$;

-- Add project_id column to tasks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN project_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001';
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS user_stories_project_id_idx ON user_stories(project_id);
CREATE INDEX IF NOT EXISTS features_project_id_idx ON features(project_id);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);