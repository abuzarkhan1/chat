/*
  # Create AI Chat Application Schema

  ## Overview
  This migration sets up the database schema for an AI chat application with support for multiple AI models.
  
  ## Tables Created
  
  ### 1. models
  - `id` (uuid, primary key) - Unique identifier for each model
  - `tag` (text, unique, not null) - Model identifier (e.g., "gpt-4o", "gpt-3.5-turbo")
  - `name` (text, not null) - Human-readable model name
  - `description` (text) - Model description
  - `created_at` (timestamptz) - When the model was added
  
  ### 2. messages
  - `id` (uuid, primary key) - Unique identifier for each message
  - `user_id` (uuid, not null, foreign key) - References auth.users
  - `model_tag` (text, not null) - Which AI model was used
  - `role` (text, not null) - Message role: "user" or "assistant"
  - `content` (text, not null) - Message text content
  - `created_at` (timestamptz) - When the message was sent
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on both tables
  - Models table: Authenticated users can read all models
  - Messages table: Users can only read/write their own messages
  
  ## Important Notes
  1. Uses Supabase's built-in auth.users table for user management
  2. Message history is fully isolated per user for privacy
  3. All timestamps default to current time
  4. Foreign key ensures messages are tied to valid users
*/

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_tag text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster message queries
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Enable RLS on models table
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for models table
CREATE POLICY "Authenticated users can read all models"
  ON models
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for messages table
CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);