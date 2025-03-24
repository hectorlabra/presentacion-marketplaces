import { Check } from "lucide-react"

interface Slide3Props {
  challengeFields?: string[]
}

export default function Slide3({ challengeFields = ["", "", "", "", "", ""] }: Slide3Props) {
  // Filtrar campos vacíos
  const filteredChallengeFields = challengeFields.filter((field) => field.trim() !== "")

  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-8 text-white">
              Tu Proyecto de <span className="text-neon-green">Marketplace</span>: Identificando los Desafíos y
              Oportunidades
            </h2>

            <div className="mb-8 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-neon-green via-neon-green/50 to-transparent"></div>
              <h3 className="text-xl font-medium mb-6 text-white">Desafíos Clave:</h3>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {filteredChallengeFields.length > 0 ? (
                  filteredChallengeFields.map((field, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                        <Check className="h-4 w-4 text-neon-green" />
                      </div>
                      <p className="text-sm text-zinc-300 font-light tracking-wide">{field}</p>
                    </div>
                  ))
                ) : (
                  // Contenido por defecto si no hay campos personalizados
                  <>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                        <Check className="h-4 w-4 text-neon-green" />
                      </div>
                      <p className="text-sm text-zinc-300 font-light tracking-wide">
                        <span className="font-medium text-white">Automatización con IA</span> – La venta consultiva
                        requiere asesoramiento técnico. Una IA recomendará productos según criterios específicos,
                        optimizando la conversión.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                        <Check className="h-4 w-4 text-neon-green" />
                      </div>
                      <p className="text-sm text-zinc-300 font-light tracking-wide">
                        <span className="font-medium text-white">Limitaciones de Plataformas Previas</span> – CS CART y
                        su web propia fallaron por problemas en pagos, logística y escalabilidad.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                        <Check className="h-4 w-4 text-neon-green" />
                      </div>
                      <p className="text-sm text-zinc-300 font-light tracking-wide">
                        <span className="font-medium text-white">Contenido vs. IA</span> – Antes usaba contenido para
                        atraer clientes, pero ahora la IA puede responder consultas de forma inmediata y personalizada.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                        <Check className="h-4 w-4 text-neon-green" />
                      </div>
                      <p className="text-sm text-zinc-300 font-light tracking-wide">
                        <span className="font-medium text-white">Digitalización de la Compra</span> – Algunos productos
                        pueden venderse como commodities, reduciendo la necesidad de asesoramiento humano.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden mb-8 h-64 relative border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="black" />

                {/* Challenges Circle */}
                <circle cx="200" cy="125" r="100" fill="transparent" stroke="#333333" strokeWidth="2" />
                <circle cx="200" cy="125" r="80" fill="transparent" stroke="#444444" strokeWidth="2" />

                {/* Center Text */}
                <text x="200" y="125" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">
                  Marketplace
                </text>
                <text x="200" y="145" fontSize="12" fill="#00FF66" textAnchor="middle">
                  Desafíos
                </text>

                {/* Challenge Items */}
                <g>
                  <circle cx="200" cy="25" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="200" y="25" fontSize="8" fill="white" textAnchor="middle">
                    IA
                  </text>
                  <line x1="200" y1="45" x2="200" y2="60" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="290" cy="70" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="290" y="70" fontSize="8" fill="white" textAnchor="middle">
                    Pagos
                  </text>
                  <line x1="275" y1="85" x2="260" y2="95" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="320" cy="150" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="320" y="150" fontSize="8" fill="white" textAnchor="middle">
                    Logística
                  </text>
                  <line x1="300" y1="142" x2="280" y2="135" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="260" cy="220" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="260" y="220" fontSize="8" fill="white" textAnchor="middle">
                    SEO
                  </text>
                  <line x1="248" y1="203" x2="235" y2="185" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="140" cy="220" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="140" y="220" fontSize="8" fill="white" textAnchor="middle">
                    UX
                  </text>
                  <line x1="152" y1="203" x2="165" y2="185" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="80" cy="150" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="80" y="150" fontSize="8" fill="white" textAnchor="middle">
                    Escala
                  </text>
                  <line x1="100" y1="142" x2="120" y2="135" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="110" cy="70" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="110" y="70" fontSize="8" fill="white" textAnchor="middle">
                    Ventas
                  </text>
                  <line x1="125" y1="85" x2="140" y2="95" stroke="#00FF66" strokeWidth="1" />
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                  <Check className="h-4 w-4 text-neon-green" />
                </div>
                <p className="text-xs text-zinc-300 font-light tracking-wide">
                  <span className="font-medium text-white">Canal de Distribución para Pymes</span> – Busca conectar
                  pequeñas empresas sin red de ventas con clientes en LATAM.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                  <Check className="h-4 w-4 text-neon-green" />
                </div>
                <p className="text-xs text-zinc-300 font-light tracking-wide">
                  <span className="font-medium text-white">Plataforma Escalable y Eficiente</span> – Necesita una
                  solución robusta que elimine los problemas de pagos y logística.
                </p>
              </div>
            </div>
          </div>
        </div>

        <blockquote className="mt-8 border-l-2 border-neon-green pl-4 italic text-zinc-400 font-light">
          "El éxito de este marketplace depende de su tecnología, su modelo de negocio y la confianza que genera en los
          usuarios. Te mostraremos cómo lo resolvemos en 30 días."
        </blockquote>
      </div>
    </div>
  )
}

