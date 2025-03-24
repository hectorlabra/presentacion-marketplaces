import { Gift } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Slide8() {
  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-8 text-white text-center">
          Pack de <span className="text-neon-green">Bonos</span>: Escala Tu Marketplace Más Rápido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
                  <Gift className="h-5 w-5 text-neon-green" />
                </div>
                <h3 className="font-medium text-white">BONO 1</h3>
              </div>

              <div className="h-40 relative rounded-lg overflow-hidden mb-6 border border-zinc-800 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="120" fill="black" />

                  <circle cx="50" cy="40" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="50" y="40" textAnchor="middle" fontSize="6" fill="white">
                    Comisión por venta
                  </text>

                  <circle cx="150" cy="40" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="150" y="40" textAnchor="middle" fontSize="6" fill="white">
                    Suscripción
                  </text>

                  <circle cx="50" cy="90" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="50" y="90" textAnchor="middle" fontSize="6" fill="white">
                    Publicidad
                  </text>

                  <circle cx="150" cy="90" r="20" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="150" y="90" textAnchor="middle" fontSize="6" fill="white">
                    Leads
                  </text>

                  <circle cx="100" cy="60" r="30" fill="#00FF66" fillOpacity="0.1" stroke="#00FF66" strokeWidth="2" />
                  <text x="100" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
                    Monetización
                  </text>
                  <text x="100" y="70" textAnchor="middle" fontSize="10" fill="white">
                    Estrategias
                  </text>

                  <line x1="70" y1="40" x2="80" y2="45" stroke="#00FF66" strokeWidth="1" />
                  <line x1="130" y1="40" x2="120" y2="45" stroke="#00FF66" strokeWidth="1" />
                  <line x1="70" y1="90" x2="80" y2="85" stroke="#00FF66" strokeWidth="1" />
                  <line x1="130" y1="90" x2="120" y2="85" stroke="#00FF66" strokeWidth="1" />
                </svg>
              </div>

              <h4 className="text-lg font-medium mb-2 text-white">Boostcamp de Estrategias de Monetización</h4>
              <p className="text-sm font-medium mb-4 text-neon-green">
                Convierte tu Marketplace en una Máquina de Ingresos
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-zinc-300 font-light tracking-wide">
                    Domina los 4 modelos de monetización más rentables.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-zinc-300 font-light tracking-wide">
                    Aprende a optimizar cada venta y aumentar la conversión.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
                  <Gift className="h-5 w-5 text-neon-green" />
                </div>
                <h3 className="font-medium text-white">BONO 2</h3>
              </div>

              <div className="h-40 relative rounded-lg overflow-hidden mb-6 border border-zinc-800 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="120" fill="black" />

                  {/* Envelope */}
                  <path d="M40 30H160V100H40V30Z" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <path d="M40 30L100 65L160 30" stroke="#00FF66" strokeWidth="1" />

                  {/* Email Auto Responses */}
                  <rect x="60" y="40" width="30" height="3" rx="1.5" fill="#333333" />
                  <rect x="60" y="45" width="20" height="3" rx="1.5" fill="#333333" />
                  <rect x="60" y="50" width="25" height="3" rx="1.5" fill="#00FF66" />

                  <rect x="110" y="40" width="30" height="3" rx="1.5" fill="#333333" />
                  <rect x="110" y="45" width="20" height="3" rx="1.5" fill="#333333" />
                  <rect x="110" y="50" width="25" height="3" rx="1.5" fill="#00FF66" />

                  {/* Automation Arrows */}
                  <path d="M65 80 C65 65, 135 65, 135 80" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
                  <path d="M130 75 L135 80 L140 75" stroke="#00FF66" strokeWidth="1" />

                  <text x="100" y="90" textAnchor="middle" fontSize="10" fill="white">
                    Automación de emails
                  </text>
                </svg>
              </div>

              <h4 className="text-lg font-medium mb-2 text-white">Sistema de Email Marketing Automático</h4>
              <p className="text-sm font-medium mb-4 text-neon-green">Convierte correos en ventas y crecimiento</p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-zinc-300 font-light tracking-wide">
                    Captación automática de vendedores y compradores.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-zinc-300 font-light tracking-wide">
                    Conversión optimizada y mayor retención de usuarios.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/30">
                  <Gift className="h-5 w-5 text-neon-green" />
                </div>
                <h3 className="font-medium text-white">BONO 3</h3>
              </div>

              <div className="h-40 relative rounded-lg overflow-hidden mb-6 border border-zinc-800 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="120" fill="black" />

                  {/* Social Media Icons */}
                  <circle cx="60" cy="40" r="15" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="60" y="43" textAnchor="middle" fontSize="12" fill="#00FF66">
                    f
                  </text>

                  <circle cx="100" cy="40" r="15" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="100" y="43" textAnchor="middle" fontSize="12" fill="#00FF66">
                    in
                  </text>

                  <circle cx="140" cy="40" r="15" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="140" y="43" textAnchor="middle" fontSize="12" fill="#00FF66">
                    ig
                  </text>

                  {/* Ad Types */}
                  <rect x="50" y="70" width="100" height="15" rx="3" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="100" y="81" textAnchor="middle" fontSize="8" fill="white">
                    Anuncios de Conversión
                  </text>

                  <rect x="50" y="90" width="100" height="15" rx="3" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                  <text x="100" y="101" textAnchor="middle" fontSize="8" fill="white">
                    Campañas de Retargeting
                  </text>

                  {/* Connecting Lines */}
                  <line x1="60" y1="55" x2="60" y2="70" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="100" y1="55" x2="100" y2="70" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="140" y1="55" x2="140" y2="70" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
              </div>

              <h4 className="text-lg font-medium mb-2 text-white">Sistema de Meta Ads para Crecimiento</h4>
              <p className="text-sm font-medium mb-4 text-neon-green">Atrae vendedores y compradores eficientemente</p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-zinc-300 font-light tracking-wide">
                    Anuncios probados para atraer usuarios rentables.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-zinc-300 font-light tracking-wide">
                    Estrategias que reducen costos hasta un 50%.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

