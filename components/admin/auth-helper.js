// Script para verificar redirecciones incorrectas
// Añadir a la página principal

if (typeof window !== 'undefined') {
  // Detectar si fuimos redirigidos desde la URL de producción
  if (document.referrer.includes('innovare.lat')) {
    // Redirigir a la versión local de /admin
    window.location.href = 'http://localhost:3000/admin';
  }
  
  // Interceptar redirecciones a producción
  const originalAssign = window.location.assign;
  window.location.assign = function(url) {
    if (url.includes('innovare.lat')) {
      // Redirigir a la versión local
      console.log('Interceptando redirección a:', url);
      const localUrl = url.replace(/https?:\/\/[^\/]+/, 'http://localhost:3000');
      console.log('Redirigiendo a versión local:', localUrl);
      return originalAssign.call(this, localUrl);
    }
    return originalAssign.apply(this, arguments);
  };
  
  // También interceptar window.location.href
  const originalHrefDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
  Object.defineProperty(window.location, 'href', {
    set(value) {
      if (value.includes('innovare.lat')) {
        // Redirigir a la versión local
        console.log('Interceptando redirección a:', value);
        const localUrl = value.replace(/https?:\/\/[^\/]+/, 'http://localhost:3000');
        console.log('Redirigiendo a versión local:', localUrl);
        originalHrefDescriptor.set.call(this, localUrl);
      } else {
        originalHrefDescriptor.set.call(this, value);
      }
    },
    get() {
      return originalHrefDescriptor.get.call(this);
    }
  });
}
