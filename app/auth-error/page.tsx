"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AuthErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-white text-center">Error de Autenticación</h1>
          <p className="mb-6 text-sm text-zinc-400 text-center">
            Ocurrió un error durante el proceso de autenticación. Por favor, intenta nuevamente.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => router.push('/admin')} 
              className="bg-neon-green hover:bg-neon-green/90 text-black"
            >
              Volver a Intentar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
