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

## Autenticación

La aplicación utiliza Supabase para la autenticación con Google. El flujo de autenticación incluye:

1. Inicio de sesión con OAuth (Google)
2. Manejo de callback de autenticación
3. Gestión de sesiones mediante middleware

## Despliegue

La aplicación está configurada para ser desplegada en Vercel.
