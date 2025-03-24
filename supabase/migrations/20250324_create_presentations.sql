-- Create presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  url TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own presentations
CREATE POLICY "Users can read own presentations" ON presentations
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own presentations
CREATE POLICY "Users can insert own presentations" ON presentations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own presentations
CREATE POLICY "Users can update own presentations" ON presentations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own presentations
CREATE POLICY "Users can delete own presentations" ON presentations
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call update_updated_at_column function
CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON presentations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
