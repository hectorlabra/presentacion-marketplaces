"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import { Card, CardContent } from "@/components/ui/card"

interface PresentationFormProps {
  user: any
  initialPresentation?: any
  isEditing?: boolean
}

export default function PresentationForm({ user: propUser, initialPresentation, isEditing = false }: PresentationFormProps) {
  const supabase = createClientComponentClient()
  const { user: authUser, session } = useAuth()
  
  // Usar el usuario del contexto de autenticación si está disponible
  const user = authUser || propUser
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    prospectName: initialPresentation?.prospect_name || "",
    challengeFields: initialPresentation?.challenge_fields || ["", "", "", "", "", ""],
    price: initialPresentation?.price || 3000,
    promotionEndDate: initialPresentation?.promotion_end_date ? new Date(initialPresentation.promotion_end_date).toISOString().split('T')[0] : "",
    whatsappLink: initialPresentation?.whatsapp_link || "",
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

      // Verificar que el usuario esté autenticado
      if (!user || !user.id) {
        console.error('Usuario no autenticado:', { user })
        setError("Usuario no autenticado. Por favor, inicia sesión nuevamente.")
        setIsSubmitting(false)
        return
      }

      // Verificar si tenemos un usuario autenticado a través del contexto
      if (!authUser || !authUser.id) {
        console.error('No hay usuario autenticado en el contexto:', { authUser, propUser: user })
        setError("No hay sesión activa. Por favor, inicia sesión nuevamente.")
        setIsSubmitting(false)
        return
      }

      const userId = authUser.id
      
      console.log('Usuario autenticado detectado:', { 
        email: authUser.email,
        id: authUser.id,
        session: !!session
      })
      
      // Verificar que tenemos un userId válido
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario:', { session, user })
        throw new Error('No se pudo obtener el ID del usuario')
      }
      
      console.log('ID del usuario autenticado:', userId)
      
      let result;
      
      // Verificar la estructura de la tabla
      const { data: tableInfo, error: tableError } = await supabase
        .from('presentations')
        .select('*')
        .limit(1);
      
      if (tableError) {
        console.error('Error verificando estructura de tabla:', tableError);
        throw new Error('Error al verificar la estructura de la tabla');
      }
      
      // Determinar si debemos usar el campo 'content' o campos individuales
      const hasContentColumn = tableInfo && tableInfo.length > 0 && 'content' in tableInfo[0];
      console.log('Estructura de la tabla:', tableInfo);
      console.log('¿Tiene columna content?:', hasContentColumn);
      
      if (isEditing && initialPresentation?.id) {
        // Actualizar presentación existente
        let updateData;
        
        if (hasContentColumn) {
          updateData = {
            title: formData.prospectName,
            content: {
              prospect_name: formData.prospectName,
              challenge_fields: formData.challengeFields,
              price: data.price,
              promotion_end_date: data.promotionEndDate ? new Date(data.promotionEndDate).toISOString() : null,
              whatsapp_link: data.whatsappLink
            },
            status: 'published',
            updated_at: new Date().toISOString()
          };
        } else {
          // Usar campos individuales si no hay columna 'content'
          updateData = {
            title: formData.prospectName,
            prospect_name: formData.prospectName,
            challenge_fields: formData.challengeFields,
            price: data.price,
            promotion_end_date: data.promotionEndDate ? new Date(data.promotionEndDate).toISOString() : null,
            whatsapp_link: data.whatsappLink,
            status: 'published',
            updated_at: new Date().toISOString()
          };
        }
        
        const { data: updatedData, error } = await supabase
          .from('presentations')
          .update(updateData)
          .eq('id', initialPresentation.id)
          .select()
          .single();
          
        if (error) {
          console.error('Error actualizando presentación:', error);
          throw error;
        }
        result = updatedData;
        setSuccess(`¡Presentación actualizada con éxito!`);
      } else {
        // Crear nueva presentación
        let insertData;
        
        if (hasContentColumn) {
          insertData = {
            title: formData.prospectName,
            content: {
              prospect_name: formData.prospectName,
              challenge_fields: formData.challengeFields,
              price: data.price,
              promotion_end_date: data.promotionEndDate ? new Date(data.promotionEndDate).toISOString() : null,
              whatsapp_link: data.whatsappLink,
              slug: slug
            },
            status: 'published',
            url: `/${slug}`,
            user_id: authUser.id
          };
        } else {
          // Usar campos individuales si no hay columna 'content'
          insertData = {
            title: formData.prospectName,
            prospect_name: formData.prospectName,
            challenge_fields: formData.challengeFields,
            price: data.price,
            promotion_end_date: data.promotionEndDate ? new Date(data.promotionEndDate).toISOString() : null,
            whatsapp_link: data.whatsappLink,
            slug: slug,
            status: 'published',
            url: `/${slug}`,
            user_id: authUser.id
          };
        }
        
        // Usar el usuario autenticado del contexto
        if (!authUser || !authUser.id) {
          console.error('No hay usuario autenticado al intentar crear la presentación')
          throw new Error("No se pudo obtener el ID de usuario. Por favor, inicia sesión nuevamente.")
        }

        // Usar el ID del usuario del contexto de autenticación
        const currentUserId = authUser.id
        
        // Actualizar el user_id con el de la sesión actual
        insertData.user_id = currentUserId;
        
        console.log('Datos a insertar:', { ...insertData, user_id: currentUserId });
        
        const { data: insertedData, error } = await supabase
          .from('presentations')
          .insert(insertData)
          .select()
          .single();
          
        if (error) {
          const errorMessage = error.message || 'Error desconocido';
          console.error('Error creando presentación:', { 
            error: errorMessage,
            code: error.code,
            details: error.details,
            hint: error.hint,
            userId: currentUserId 
          });
          throw error;
        }
        result = insertedData;
        setSuccess(`¡Presentación creada con éxito!`);
      }

      const url = `${window.location.origin}${result.url || `/${slug}`}`;
      setPresentationUrl(url);
      setIsSubmitting(false);
    } catch (err: any) {
      if (err.code === '42501') {
        setError("Error de permisos: Verifica que estés autenticado correctamente.")
      } else {
        setError(err.message || "Error al crear la presentación")
      }
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
        <h2 className="mb-6 text-2xl font-bold text-white">
          {isEditing ? 'Editar Presentación' : 'Crear Nueva Presentación'}
        </h2>

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
                {isEditing ? 'Crear Otra' : 'Crear Nueva'}
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

