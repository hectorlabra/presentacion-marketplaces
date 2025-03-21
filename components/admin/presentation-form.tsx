"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import { Card, CardContent } from "@/components/ui/card"

export default function PresentationForm({ user }: { user: any }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    prospectName: "",
    challengeFields: ["", "", "", "", "", ""],
    price: 3000,
    promotionEndDate: "",
    whatsappLink: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [presentationUrl, setPresentationUrl] = useState("")

  const handleStepOneSubmit = (data: { prospectName: string; challengeFields: string[] }) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStepTwoSubmit = async (data: { price: number; promotionEndDate: string; whatsappLink: string }) => {
    setFormData((prev) => ({ ...prev, ...data }))

    // Crear la presentación
    try {
      setIsSubmitting(true)
      setError("")

      // Generar slug a partir del nombre del prospecto
      const slug = formData.prospectName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      const { error } = await supabase.from("presentations").insert({
        slug,
        prospect_name: formData.prospectName,
        challenge_fields: formData.challengeFields,
        price: data.price,
        promotion_end_date: data.promotionEndDate ? new Date(data.promotionEndDate).toISOString() : null,
        whatsapp_link: data.whatsappLink,
        created_by: user.id,
      })

      if (error) throw error

      const url = `${window.location.origin}/${slug}`
      setPresentationUrl(url)
      setSuccess(`¡Presentación creada con éxito!`)
      setIsSubmitting(false)
    } catch (err: any) {
      setError(err.message || "Error al crear la presentación")
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleReset = () => {
    setFormData({
      prospectName: "",
      challengeFields: ["", "", "", "", "", ""],
      price: 3000,
      promotionEndDate: "",
      whatsappLink: "",
    })
    setStep(1)
    setSuccess("")
    setError("")
    setPresentationUrl("")
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardContent className="p-6 md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Crear Nueva Presentación</h2>

        {error && <div className="mb-6 rounded-md bg-red-500/10 p-4 text-red-500">{error}</div>}

        {success && (
          <div className="mb-6 rounded-md bg-neon-green/10 p-4">
            <p className="mb-2 text-neon-green">{success}</p>
            <p className="mb-4 text-sm text-zinc-300">URL de la presentación:</p>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={presentationUrl}
                readOnly
                className="w-full rounded-md bg-black p-2 text-white border border-zinc-800"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(presentationUrl)
                }}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                Copiar
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(presentationUrl, "_blank")}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                Ver Presentación
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleReset}
                className="bg-neon-green hover:bg-neon-green/90 text-black"
              >
                Crear Nueva
              </Button>
            </div>
          </div>
        )}

        {!success && (
          <>
            {step === 1 ? (
              <StepOne onSubmit={handleStepOneSubmit} initialData={formData} />
            ) : (
              <StepTwo
                onSubmit={handleStepTwoSubmit}
                onBack={handleBack}
                initialData={formData}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

