-- Verificar si la columna content existe y crearla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'content'
    ) THEN
        ALTER TABLE public.presentations ADD COLUMN content JSONB NOT NULL DEFAULT '{}';
    END IF;
END
$$;

-- Verificar si la columna prospect_name existe y eliminarla si existe
-- (solo después de migrar los datos a la columna content)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'prospect_name'
    ) THEN
        -- Primero migrar los datos existentes a la columna content
        UPDATE public.presentations
        SET content = jsonb_build_object(
            'prospect_name', prospect_name,
            'challenge_fields', CASE WHEN challenge_fields IS NULL THEN '[]'::jsonb ELSE to_jsonb(challenge_fields) END,
            'price', CASE WHEN price IS NULL THEN 0 ELSE price END,
            'promotion_end_date', CASE WHEN promotion_end_date IS NULL THEN null ELSE to_jsonb(promotion_end_date) END,
            'whatsapp_link', whatsapp_link,
            'slug', slug
        )
        WHERE content = '{}' OR content IS NULL;
        
        -- Luego eliminar las columnas antiguas
        -- Comentado para evitar pérdida de datos hasta confirmar que la migración fue exitosa
        -- ALTER TABLE public.presentations DROP COLUMN IF EXISTS prospect_name;
        -- ALTER TABLE public.presentations DROP COLUMN IF EXISTS challenge_fields;
        -- ALTER TABLE public.presentations DROP COLUMN IF EXISTS price;
        -- ALTER TABLE public.presentations DROP COLUMN IF EXISTS promotion_end_date;
        -- ALTER TABLE public.presentations DROP COLUMN IF EXISTS whatsapp_link;
        -- ALTER TABLE public.presentations DROP COLUMN IF EXISTS slug;
    END IF;
END
$$;

-- Asegurarse de que existan las columnas necesarias
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'title'
    ) THEN
        ALTER TABLE public.presentations ADD COLUMN title TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.presentations ADD COLUMN status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'url'
    ) THEN
        ALTER TABLE public.presentations ADD COLUMN url TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.presentations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.presentations ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'presentations'
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.presentations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END
$$;

-- Asegurarse de que la tabla tenga Row Level Security habilitada
ALTER TABLE IF EXISTS public.presentations ENABLE ROW LEVEL SECURITY;

-- Crear o reemplazar las políticas de RLS
DROP POLICY IF EXISTS "Users can read own presentations" ON public.presentations;
CREATE POLICY "Users can read own presentations" ON public.presentations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own presentations" ON public.presentations;
CREATE POLICY "Users can insert own presentations" ON public.presentations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own presentations" ON public.presentations;
CREATE POLICY "Users can update own presentations" ON public.presentations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own presentations" ON public.presentations;
CREATE POLICY "Users can delete own presentations" ON public.presentations
  FOR DELETE USING (auth.uid() = user_id);
