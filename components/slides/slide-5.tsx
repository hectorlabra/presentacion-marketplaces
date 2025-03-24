import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Slide5() {
  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-6 text-white">
              Tu MVP en <span className="text-neon-green">30 Días</span>: Funcionalidades Listas para Crecer
            </h2>

            <div className="rounded-xl overflow-hidden my-8 h-64 relative border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill="black" />

                {/* Central Node */}
                <circle cx="150" cy="100" r="30" fill="#00FF66" fillOpacity="0.2" stroke="#00FF66" strokeWidth="2" />
                <text x="150" y="100" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
                  Marketplace
                </text>
                <text x="150" y="112" fontSize="8" fill="#00FF66" textAnchor="middle">
                  Core
                </text>

                {/* Feature Nodes */}
                <g>
                  <circle cx="80" cy="50" r="25" fill="#111111" stroke="#333333" strokeWidth="1" />
                  <text x="80" y="50" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">
                    Autenticación
                  </text>
                  <line x1="100" y1="63" x2="130" y2="80" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="220" cy="50" r="25" fill="#111111" stroke="#333333" strokeWidth="1" />
                  <text x="220" y="50" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">
                    Búsqueda
                  </text>
                  <line x1="200" y1="63" x2="170" y2="80" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="220" cy="150" r="25" fill="#111111" stroke="#333333" strokeWidth="1" />
                  <text x="220" y="150" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">
                    Pagos
                  </text>
                  <line x1="200" y1="137" x2="170" y2="120" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="80" cy="150" r="25" fill="#111111" stroke="#333333" strokeWidth="1" />
                  <text x="80" y="150" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">
                    SEO
                  </text>
                  <line x1="70" y1="137" x2="130" y2="120" stroke="#00FF66" strokeWidth="1" />
                </g>

                <g>
                  <circle cx="40" cy="100" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="40" y="100" fontSize="6" fill="white" textAnchor="middle">
                    Notifi-
                  </text>
                  <text x="40" y="110" fontSize="6" fill="white" textAnchor="middle">
                    caciones
                  </text>
                  <line x1="60" y1="100" x2="115" y2="100" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                <g>
                  <circle cx="260" cy="100" r="20" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="1" />
                  <text x="260" y="100" fontSize="6" fill="white" textAnchor="middle">
                    Reporting
                  </text>
                  <line x1="240" y1="100" x2="185" y2="100" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
                </g>
              </svg>
            </div>

            <div className="hidden md:block mt-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-400 italic font-light tracking-wide">
                    Todo lo que necesitas para validar tu negocio y generar tracción desde el primer día.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:w-2/3 space-y-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                <Check className="h-5 w-5 text-neon-green" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-white">Autenticación y Perfiles de Usuario</h3>
                <p className="text-sm text-zinc-300 font-light tracking-wide">
                  Registro y login para proveedores, compradores y empresas del sector, con perfiles optimizados para
                  venta consultiva en el rubro de Tratamiento de Agua.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                <Check className="h-5 w-5 text-neon-green" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-white">Búsqueda y Filtros Inteligentes</h3>
                <p className="text-sm text-zinc-300 font-light tracking-wide">
                  Permite a los compradores encontrar fácilmente productos específicos para el tratamiento de agua según
                  categoría, aplicación o tipo de insumo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                <Check className="h-5 w-5 text-neon-green" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-white">Sistema de Pagos Integrado</h3>
                <p className="text-sm text-zinc-300 font-light tracking-wide">
                  Pasarelas de pago locales e internacionales, con opción de pagos recurrentes para suscripciones y
                  billeteras digitales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                <Check className="h-5 w-5 text-neon-green" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-white">Notificaciones y Alertas</h3>
                <p className="text-sm text-zinc-300 font-light tracking-wide">
                  Recordatorios sobre mantenimientos, reposición de insumos y nuevas oportunidades para proveedores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-neon-green/10 p-2 rounded-full border border-neon-green/30">
                <Check className="h-5 w-5 text-neon-green" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-white">Optimización para Tráfico Orgánico</h3>
                <p className="text-sm text-zinc-300 font-light tracking-wide">
                  Diseño SEO-ready para posicionar productos en Google y atraer clientes sin depender de anuncios pagos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden mt-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400 italic text-center font-light tracking-wide">
                Todo lo que necesitas para validar tu negocio y generar tracción desde el primer día.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

