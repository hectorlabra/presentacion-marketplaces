export default function Slide4() {
  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(0,255,102,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8 text-white text-center">
          Así Se Ven <span className="text-neon-green">Marketplaces</span> en Acción
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-white">Premisas técnicas de Innovare Marketplaces</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green"></span>
                  <span className="text-sm text-zinc-300 font-light tracking-wide">
                    Interfaz moderna y optimizada para desktop y móvil.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green"></span>
                  <span className="text-sm text-zinc-300 font-light tracking-wide">
                    Diseño intuitivo para compradores y vendedores.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green"></span>
                  <span className="text-sm text-zinc-300 font-light tracking-wide">
                    Navegación fluida, búsqueda avanzada y filtros eficientes.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="font-medium mb-4 text-white">Web App Adaptada a Todos los Dispositivos</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-sm text-zinc-300 font-light tracking-wide">
                    Optimizada para SEO y tráfico orgánico.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-sm text-zinc-300 font-light tracking-wide">
                    Accesible desde cualquier navegador, sin instalación.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-green font-bold">✓</span>
                  <span className="text-sm text-zinc-300 font-light tracking-wide">
                    100% Responsive: Funciona en todos los dispositivos.
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex justify-center">
                <svg width="280" height="120" viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="80" height="100" rx="4" stroke="#00FF66" strokeWidth="2" />
                  <rect x="100" y="30" width="160" height="60" rx="4" stroke="#00FF66" strokeWidth="2" />
                  <rect
                    x="30"
                    y="30"
                    width="40"
                    height="60"
                    rx="2"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                  <rect
                    x="120"
                    y="40"
                    width="120"
                    height="40"
                    rx="2"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                  <text x="50" y="65" fontSize="8" fill="white" textAnchor="middle">
                    Mobile
                  </text>
                  <text x="180" y="65" fontSize="8" fill="white" textAnchor="middle">
                    Desktop
                  </text>
                  <text x="140" y="110" fontSize="10" fill="#00FF66" textAnchor="middle">
                    Responsive Design
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="rounded-xl overflow-hidden mb-6 h-64 relative border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#111111" />

                {/* Header */}
                <rect x="0" y="0" width="400" height="50" fill="#000000" />
                <rect x="20" y="15" width="40" height="20" rx="2" fill="#00FF66" />
                <rect x="80" y="15" width="60" height="6" rx="2" fill="#333333" />
                <rect x="80" y="25" width="40" height="6" rx="2" fill="#333333" />
                <rect x="300" y="15" width="80" height="20" rx="4" stroke="#00FF66" strokeWidth="1" />
                <text x="340" y="28" fontSize="10" fill="#00FF66" textAnchor="middle">
                  Login
                </text>

                {/* Hero */}
                <rect x="0" y="50" width="400" height="80" fill="#0A0A0A" />
                <rect x="20" y="70" width="180" height="20" rx="2" fill="#222222" />
                <rect x="20" y="95" width="140" height="10" rx="2" fill="#222222" />
                <rect x="260" y="65" width="120" height="40" rx="4" fill="#00FF66" />
                <text x="320" y="90" fontSize="14" fill="black" textAnchor="middle" fontWeight="bold">
                  COMPRAR
                </text>

                {/* Products */}
                <rect x="20" y="150" width="100" height="80" rx="4" fill="#1A1A1A" />
                <rect x="30" y="160" width="80" height="40" rx="2" fill="#00FF66" fillOpacity="0.1" />
                <rect x="30" y="205" width="60" height="6" rx="2" fill="#555555" />
                <rect x="30" y="215" width="40" height="8" rx="2" fill="#00FF66" />

                <rect x="140" y="150" width="100" height="80" rx="4" fill="#1A1A1A" />
                <rect x="150" y="160" width="80" height="40" rx="2" fill="#00FF66" fillOpacity="0.1" />
                <rect x="150" y="205" width="60" height="6" rx="2" fill="#555555" />
                <rect x="150" y="215" width="40" height="8" rx="2" fill="#00FF66" />

                <rect x="260" y="150" width="100" height="80" rx="4" fill="#1A1A1A" />
                <rect x="270" y="160" width="80" height="40" rx="2" fill="#00FF66" fillOpacity="0.1" />
                <rect x="270" y="205" width="60" height="6" rx="2" fill="#555555" />
                <rect x="270" y="215" width="40" height="8" rx="2" fill="#00FF66" />
              </svg>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-medium mb-1">Interfaz de Usuario Moderna</h4>
                <p className="text-xs text-zinc-400">Diseño optimizado para conversión y experiencia de usuario</p>
              </div>
            </div>

            <p className="text-sm italic text-center mb-6 text-zinc-400 font-light">
              Un diseño optimizado genera más confianza, más conversiones y más ventas.
            </p>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="font-medium mb-4 text-white">App Móvil Nativa (Upsell Opcional)</h3>
              <div className="flex justify-between items-center">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-neon-green font-bold">✓</span>
                    <span className="text-sm text-zinc-300 font-light tracking-wide">
                      Experiencia específica para iOS y Android.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-neon-green font-bold">✓</span>
                    <span className="text-sm text-zinc-300 font-light tracking-wide">
                      Mayor retención y fidelización de usuarios.
                    </span>
                  </li>
                </ul>

                <div className="flex-shrink-0">
                  <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="50" height="90" rx="8" stroke="#00FF66" strokeWidth="2" />
                    <rect
                      x="10"
                      y="15"
                      width="40"
                      height="70"
                      rx="2"
                      stroke="#FFFFFF"
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />
                    <circle cx="30" cy="92" r="3" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

