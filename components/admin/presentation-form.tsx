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
  // Función para formatear correctamente la fecha para el input
  const formatPromotionDate = (dateValue: string | null | undefined): string => {
    if (!dateValue) return "";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        console.error('Fecha de promoción inválida en initialPresentation:', dateValue);
        return "";
      }
      
      // Convertir a formato YYYY-MM-DD para el input date
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error al formatear fecha de promoción:', e);
      return "";
    }
  };
  
  // Mostrar en consola para depuración
  console.log('Datos de initialPresentation:', { 
    promotion_end_date: initialPresentation?.promotion_end_date,
    type: initialPresentation?.promotion_end_date ? typeof initialPresentation.promotion_end_date : 'undefined/null'
  });
  
  const formattedPromotionDate = formatPromotionDate(initialPresentation?.promotion_end_date);
  console.log('Fecha formateada para el input:', formattedPromotionDate);
  
  const [formData, setFormData] = useState({
    prospectName: initialPresentation?.prospect_name || "",
    challengeFields: initialPresentation?.challenge_fields || ["", "", "", "", "", ""],
    price: initialPresentation?.price || 3000,
    promotionEndDate: formattedPromotionDate,
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
      
      // Verificar fecha de promoción
      if (data.promotionEndDate) {
        // Validar que la fecha sea futura
        const promotionDate = new Date(data.promotionEndDate);
        const today = new Date();
        if (promotionDate <= today) {
          console.warn('La fecha de promoción debe ser futura, ajustando a mañana');
          // Establecer la fecha para mañana
          today.setDate(today.getDate() + 1);
          data.promotionEndDate = today.toISOString().split('T')[0];
        }
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
      // Debemos asegurarnos de que la fecha se guarde correctamente para que el contador funcione
      let cleanPromotionEndDate = null;
      console.log('Procesando fecha de promoción:', {
        rawValue: data.promotionEndDate,
        type: typeof data.promotionEndDate
      });
      
      if (data.promotionEndDate && data.promotionEndDate.trim() !== '') {
        try {
          console.log('La fecha de promoción no está vacía, procesando...');
          
          // Convertir la fecha a objeto Date y asegurarnos de que sea el final del día
          let promotionDate: Date;
          
          // Manejar diferentes formatos de fecha
          if (data.promotionEndDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Formato YYYY-MM-DD (desde input date)
            promotionDate = new Date(data.promotionEndDate + 'T00:00:00');
            console.log('Fecha en formato YYYY-MM-DD:', promotionDate);
          } else {
            // Intentar parsear como ISO o cualquier otro formato
            promotionDate = new Date(data.promotionEndDate);
            console.log('Fecha parseada de formato alternativo:', promotionDate);
          }
          
          // Verificar que la fecha sea válida
          if (isNaN(promotionDate.getTime())) {
            console.error('Fecha de promoción inválida:', data.promotionEndDate);
            setError('La fecha de promoción no es válida');
            throw new Error('La fecha de promoción no es válida');
          }
          
          // Verificar que la fecha sea futura
          const now = new Date();
          if (promotionDate <= now) {
            console.warn('La fecha de promoción debe ser futura, ajustando a mañana');
            // Establecer la fecha para mañana
            now.setDate(now.getDate() + 1);
            promotionDate = new Date(now);
          }
          
          // Establecer al final del día para maximizar el tiempo
          promotionDate.setHours(23, 59, 59, 999);
          
          // Guardar como string ISO
          cleanPromotionEndDate = promotionDate.toISOString();
          console.log('Fecha de promoción formateada correctamente:', {
            original: data.promotionEndDate,
            formateada: cleanPromotionEndDate,
            objeto: promotionDate
          });
        } catch (e) {
          console.error('Error procesando fecha de promoción:', e);
          cleanPromotionEndDate = null;
        }
      } else {
        console.log('No se proporcionó fecha de promoción');
        cleanPromotionEndDate = null;
      }

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
      
      // Analizar estructura detallada
      console.log('Datos de la tabla presentations:', JSON.stringify(tableInfo, null, 2));
      
      // Verificar si hay columnas específicas
      const columnsPresent = tableInfo && tableInfo.length > 0
        ? Object.keys(tableInfo[0]).reduce((acc: Record<string, boolean>, key: string) => {
            acc[key] = true;
            return acc;
          }, {})
        : {};
      
      console.log('Columnas presentes en la tabla:', columnsPresent);
      console.log('¿Existe columna promotion_end_date?', columnsPresent['promotion_end_date'] ? 'SÍ' : 'NO');

      // Determinar si debemos usar el campo 'content' o campos individuales
      const hasContentColumn = tableInfo && tableInfo.length > 0 && 'content' in tableInfo[0];
      console.log('¿Tiene columna content?:', hasContentColumn);
      
      // Verificar tipo de datos de promotion_end_date si existe
      if (tableInfo && tableInfo.length > 0 && 'promotion_end_date' in tableInfo[0]) {
        console.log('Tipo de promotion_end_date:', typeof tableInfo[0].promotion_end_date);
        console.log('Valor ejemplo de promotion_end_date:', tableInfo[0].promotion_end_date);
      }
      
      if (isEditing && initialPresentation?.id) {
        // Actualizar presentación existente
        let updateData;
        
        // IMPORTANTE: Guardar siempre en columnas directas, no en content
        updateData = {
          title: formData.prospectName,
          prospect_name: formData.prospectName,
          challenge_fields: formData.challengeFields,
          price: data.price,
          promotion_end_date: cleanPromotionEndDate,
          whatsapp_link: data.whatsappLink
        };
        
        console.log('Actualizando presentación con datos:', {
          ...updateData,
          promotion_end_date_value: cleanPromotionEndDate,
          promotion_end_date_type: typeof cleanPromotionEndDate
        });
        
        console.log('Enviando datos a Supabase para actualización...');
        const { data: updatedData, error } = await supabase
          .from('presentations')
          .update(updateData)
          .eq('id', initialPresentation.id)
          .select()
          .single();
          
        if (error) {
          console.error('Error actualizando presentación:', error);
          console.error('Detalles del error de actualización:', { 
            error_code: error.code,
            error_details: error.details,
            error_hint: error.hint,
            data_sent: updateData
          });
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

      // Ver la presentación creada/actualizada
      console.log('Recuperando presentación guardada para verificar datos...');
      const { data: savedPresentation, error: fetchError } = await supabase
        .from('presentations')
        .select('*')
        .eq('id', isEditing ? initialPresentation.id : result.id)
        .single();
        
      if (fetchError) {
        console.error('Error al recuperar presentación guardada:', fetchError);
      } else {
        console.log('Presentación recuperada de la BD:', JSON.stringify(savedPresentation, null, 2));
        console.log('Verificando promotion_end_date guardado:', {
          valor: savedPresentation.promotion_end_date,
          tipo: typeof savedPresentation.promotion_end_date,
          esNull: savedPresentation.promotion_end_date === null
        });
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
