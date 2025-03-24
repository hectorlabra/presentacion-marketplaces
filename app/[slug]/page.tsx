import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import DynamicPresentation from "@/components/dynamic-presentation"

export const revalidate = 0 // No cache

export default async function PresentationPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Obtener datos de la presentación
  const { data: presentation, error } = await supabase
    .from("presentations")
    .select("*")
    .eq("slug", params.slug)
    .single()
    
  // Depurar la estructura de la tabla
  const { data: tableInfo, error: tableError } = await supabase
    .from('presentations')
    .select('*')
    .limit(1)
  
  if (tableError) {
    console.error('Error al obtener información de la tabla:', tableError)
  } else {
    console.log('Estructura de la tabla presentations:', {
      columnasDisponibles: tableInfo && tableInfo[0] ? Object.keys(tableInfo[0]) : [],
      tiposDatos: tableInfo && tableInfo[0] ? Object.entries(tableInfo[0]).reduce((acc, [key, value]) => {
        acc[key] = typeof value
        return acc
      }, {} as Record<string, string>) : {}
    })
  }

  if (error) {
    console.error('Error al obtener la presentación:', error);
    notFound();
  }

  if (!presentation) {
    console.error('No se encontró la presentación con slug:', params.slug);
    notFound();
  }
  
  // Asegurarse de que la fecha de promoción esté en formato correcto
  if (presentation.promotion_end_date) {
    console.log('Fecha de promoción original:', presentation.promotion_end_date);
    // Asegurarse de que sea un string ISO
    if (typeof presentation.promotion_end_date === 'string') {
      try {
        // Validar que la fecha sea futura
        const promotionDate = new Date(presentation.promotion_end_date);
        const now = new Date();
        
        if (isNaN(promotionDate.getTime())) {
          console.error('La fecha de promoción no es válida:', presentation.promotion_end_date);
          presentation.promotion_end_date = null;
        } else if (promotionDate <= now) {
          console.log('La fecha de promoción ya pasó, estableciendo a null');
          presentation.promotion_end_date = null;
        } else {
          console.log('Fecha de promoción válida y futura:', promotionDate.toISOString());
        }
      } catch (e) {
        console.error('Error al procesar la fecha de promoción:', e);
        presentation.promotion_end_date = null;
      }
    } else {
      console.error('La fecha de promoción no es un string:', typeof presentation.promotion_end_date);
      presentation.promotion_end_date = null;
    }
  } else {
    console.log('No hay fecha de promoción definida para esta presentación');
  }

  // Depurar datos antes de pasarlos al componente
  console.log('Datos de presentación pasados a DynamicPresentation:', {
    id: presentation.id,
    slug: presentation.slug,
    prospect_name: presentation.prospect_name,
    promotion_end_date: presentation.promotion_end_date,
    whatsapp_link: presentation.whatsapp_link,
    price: presentation.price,
    datosCompletos: presentation,
    tiposDatos: {
      id: typeof presentation.id,
      slug: typeof presentation.slug,
      prospect_name: typeof presentation.prospect_name,
      promotion_end_date: typeof presentation.promotion_end_date,
      whatsapp_link: typeof presentation.whatsapp_link,
      price: typeof presentation.price,
      content: presentation.content ? 'presente' : 'ausente'
    }
  });
  
  return <DynamicPresentation presentationData={presentation} />
}

