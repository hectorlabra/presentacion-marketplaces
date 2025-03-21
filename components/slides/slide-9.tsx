import { Check, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Slide9() {
  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8 text-white">
              Garantía de Resultados: <span className="text-neon-green">Cero Riesgo</span>, Máxima Seguridad
            </h2>

            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                <Check className="h-5 w-5 text-neon-green" />
              </div>
              <p className="text-base text-zinc-300 font-light tracking-wide">
                <span className="font-medium text-white">
                  Si en 30 días no entregamos tu MVP de Marketplace listo para operar, te reembolsamos el 100% de tu
                  inversión inicial.
                </span>
              </p>
            </div>

            <div className="flex items-start gap-4 mb-8">
              <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                <Check className="h-5 w-5 text-neon-green" />
              </div>
              <p className="text-base text-zinc-300 font-light tracking-wide">
                <span className="font-medium text-white">
                  Garantizamos que tu plataforma estará optimizada para tráfico orgánico y monetización desde el primer
                  día.
                </span>
              </p>
            </div>

            <div className="rounded-xl overflow-hidden mb-8 h-48 relative border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="150" fill="black" />

                {/* Central Shield */}
                <path
                  d="M150 20L200 40V80C200 100 175 120 150 130C125 120 100 100 100 80V40L150 20Z"
                  fill="#00FF66"
                  fillOpacity="0.1"
                  stroke="#00FF66"
                  strokeWidth="2"
                />
                <text x="150" y="70" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
                  GARANTÍA
                </text>
                <text x="150" y="85" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
                  TOTAL
                </text>

                {/* Left Side */}
                <circle cx="50" cy="40" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="50" y="40" textAnchor="middle" fontSize="10" fill="white">
                  Calidad
                </text>
                <line x1="70" y1="40" x2="95" y2="60" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />

                <circle cx="50" cy="110" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="50" y="110" textAnchor="middle" fontSize="10" fill="white">
                  Puntualidad
                </text>
                <line x1="70" y1="110" x2="95" y2="100" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />

                {/* Right Side */}
                <circle cx="250" cy="40" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="250" y="40" textAnchor="middle" fontSize="10" fill="white">
                  Satisfacción
                </text>
                <line x1="230" y1="40" x2="205" y2="60" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />

                <circle cx="250" cy="110" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="250" y="110" textAnchor="middle" fontSize="10" fill="white">
                  Reembolso
                </text>
                <line x1="230" y1="110" x2="205" y2="100" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-xl font-medium mb-6 text-white">¿Por qué podemos ofrecer esta garantía?</h3>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-neon-green font-bold">✓</span>
                <span className="text-base text-zinc-300 font-light tracking-wide">
                  Tecnología de vanguardia (Next.js, Supabase, Vercel) que garantiza una plataforma rápida, segura y
                  escalable desde el primer día.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-green font-bold">✓</span>
                <span className="text-base text-zinc-300 font-light tracking-wide">
                  Nuestra metodología ha sido validada con múltiples marketplaces exitosos en LATAM.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-green font-bold">✓</span>
                <span className="text-base text-zinc-300 font-light tracking-wide">
                  Solo aceptamos 5 proyectos al mes, asegurando calidad y cumplimiento.
                </span>
              </li>
            </ul>

            <Card className="bg-zinc-900 border-zinc-800 max-w-sm mx-auto">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <ShieldCheck className="h-20 w-20 text-neon-green" />
                </div>

                <h3 className="text-xl font-bold text-center mb-4 text-white">Garantía Total</h3>

                <p className="text-sm text-center mb-6 text-zinc-400 font-light tracking-wide">
                  Incluimos contratos de Cumplimiento y Confidencialidad, asegurando calidad y protección de tu negocio.
                </p>

                <div className="bg-black p-4 rounded-lg border border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-zinc-300">Agencias Tradicionales:</span>
                    <span className="text-sm text-zinc-400">$20K-$50K, 6-12 meses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-300">Innovare Marketplaces:</span>
                    <span className="text-sm text-neon-green">MVP en 30 días</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

