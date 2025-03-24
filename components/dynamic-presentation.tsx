"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import Slide1 from "@/components/slides/slide-1"
import Slide2 from "@/components/slides/slide-2"
import Slide3 from "@/components/slides/slide-3"
import Slide4 from "@/components/slides/slide-4"
import Slide5 from "@/components/slides/slide-5"
import Slide6 from "@/components/slides/slide-6"
import Slide7 from "@/components/slides/slide-7"
import Slide8 from "@/components/slides/slide-8"
import Slide9 from "@/components/slides/slide-9"
import Slide10 from "@/components/slides/slide-10"
import Logo from "@/components/logo"

interface PresentationData {
  prospect_name: string
  challenge_fields: string[]
  price: number
  promotion_end_date: string | null
  whatsapp_link: string
}

export default function DynamicPresentation({ presentationData }: { presentationData: PresentationData }) {
  // Depurar datos de presentación
  console.log('Datos de presentación recibidos:', {
    prospect_name: presentationData.prospect_name,
    price: presentationData.price,
    promotion_end_date: presentationData.promotion_end_date,
    whatsapp_link: presentationData.whatsapp_link,
    challenge_fields: presentationData.challenge_fields
  });
  
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    <Slide1 key="slide-1" />,
    <Slide2 key="slide-2" />,
    <Slide3 key="slide-3" challengeFields={presentationData.challenge_fields} />,
    <Slide4 key="slide-4" />,
    <Slide5 key="slide-5" />,
    <Slide6 key="slide-6" />,
    <Slide7 key="slide-7" />,
    <Slide8 key="slide-8" />,
    <Slide9 key="slide-9" />,
    <Slide10
      key="slide-10"
      price={presentationData.price}
      promotionEndDate={presentationData.promotion_end_date}
      whatsappLink={presentationData.whatsapp_link}
    />,
  ]

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextSlide()
      } else if (e.key === "ArrowLeft") {
        goToPrevSlide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentSlide])

  const progress = ((currentSlide + 1) / slides.length) * 100

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Logo className="h-8 w-auto" />
          <div className="text-sm text-zinc-400 font-light tracking-wide">
            {/* Presentación para: {presentationData.prospect_name} */}
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-black rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {slides[currentSlide]}

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-50">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevSlide}
                  disabled={currentSlide === 0}
                  className="rounded-full bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 border-none text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-xs text-zinc-400 font-light tracking-wider">
                  {currentSlide + 1} / {slides.length}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="rounded-full bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 border-none text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4">
          <Progress value={progress} className="h-1 bg-zinc-800" indicatorClassName="bg-neon-green" />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "w-8 h-8 p-0 rounded-full",
                currentSlide === index ? "bg-neon-green text-black" : "bg-zinc-900 hover:bg-zinc-800 text-white",
              )}
              onClick={() => setCurrentSlide(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

