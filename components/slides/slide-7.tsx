import { Check } from "lucide-react"

export default function Slide7() {
  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8 text-white">
          ¿Cómo logramos entregar un MVP en <span className="text-neon-green">30 días</span>?
        </h2>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <p className="text-base mb-8 text-zinc-300 font-light tracking-wide">
              Utilizamos un stack tecnológico de alto rendimiento para garantizar que tu marketplace sea rápido, seguro
              y escalable desde el primer día.
            </p>

            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                  <Check className="h-5 w-5 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">Velocidad y Optimización</h3>
                  <p className="text-sm text-zinc-400 font-light tracking-wide">
                    Cargas ultrarrápidas y máxima eficiencia en todos los dispositivos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                  <Check className="h-5 w-5 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">Seguridad y Escalabilidad</h3>
                  <p className="text-sm text-zinc-400 font-light tracking-wide">
                    Infraestructura preparada para crecimiento sin límites.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                  <Check className="h-5 w-5 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">SEO y Tráfico Orgánico</h3>
                  <p className="text-sm text-zinc-400 font-light tracking-wide">
                    Optimización avanzada para atraer usuarios sin depender de anuncios pagos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden mb-8 h-64 relative border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="black" />

                {/* Tech Stack Visualization */}
                <rect x="100" y="20" width="200" height="30" rx="4" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="200" y="40" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">
                  FRONTEND
                </text>

                <rect x="100" y="200" width="200" height="30" rx="4" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="200" y="220" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">
                  BACKEND
                </text>

                <rect x="30" y="110" width="100" height="30" rx="4" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="80" y="130" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">
                  DATABASE
                </text>

                <rect x="270" y="110" width="100" height="30" rx="4" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                <text x="320" y="130" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">
                  DEPLOYMENT
                </text>

                {/* Tech Icons */}
                <circle cx="140" cy="80" r="15" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                <text x="140" y="84" fontSize="10" fill="white" textAnchor="middle">
                  React
                </text>

                <circle cx="200" cy="80" r="15" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                <text x="200" y="84" fontSize="10" fill="white" textAnchor="middle">
                  Next.js
                </text>

                <circle cx="260" cy="80" r="15" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                <text x="260" y="84" fontSize="9" fill="white" textAnchor="middle">
                  Tailwind
                </text>

                <circle cx="140" cy="160" r="15" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                <text x="140" y="164" fontSize="9" fill="white" textAnchor="middle">
                  Node.js
                </text>

                <circle cx="200" cy="160" r="15" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                <text x="200" y="164" fontSize="9" fill="white" textAnchor="middle">
                  API
                </text>

                <circle cx="260" cy="160" r="15" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                <text x="260" y="164" fontSize="9" fill="white" textAnchor="middle">
                  Auth
                </text>

                {/* Connections */}
                <path d="M100 35 L80 35 L80 110" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M300 35 L320 35 L320 110" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M100 215 L80 215 L80 140" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M300 215 L320 215 L320 140" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M130 110 L130 50" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M200 50 L200 110" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M270 110 L270 50" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M130 140 L130 200" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M200 140 L200 200" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M270 140 L270 200" stroke="#00FF66" strokeWidth="1" strokeDasharray="4 2" />
              </svg>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="font-medium mb-4 text-white">Tecnologías que usamos:</h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-black px-4 py-2 rounded-full text-sm text-neon-green border border-neon-green/30">
                  Next.js
                </span>
                <span className="bg-black px-4 py-2 rounded-full text-sm text-neon-green border border-neon-green/30">
                  Supabase
                </span>
                <span className="bg-black px-4 py-2 rounded-full text-sm text-neon-green border border-neon-green/30">
                  Vercel
                </span>
                <span className="bg-black px-4 py-2 rounded-full text-sm text-neon-green border border-neon-green/30">
                  TypeScript
                </span>
                <span className="bg-black px-4 py-2 rounded-full text-sm text-neon-green border border-neon-green/30">
                  TailwindCSS
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-center text-zinc-400 mt-8 font-light">
          Un marketplace potente necesita la mejor tecnología. Trabajamos con herramientas de vanguardia para asegurar
          el éxito de tu plataforma.
        </p>
      </div>
    </div>
  )
}

