/*
  # Add ads and affiliate management tables

  1. New Tables
    - `ad_spots`
      - `id` (uuid, primary key)
      - `name` (text) - e.g., 'search_next', 'movie_image'
      - `click_count` (int) - Track number of clicks
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `ad_content`
      - `id` (uuid, primary key)
      - `spot_id` (uuid, foreign key)
      - `type` (text) - 'google_ad', 'affiliate', 'custom'
      - `content` (text) - Ad code or affiliate link
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage ads
*/

-- Create ad_spots table
CREATE TABLE IF NOT EXISTS ad_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  click_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ad_content table
CREATE TABLE IF NOT EXISTS ad_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid REFERENCES ad_spots(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('google_ad', 'affiliate', 'custom')),
  content text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ad_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_content ENABLE ROW LEVEL SECURITY;

-- Policies for ad_spots
CREATE POLICY "Allow public read access" ON ad_spots
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to manage" ON ad_spots
  FOR ALL TO authenticated USING (true);

-- Policies for ad_content
CREATE POLICY "Allow public read access" ON ad_content
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to manage" ON ad_content
  FOR ALL TO authenticated USING (true);

-- Insert default ad spots
INSERT INTO ad_spots (name) VALUES
  ('search_next'),
  ('movie_image'),
  ('movie_details'),
  ('homepage_sidebar')
ON CONFLICT (name) DO NOTHING;