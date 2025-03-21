# Presentación Marketplaces

Aplicación web para presentaciones de marketplaces desarrollada con Next.js y Supabase.

## Tecnologías

- Next.js 15.1.0
- React 19
- Supabase (Autenticación y Base de datos)
- Tailwind CSS
- Shadcn UI Components

## Configuración

1. Clona el repositorio
2. Instala las dependencias: `npm install --legacy-peer-deps`
3. Crea un archivo `.env.local` con las siguientes variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```
4. Ejecuta el servidor de desarrollo: `npm run dev`

## Estructura del Proyecto

- `/app`: Rutas y páginas de la aplicación (Next.js App Router)
- `/components`: Componentes React, incluidos los slides de presentación
- `/lib`: Utilidades y configuración de Supabase
- `/public`: Archivos estáticos
- `/styles`: Estilos globales
