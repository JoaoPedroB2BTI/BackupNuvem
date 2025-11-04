/*
  # Create folders and files tables

  1. New Tables
    - `folders`
      - `id` (uuid, primary key) - Unique identifier for each folder
      - `name` (text) - Name of the folder
      - `created_at` (timestamptz) - Timestamp when folder was created
    
    - `files`
      - `id` (uuid, primary key) - Unique identifier for each file
      - `folder_id` (uuid, foreign key) - References the parent folder
      - `name` (text) - Name of the file
      - `url` (text) - URL/path to the file
      - `created_at` (timestamptz) - Timestamp when file was created

  2. Security
    - Enable RLS on both tables
    - Add policies to allow public read access (for demo purposes)
    - Add policies to allow public insert access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to folders"
  ON folders FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to folders"
  ON folders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to files"
  ON files FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to files"
  ON files FOR INSERT
  TO anon
  WITH CHECK (true);