# Configuración de Supabase para el proyecto

## URLs de redirección permitidas

Para que la autenticación funcione correctamente, es necesario configurar las siguientes URLs de redirección en el panel de control de Supabase:

1. Ir a https://supabase.com/dashboard y seleccionar el proyecto
2. Ir a Authentication > URL Configuration
3. Añadir las siguientes URLs en "Redirect URLs":
   - https://presentacion.innovare.lat/auth/callback
   - https://presentacion-marketplaces-eaei.vercel.app/auth/callback
   - http://localhost:3000/auth/callback

## Dominios de sitio permitidos

También es necesario configurar los dominios de sitio permitidos:

1. En la misma sección de URL Configuration
2. Añadir los siguientes dominios en "Site URL":
   - https://presentacion.innovare.lat
   - https://presentacion-marketplaces-eaei.vercel.app
   - http://localhost:3000

## Proveedores de OAuth

Asegúrate de que el proveedor de Google OAuth esté correctamente configurado:

1. Ir a Authentication > Providers
2. Configurar Google con el Client ID y Client Secret correctos
3. Asegurarse de que el proveedor esté habilitado

Estas configuraciones son esenciales para que el flujo de autenticación funcione correctamente tanto en desarrollo como en producción.
