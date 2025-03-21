import { Card, CardContent } from "@/components/ui/card"
import { RocketIcon, BarChart3Icon, CreditCardIcon } from "lucide-react"

export default function Slide2() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-12 text-white">
          Tu MVP de Marketplace en <span className="text-neon-green">30 días</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 shadow-[0_0_15px_rgba(0,255,102,0.1)] hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center mb-4 border border-neon-green/30">
                <RocketIcon className="h-8 w-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Validación Rápida</h3>
              <p className="text-sm text-zinc-400 font-light">
                Lanza tu idea al mercado en tiempo récord para validar su potencial
              </p>

              <div className="mt-6 h-32 w-full rounded-lg overflow-hidden flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="100" fill="black" />
                  <path d="M100 20C66.8629 20 40 46.8629 40 80H100V20Z" fill="#212121" />
                  <path d="M100 20C133.137 20 160 46.8629 160 80H100V20Z" fill="#333333" />
                  <path d="M100 80L125 30L150 80H100Z" fill="#00FF66" />
                  <circle cx="75" cy="55" r="15" fill="#00FF66" />
                  <rect
                    x="40"
                    y="20"
                    width="120"
                    height="60"
                    rx="4"
                    stroke="#00FF66"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 shadow-[0_0_15px_rgba(0,255,102,0.1)] hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center mb-4 border border-neon-green/30">
                <BarChart3Icon className="h-8 w-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Tráfico Orgánico</h3>
              <p className="text-sm text-zinc-400 font-light">
                Optimizado para SEO desde el primer día, sin depender de anuncios pagos
              </p>

              <div className="mt-6 h-32 w-full rounded-lg overflow-hidden flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="100" fill="black" />
                  <path d="M30 80L60 50L90 65L120 40L150 20L170 35" stroke="#00FF66" strokeWidth="2" />
                  <path d="M30 80L60 70L90 75L120 55L150 60L170 50" stroke="#555555" strokeWidth="2" />
                  <circle cx="60" cy="50" r="3" fill="#00FF66" />
                  <circle cx="90" cy="65" r="3" fill="#00FF66" />
                  <circle cx="120" cy="40" r="3" fill="#00FF66" />
                  <circle cx="150" cy="20" r="3" fill="#00FF66" />
                  <circle cx="60" cy="70" r="3" fill="#555555" />
                  <circle cx="90" cy="75" r="3" fill="#555555" />
                  <circle cx="120" cy="55" r="3" fill="#555555" />
                  <circle cx="150" cy="60" r="3" fill="#555555" />
                  <text x="170" y="35" fontSize="8" fill="#00FF66" textAnchor="middle">
                    Organic
                  </text>
                  <text x="170" y="50" fontSize="8" fill="#555555" textAnchor="middle">
                    Paid
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 shadow-[0_0_15px_rgba(0,255,102,0.1)] hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center mb-4 border border-neon-green/30">
                <CreditCardIcon className="h-8 w-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Monetización Inmediata</h3>
              <p className="text-sm text-zinc-400 font-light">
                Estrategias de ingresos implementadas desde el lanzamiento
              </p>

              <div className="mt-6 h-32 w-full rounded-lg overflow-hidden flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="100" fill="black" />
                  <rect x="50" y="20" width="100" height="60" rx="4" fill="#212121" stroke="#333333" />
                  <rect x="60" y="30" width="80" height="10" rx="2" fill="#333333" />
                  <rect x="60" y="45" width="80" height="5" rx="2" fill="#333333" />
                  <rect x="60" y="55" width="40" height="5" rx="2" fill="#333333" />
                  <rect x="60" y="65" width="30" height="8" rx="2" fill="#00FF66" />
                  <path d="M160 50L140 30V70L160 50Z" fill="#00FF66" />
                  <circle cx="40" cy="50" r="10" fill="#00FF66" />
                  <path d="M40 45V55M35 50H45" stroke="black" strokeWidth="2" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

