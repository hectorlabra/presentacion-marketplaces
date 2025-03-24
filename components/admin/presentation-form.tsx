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
    // Logging detallado para depurar
    console.log('Datos recibidos en handleStepTwoSubmit:', JSON.stringify(data, null, 2));
    console.log('Estado actual de formData:', JSON.stringify(formData, null, 2));
    
    // Necesitamos crear un objeto combinado con los datos actualizados
    // No podemos depender de formData porque el estado podría no estar actualizado
    const updatedFormData = {
      ...formData,
      ...data
    }
    
    console.log('Datos combinados:', JSON.stringify(updatedFormData, null, 2));
    
    // Actualizamos el estado para mantenerlo sincronizado
    setFormData(updatedFormData)

    try {
      setIsSubmitting(true)
      setError("")

      // Validar todos los campos obligatorios
      const validationErrors = [];
      
      // Verificar nombre de prospecto
      if (!updatedFormData.prospectName || updatedFormData.prospectName.trim() === '') {
        console.error('Nombre de prospecto vacío o inválido:', { prospectName: updatedFormData.prospectName })
        validationErrors.push("El nombre del prospecto no puede estar vacío");
      }
      
      // Verificar challenge_fields
      if (!updatedFormData.challengeFields || !Array.isArray(updatedFormData.challengeFields)) {
        console.error('Challenge fields inválido:', { challengeFields: updatedFormData.challengeFields })
        validationErrors.push("Los campos de desafíos son inválidos");
      } else {
        // Asegurarse de que al menos el primer campo no esté vacío
        if (updatedFormData.challengeFields.length === 0 || !updatedFormData.challengeFields[0]) {
          console.error('Al menos el primer desafío es obligatorio')
          validationErrors.push("Al menos el primer campo de desafío es obligatorio");
        }
      }
      
      // Verificar precio
      if (data.price === undefined || data.price === null || isNaN(Number(data.price))) {
        console.error('Precio inválido:', { price: data.price })
        validationErrors.push("El precio es obligatorio y debe ser un número válido");
      }
      
      // Verificar whatsapp_link - si está vacío, asignar un valor predeterminado
      if (!data.whatsappLink) {
        console.warn('Enlace de WhatsApp vacío, usando valor predeterminado')
        // No lo tratamos como error, simplemente usaremos un valor predeterminado
        data.whatsappLink = "https://wa.me/";
      }
      
      // Si hay errores de validación, mostrarlos y detener el envío
      if (validationErrors.length > 0) {
        setError(validationErrors.join('\n'));
        setIsSubmitting(false);
        return;
      }
      
      // Ya hemos preparado los datos limpios arriba
      
      // Preparar datos limpios para todos los campos
      const cleanProspectName = (updatedFormData.prospectName || "").trim();
      
      // Asegurarnos de que challenge_fields sea un array válido
      // y reemplazar cualquier valor nulo o undefined con cadena vacía
      const cleanChallengeFields = (updatedFormData.challengeFields || []).map((field: string | null | undefined) => 
        field === null || field === undefined ? "" : String(field).trim()
      );
      
      // Si no hay suficientes elementos, rellenar con strings vacíos hasta tener 6
      while (cleanChallengeFields.length < 6) {
        cleanChallengeFields.push("");
      }
      
      // Asegurar que el precio sea un número válido
      const cleanPrice = Number(data.price) || 0;
      
      // Asegurar que el enlace de WhatsApp no sea nulo
      // Verificar explícitamente si el valor es undefined o null
      let cleanWhatsappLink = "https://wa.me/";
      if (data.whatsappLink !== undefined && data.whatsappLink !== null && data.whatsappLink !== "") {
        cleanWhatsappLink = data.whatsappLink;
      }
      console.log('WhatsApp Link después de limpieza:', cleanWhatsappLink);
      
      // Asegurar que la fecha de promoción sea válida o null
      const cleanPromotionEndDate = data.promotionEndDate ? new Date(data.promotionEndDate).toISOString() : null;

      // Generar slug a partir del nombre del prospecto limpio
      const slug = cleanProspectName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      
      // Verificar que el slug no esté vacío
      if (!slug) {
        console.error('Slug generado está vacío', { prospectName: updatedFormData.prospectName })
        setError("No se pudo generar un identificador válido a partir del nombre. Por favor, usa un nombre diferente.")
        setIsSubmitting(false)
        return
      }
      
      console.log('Slug generado:', slug)

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
          // Asegurarnos de que whatsapp_link tenga un valor no nulo
          const safeWhatsappLink = data.whatsappLink || "https://wa.me/";
          
          insertData = {
            title: cleanProspectName,
            prospect_name: cleanProspectName, // Asegurarse de tener prospect_name a nivel de raíz
            challenge_fields: cleanChallengeFields, // Usar la versión limpia y validada
            whatsapp_link: safeWhatsappLink, // Colocar a nivel raíz también
            content: {
              prospect_name: cleanProspectName,
              challenge_fields: cleanChallengeFields, // Usar la versión limpia y validada
              price: cleanPrice, // Usar el valor limpio
              promotion_end_date: cleanPromotionEndDate, // Usar el valor limpio
              whatsapp_link: safeWhatsappLink, // Usar el valor limpio
              slug: slug
            },
            slug: slug, // Añadir slug a nivel de raíz también
            status: 'published',
            url: `/${slug}`,
            user_id: authUser.id,
            created_at: new Date().toISOString() // Añadir timestamp de creación
          };
          
          console.log('Datos a insertar (hasContentColumn):', JSON.stringify(insertData, null, 2));
        } else {
          // Usar campos individuales si no hay columna 'content'
          // Asegurarnos de que whatsapp_link tenga un valor no nulo
          const safeWhatsappLink = data.whatsappLink || "https://wa.me/";
          
          insertData = {
            title: cleanProspectName,
            prospect_name: cleanProspectName, // Asegurarse de que no sea nulo o vacío
            challenge_fields: cleanChallengeFields, // Usar la versión limpia y validada
            price: cleanPrice, // Usar el valor limpio
            promotion_end_date: cleanPromotionEndDate, // Usar el valor limpio
            whatsapp_link: safeWhatsappLink, // Usar el valor limpio
            slug: slug, // Asegurar que el slug está presente
            status: 'published',
            url: `/${slug}`,
            user_id: authUser.id,
            created_at: new Date().toISOString() // Añadir timestamp de creación
          };
          
          console.log('Datos a insertar (no hasContentColumn):', JSON.stringify(insertData, null, 2));
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
        
        console.log('Datos a insertar (resumen):', { 
          ...insertData, 
          user_id: currentUserId,
          hasSlug: !!insertData.slug,
          slugValue: insertData.slug,
          hasProspectName: !!insertData.prospect_name,
          prospectNameValue: insertData.prospect_name,
          hasWhatsappLink: !!insertData.whatsapp_link,
          whatsappLinkValue: insertData.whatsapp_link,
          hasChallengeFields: !!insertData.challenge_fields,
          challengeFieldsLength: insertData.challenge_fields ? insertData.challenge_fields.length : 0
        });
        
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
            userId: currentUserId,
            hasSlug: !!insertData.slug,
            slugLength: insertData.slug ? insertData.slug.length : 0
          });
          
          // Manejar error específico de slug nulo
          if (error.message?.includes('violates not-null constraint') && error.message?.includes('slug')) {
            setError("No se pudo generar un identificador válido para la presentación. El nombre debe contener caracteres válidos.")
            setIsSubmitting(false)
            return
          }
          
          throw error;
        }
        result = insertedData;
        setSuccess(`¡Presentación creada con éxito!`);
      }

      const url = `${window.location.origin}${result.url || `/${slug}`}`;
      setPresentationUrl(url);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error('Error detallado:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      })
      
      if (err.code === '42501') {
        setError("Error de permisos: Verifica que estés autenticado correctamente.")
      } else if (err.message?.includes('violates not-null constraint') && err.message?.includes('slug')) {
        setError("No se pudo generar un identificador válido para la presentación. El nombre debe contener caracteres alfanuméricos.")
      } else if (err.code === '23502') { // Código para violación de restricción NOT NULL
        setError(`Error: Falta un campo obligatorio. Detalles: ${err.message || 'Valor no proporcionado para campo requerido'}`)
      } else if (err.code === '23505') { // Código para violación de restricción UNIQUE
        setError(`Error: Ya existe una presentación con ese identificador. Por favor, use un nombre diferente.`)
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

