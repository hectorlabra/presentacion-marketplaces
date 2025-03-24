"use client"

import dynamic from "next/dynamic"

// Cargar el interceptor de autenticación con carga dinámica para evitar errores de hidratación
const AuthInterceptor = dynamic(() => import('@/components/admin/auth-interceptor'), {
  ssr: false
})

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInterceptor />
      {children}
    </>
  )
}
