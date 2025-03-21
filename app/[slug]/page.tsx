import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import DynamicPresentation from "@/components/dynamic-presentation"

export const revalidate = 0 // No cache

export default async function PresentationPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Obtener datos de la presentación
  const { data: presentation } = await supabase.from("presentations").select("*").eq("slug", params.slug).single()

  if (!presentation) {
    notFound()
  }

  return <DynamicPresentation presentationData={presentation} />
}

