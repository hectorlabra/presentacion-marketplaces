"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StepOneProps {
  onSubmit: (data: { prospectName: string; challengeFields: string[] }) => void
  initialData: {
    prospectName: string
    challengeFields: string[]
  }
}

export default function StepOne({ onSubmit, initialData }: StepOneProps) {
  const [prospectName, setProspectName] = useState(initialData.prospectName)
  const [challengeFields, setChallengeFields] = useState(initialData.challengeFields)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ prospectName, challengeFields })
  }

  const handleChallengeFieldChange = (index: number, value: string) => {
    const newFields = [...challengeFields]
    newFields[index] = value
    setChallengeFields(newFields)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <Label htmlFor="prospectName" className="text-white">
          Nombre del Prospecto
        </Label>
        <Input
          id="prospectName"
          value={prospectName}
          onChange={(e) => setProspectName(e.target.value)}
          placeholder="Ej: Federico Gamboa"
          required
          className="mt-1 bg-black border-zinc-800 text-white"
        />
        <p className="mt-1 text-xs text-zinc-400">Este nombre se usará para generar la URL de la presentación.</p>
      </div>

      <div className="mb-6">
        <Label className="text-white">Desafíos Clave (Slide 3)</Label>
        <p className="mb-2 text-xs text-zinc-400">Estos campos se mostrarán en el Slide 3 bajo "Desafíos Clave".</p>

        {challengeFields.map((field, index) => (
          <div key={index} className="mb-2">
            <Input
              value={field}
              onChange={(e) => handleChallengeFieldChange(index, e.target.value)}
              placeholder={`Desafío ${index + 1}`}
              className="mt-1 bg-black border-zinc-800 text-white"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-neon-green hover:bg-neon-green/90 text-black">
          Siguiente
        </Button>
      </div>
    </form>
  )
}

