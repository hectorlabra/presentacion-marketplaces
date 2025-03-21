"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StepTwoProps {
  onSubmit: (data: { price: number; promotionEndDate: string; whatsappLink: string }) => void
  onBack: () => void
  initialData: {
    price: number
    promotionEndDate: string
    whatsappLink: string
  }
  isSubmitting: boolean
}

export default function StepTwo({ onSubmit, onBack, initialData, isSubmitting }: StepTwoProps) {
  const [price, setPrice] = useState(initialData.price)
  const [promotionEndDate, setPromotionEndDate] = useState(initialData.promotionEndDate)
  const [whatsappLink, setWhatsappLink] = useState(initialData.whatsappLink)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ price, promotionEndDate, whatsappLink })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <Label htmlFor="price" className="text-white">
          Precio de Oferta (USD)
        </Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="3000"
          className="mt-1 bg-black border-zinc-800 text-white"
        />
        <p className="mt-1 text-xs text-zinc-400">Si no se modifica, se mantendrá en 3000 USD.</p>
      </div>

      <div className="mb-6">
        <Label htmlFor="promotionEndDate" className="text-white">
          Fecha Límite de Promoción
        </Label>
        <Input
          id="promotionEndDate"
          type="date"
          value={promotionEndDate}
          onChange={(e) => setPromotionEndDate(e.target.value)}
          className="mt-1 bg-black border-zinc-800 text-white"
        />
        <p className="mt-1 text-xs text-zinc-400">
          Se mostrará un contador en el Slide 10. Dejar en blanco si no hay fecha límite.
        </p>
      </div>

      <div className="mb-6">
        <Label htmlFor="whatsappLink" className="text-white">
          Link de WhatsApp
        </Label>
        <Input
          id="whatsappLink"
          value={whatsappLink}
          onChange={(e) => setWhatsappLink(e.target.value)}
          placeholder="https://wa.me/123456789?text=Hola"
          required
          className="mt-1 bg-black border-zinc-800 text-white"
        />
        <p className="mt-1 text-xs text-zinc-400">Este link se usará en el botón "Reserva tu lugar ahora".</p>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-zinc-700 hover:bg-zinc-800 text-white"
        >
          Atrás
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-neon-green hover:bg-neon-green/90 text-black">
          {isSubmitting ? "Creando..." : "Construir Presentación"}
        </Button>
      </div>
    </form>
  )
}

