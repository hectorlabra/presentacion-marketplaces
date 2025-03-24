-- Verificar si la columna promotion_end_date existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'presentations' 
        AND column_name = 'promotion_end_date'
    ) THEN
        -- Si no existe, crear la columna
        ALTER TABLE presentations ADD COLUMN promotion_end_date timestamptz;
    ELSE
        -- Si existe, asegurarnos de que sea del tipo correcto
        ALTER TABLE presentations ALTER COLUMN promotion_end_date TYPE timestamptz USING promotion_end_date::timestamptz;
    END IF;
END $$;

-- Actualizar datos existentes si están en un formato incorrecto
UPDATE presentations 
SET promotion_end_date = NULL 
WHERE promotion_end_date IS NOT NULL 
AND NOT promotion_end_date::text ~ '^\d{4}-\d{2}-\d{2}.*$';

-- Agregar comentario a la columna para documentación
COMMENT ON COLUMN presentations.promotion_end_date IS 'Fecha límite de la promoción en formato timestamptz. NULL si no hay promoción activa.';

-- Crear índice para mejorar el rendimiento de las consultas por fecha
CREATE INDEX IF NOT EXISTS idx_presentations_promotion_end_date ON presentations (promotion_end_date);
