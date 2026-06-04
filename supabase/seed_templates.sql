-- SQL script to create excel_templates table with file upload support (Empty / No seed data)
DROP TABLE IF EXISTS public.excel_templates CASCADE;

CREATE TABLE public.excel_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'xlsx (Excel)',
  size TEXT NOT NULL,
  downloads TEXT NOT NULL DEFAULT '0 unduhan',
  description TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.excel_templates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view templates" ON public.excel_templates
  FOR SELECT USING (true);

-- Create policies to allow authenticated CRUD
CREATE POLICY "Authenticated users can insert templates" ON public.excel_templates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update templates" ON public.excel_templates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete templates" ON public.excel_templates
  FOR DELETE USING (auth.role() = 'authenticated');
