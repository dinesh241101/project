/*
  # Create movies table and related schemas

  1. New Tables
    - `movies`
      - `id` (uuid, primary key)
      - `title` (text)
      - `overview` (text)
      - `release_date` (date)
      - `poster_url` (text)
      - `backdrop_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `movie_downloads`
      - `id` (uuid, primary key)
      - `movie_id` (uuid, foreign key)
      - `quality` (text)
      - `size` (text)
      - `url` (text)
      - `created_at` (timestamp)

    - `movie_genres`
      - `id` (uuid, primary key)
      - `movie_id` (uuid, foreign key)
      - `name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Add policies for public users to read movie data
*/

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  overview text NOT NULL,
  release_date date NOT NULL,
  poster_url text NOT NULL,
  backdrop_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create movie_downloads table
CREATE TABLE IF NOT EXISTS movie_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  quality text NOT NULL,
  size text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create movie_genres table
CREATE TABLE IF NOT EXISTS movie_genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_genres ENABLE ROW LEVEL SECURITY;

-- Policies for movies table
CREATE POLICY "Allow public read access" ON movies
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert" ON movies
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON movies
  FOR UPDATE TO authenticated USING (true);

-- Policies for movie_downloads table
CREATE POLICY "Allow public read access" ON movie_downloads
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert" ON movie_downloads
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON movie_downloads
  FOR UPDATE TO authenticated USING (true);

-- Policies for movie_genres table
CREATE POLICY "Allow public read access" ON movie_genres
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert" ON movie_genres
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON movie_genres
  FOR UPDATE TO authenticated USING (true);