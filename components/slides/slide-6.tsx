import { Card, CardContent } from "@/components/ui/card"

export default function Slide6() {
  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8 text-white text-center">
          Fases del Proyecto – De la Idea al <span className="text-neon-green">Lanzamiento</span> en 30 Días
        </h2>

        <div className="flex flex-col md:flex-row gap-12 mb-8">
          <div className="md:w-1/3">
            <div className="rounded-xl overflow-hidden h-64 relative border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill="black" />

                {/* Timeline */}
                <path d="M30 100 L270 100" stroke="#333333" strokeWidth="4" />

                {/* Week 1 */}
                <circle cx="60" cy="100" r="10" fill="#00FF66" />
                <text x="60" y="85" fontSize="12" fill="white" textAnchor="middle">
                  Semana 1
                </text>
                <text x="60" y="125" fontSize="10" fill="#00FF66" textAnchor="middle">
                  Definición
                </text>

                {/* Week 2 */}
                <circle cx="120" cy="100" r="10" fill="#00FF66" />
                <text x="120" y="85" fontSize="12" fill="white" textAnchor="middle">
                  Semana 2
                </text>
                <text x="120" y="125" fontSize="10" fill="#00FF66" textAnchor="middle">
                  Desarrollo
                </text>

                {/* Week 3 */}
                <circle cx="180" cy="100" r="10" fill="#00FF66" />
                <text x="180" y="85" fontSize="12" fill="white" textAnchor="middle">
                  Semana 3
                </text>
                <text x="180" y="125" fontSize="10" fill="#00FF66" textAnchor="middle">
                  SEO
                </text>

                {/* Week 4 */}
                <circle cx="240" cy="100" r="10" fill="#00FF66" />
                <text x="240" y="85" fontSize="12" fill="white" textAnchor="middle">
                  Semana 4
                </text>
                <text x="240" y="125" fontSize="10" fill="#00FF66" textAnchor="middle">
                  Lanzamiento
                </text>

                {/* Progress */}
                <path d="M30 100 L240 100" stroke="#00FF66" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M30 150 L50 150" stroke="#00FF66" strokeWidth="2" />
                <text x="55" y="150" fontSize="8" fill="white" dominantBaseline="middle">
                  Progreso
                </text>

                {/* Progress Bar */}
                <rect x="30" y="170" width="240" height="10" rx="5" fill="#222222" />
                <rect x="30" y="170" width="240" height="10" rx="5" fill="#00FF66" fillOpacity="0.2" />
                <rect
                  x="30"
                  y="170"
                  width="240"
                  height="10"
                  rx="5"
                  stroke="#00FF66"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <rect x="30" y="170" width="240" height="10" rx="5" fill="url(#progressGradient)" />

                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#00FF66" />
                    <stop offset="1" stopColor="#00FF66" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="mt-8 hidden md:block">
              <svg width="100%" height="80" viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 40 L280 40" stroke="#333333" strokeWidth="2" />
                <circle cx="20" cy="40" r="8" fill="#00FF66" />
                <circle cx="100" cy="40" r="8" fill="#00FF66" />
                <circle cx="180" cy="40" r="8" fill="#00FF66" />
                <circle cx="280" cy="40" r="8" fill="#00FF66" />
                <text x="20" y="65" fontSize="10" fill="white" textAnchor="middle">
                  Semana 1
                </text>
                <text x="100" y="65" fontSize="10" fill="white" textAnchor="middle">
                  Semana 2
                </text>
                <text x="180" y="65" fontSize="10" fill="white" textAnchor="middle">
                  Semana 3
                </text>
                <text x="280" y="65" fontSize="10" fill="white" textAnchor="middle">
                  Semana 4
                </text>
                <text x="20" y="20" fontSize="8" fill="#00FF66" textAnchor="middle">
                  Definición
                </text>
                <text x="100" y="20" fontSize="8" fill="#00FF66" textAnchor="middle">
                  Desarrollo
                </text>
                <text x="180" y="20" fontSize="8" fill="#00FF66" textAnchor="middle">
                  SEO
                </text>
                <text x="280" y="20" fontSize="8" fill="#00FF66" textAnchor="middle">
                  Lanzamiento
                </text>
              </svg>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800 hover:shadow-[0_0_15px_rgba(0,255,102,0.1)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
                      <span className="text-sm font-bold text-neon-green">1</span>
                    </div>
                    <h3 className="font-medium text-white">Semana 1</h3>
                  </div>
                  <h4 className="text-base font-medium mb-3 text-zinc-300">Definición del Modelo de Negocio</h4>
                  <ul className="space-y-2 text-sm text-zinc-400 font-light tracking-wide">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Validamos contigo la propuesta de valor y los flujos de ingresos.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Configuramos la estructura del marketplace según tu nicho.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800 hover:shadow-[0_0_15px_rgba(0,255,102,0.1)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
                      <span className="text-sm font-bold text-neon-green">2</span>
                    </div>
                    <h3 className="font-medium text-white">Semana 2</h3>
                  </div>
                  <h4 className="text-base font-medium mb-3 text-zinc-300">Desarrollo del MVP</h4>
                  <ul className="space-y-2 text-sm text-zinc-400 font-light tracking-wide">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Implementamos autenticación, listados y pasarela de pagos.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Optimizamos el diseño para una experiencia intuitiva.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800 hover:shadow-[0_0_15px_rgba(0,255,102,0.1)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
                      <span className="text-sm font-bold text-neon-green">3</span>
                    </div>
                    <h3 className="font-medium text-white">Semana 3</h3>
                  </div>
                  <h4 className="text-base font-medium mb-3 text-zinc-300">Integración de SEO Avanzado</h4>
                  <ul className="space-y-2 text-sm text-zinc-400 font-light tracking-wide">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Configuramos indexación masiva en Google para generar tráfico.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Optimizamos la velocidad de carga y el rendimiento.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800 hover:shadow-[0_0_15px_rgba(0,255,102,0.1)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
                      <span className="text-sm font-bold text-neon-green">4</span>
                    </div>
                    <h3 className="font-medium text-white">Semana 4</h3>
                  </div>
                  <h4 className="text-base font-medium mb-3 text-zinc-300">Testing y Lanzamiento</h4>
                  <ul className="space-y-2 text-sm text-zinc-400 font-light tracking-wide">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Realizamos pruebas exhaustivas en desktop y mobile.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-1.5"></span>
                      <span>Desplegamos tu marketplace en producción.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <p className="text-sm text-center text-zinc-400 font-light">
          Nuestro sistema está diseñado para ejecutar tu marketplace en 4 fases estratégicas.
        </p>
      </div>
    </div>
  )
}

