# Configuración de Supabase para Producción

## IMPORTANTE: Configuración necesaria en el panel de Supabase

Para que la autenticación funcione correctamente en producción, debes realizar los siguientes cambios en el panel de control de Supabase:

1. Inicia sesión en https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Authentication > URL Configuration
4. Configura los siguientes valores:

### Site URL
- Establece como Site URL: `https://presentacion.innovare.lat`

### Redirect URLs
- Añade esta URL exacta: `https://presentacion.innovare.lat/auth/callback`
- Asegúrate de que no hay otras URLs de redirección que puedan causar conflictos

## Pasos para verificar la configuración

1. Ve a Authentication > Providers
2. Asegúrate de que Google OAuth está habilitado
3. Verifica que el Client ID y Client Secret son correctos
4. Guarda los cambios

## Prueba de autenticación

Después de realizar estos cambios:
1. Abre una ventana de incógnito
2. Navega a https://presentacion.innovare.lat/admin
3. Haz clic en "Iniciar Sesión con Google"
4. Completa el proceso de autenticación
5. Deberías ser redirigido a https://presentacion.innovare.lat/admin

Si sigues teniendo problemas, revisa los logs de la consola del navegador para obtener más información.
