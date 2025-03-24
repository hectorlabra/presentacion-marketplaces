"use client"

import { useEffect } from 'react'

export default function AuthInterceptor() {
  useEffect(() => {
    // Definir una función para convertir URLs de producción a locales
    const convertToLocalUrl = (url: string): string => {
      if (url.includes('innovare.lat')) {
        console.log('Interceptando redirección a:', url);
        const localUrl = url.replace(/https?:\/\/[^\/]+/, 'http://localhost:3000');
        console.log('Redirigiendo a versión local:', localUrl);
        return localUrl;
      }
      return url;
    };

    // Detectar si fuimos redirigidos desde la URL de producción
    if (document.referrer.includes('innovare.lat')) {
      window.location.href = 'http://localhost:3000/admin';
      return;
    }
    
    // Monitorear cambios en la URL
    const checkInterval = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl.includes('innovare.lat')) {
        window.location.href = convertToLocalUrl(currentUrl);
      }
    }, 500); // Verificar cada 500ms
    
    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  return null; // Este componente no renderiza nada
}
