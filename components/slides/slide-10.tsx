"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Slide10Props {
  price?: number
  promotionEndDate?: string | null
  whatsappLink?: string
}

export default function Slide10({ price = 3000, promotionEndDate, whatsappLink = "#" }: Slide10Props) {
  // Estado para el tiempo restante
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  
  // Intentar usar la fecha proporcionada o devolver null si no es válida
  const getValidFutureDate = () => {
    if (!promotionEndDate) {
      console.log('No hay fecha de promoción definida');
      return null;
    }
    
    // Registrar detalles para depuración
    console.log('Información detallada de promotionEndDate:', {
      valor: promotionEndDate,
      tipo: typeof promotionEndDate,
      esString: typeof promotionEndDate === 'string',
      longitud: typeof promotionEndDate === 'string' ? promotionEndDate.length : 'N/A'
    });
    
    try {
      // Intentar parsear la fecha
      const date = new Date(promotionEndDate);
      
      // Verificar si es una fecha válida
      if (isNaN(date.getTime())) {
        console.error('La fecha de promoción no es válida:', promotionEndDate);
        return null;
      }
      
      // Verificar si la fecha ya pasó
      const now = new Date();
      if (date <= now) {
        console.log('La fecha de promoción ya pasó:', {
          fecha: date.toISOString(),
          ahora: now.toISOString(),
          diferencia: (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) + ' días'
        });
        return null;
      }
      
      console.log('Fecha de promoción válida detectada:', {
        original: promotionEndDate,
        parseada: date.toISOString(),
        tiempoRestante: (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) + ' días'
      });
      return date;
    } catch (e) {
      console.error('Error al procesar la fecha proporcionada:', e);
      return null;
    }
  };
  
  // Calcular tiempo restante
  useEffect(() => {
    console.log('========== INICIALIZANDO CONTADOR ==========');
    console.log('Fecha de promoción recibida en prop:', promotionEndDate);
    console.log('Tipo de dato de promotionEndDate:', typeof promotionEndDate);
    
    // Inspeccionar propiedades de la presentación para depuración
    console.log('Props recibidos en Slide10:', { price, promotionEndDate, whatsappLink });
    
    // Usar la fecha proporcionada si es válida
    const validEndDate = getValidFutureDate();
    
    // Si no hay fecha válida, no mostrar contador
    if (!validEndDate) {
      console.log('No hay fecha válida para el contador, ocultando contador');
      setTimeLeft(null);
      return;
    }
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = validEndDate.getTime() - now.getTime();
      
      if (difference <= 0) return null;
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
    
    // Establecer tiempo inicial
    setTimeLeft(calculateTimeLeft());
    
    // Actualizar cada segundo
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Si el tiempo se acabó, limpiar el intervalo
      if (!newTimeLeft) clearInterval(timer);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [promotionEndDate]);
  
  return (
    <div className="flex flex-col min-h-[600px] p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,102,0.15),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8 text-white text-center">
          Iniciar Tu Marketplace Nunca Fue Tan <span className="text-neon-green">Accesible</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="bg-zinc-900 border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold text-center mb-2 text-white">Precio de Oferta</h3>
                <p className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-neon-green">
                  {price} USD
                </p>

                <p className="text-sm text-center mb-8 text-zinc-400 font-light tracking-wide">
                  Pago por adelantado con Transferencia Bancaria MXN, Tarjeta de Débito, Crédito, Paypal, Payoneer,
                  Binance.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="text-center p-4 bg-black rounded-lg border border-zinc-800">
                    <p className="text-xl font-bold text-neon-green">5%</p>
                    <p className="text-xs text-white">inicial</p>
                    <p className="text-xs text-zinc-500">Reserva tu lugar</p>
                  </div>

                  <div className="text-center p-4 bg-black rounded-lg border border-zinc-800">
                    <p className="text-xl font-bold text-neon-green">45%</p>
                    <p className="text-xs text-white">14 días</p>
                    <p className="text-xs text-zinc-500">50% de avance</p>
                  </div>

                  <div className="text-center p-4 bg-black rounded-lg border border-zinc-800">
                    <p className="text-xl font-bold text-neon-green">50%</p>
                    <p className="text-xs text-white">30 días</p>
                    <p className="text-xs text-zinc-500">Lanzamiento</p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden mb-8 h-32 relative border border-zinc-800 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="300" height="120" fill="black" />

                    {/* Credit Cards */}
                    <rect x="30" y="30" width="50" height="30" rx="4" fill="#111111" stroke="#333333" strokeWidth="1" />
                    <rect x="35" y="40" width="15" height="5" rx="2" fill="#00FF66" />
                    <rect x="35" y="50" width="25" height="3" rx="1.5" fill="#333333" />

                    <rect x="45" y="40" width="50" height="30" rx="4" fill="#111111" stroke="#333333" strokeWidth="1" />
                    <rect x="50" y="50" width="15" height="5" rx="2" fill="#00FF66" />
                    <rect x="50" y="60" width="25" height="3" rx="1.5" fill="#333333" />

                    {/* Bank Transfer */}
                    <rect
                      x="120"
                      y="35"
                      width="60"
                      height="30"
                      rx="4"
                      fill="#111111"
                      stroke="#00FF66"
                      strokeWidth="1"
                    />
                    <text x="150" y="53" textAnchor="middle" fontSize="8" fill="white">
                      Transferencia
                    </text>
                    <text x="150" y="63" textAnchor="middle" fontSize="8" fill="#00FF66">
                      Bancaria
                    </text>

                    {/* Digital Wallets */}
                    <circle cx="220" cy="40" r="15" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                    <text x="220" y="42" textAnchor="middle" fontSize="8" fill="white">
                      Crypto
                    </text>

                    <circle cx="250" cy="40" r="15" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                    <text x="250" y="42" textAnchor="middle" fontSize="8" fill="white">
                      Paypal
                    </text>

                    <circle cx="235" cy="70" r="15" fill="#111111" stroke="#00FF66" strokeWidth="1" />
                    <text x="235" y="72" textAnchor="middle" fontSize="8" fill="white">
                      Payoneer
                    </text>

                    <text x="150" y="100" textAnchor="middle" fontSize="10" fill="#00FF66">
                      Múltiples opciones de pago disponibles
                    </text>
                  </svg>
                </div>

                {/* Mostrar el contador solo cuando hay timeLeft */}
                {timeLeft ? (
                  <div className="text-center mb-4 p-3 bg-black rounded-lg border border-neon-green/30">
                    <p className="text-sm text-white mb-1">La oferta termina en:</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <p className="text-xl font-bold text-neon-green">{timeLeft.days}</p>
                        <p className="text-xs text-zinc-400">días</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-neon-green">{timeLeft.hours}</p>
                        <p className="text-xs text-zinc-400">horas</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-neon-green">{timeLeft.minutes}</p>
                        <p className="text-xs text-zinc-400">min</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-neon-green">{timeLeft.seconds}</p>
                        <p className="text-xs text-zinc-400">seg</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex justify-center">
                  <Button
                    asChild
                    className="gap-2 bg-neon-green hover:bg-neon-green/90 text-black font-bold px-8 py-6 text-lg rounded-md"
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      Reserva tu lugar ahora <ArrowRight className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="font-medium mb-4 text-white">Comparativa de Valor</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2"></span>
                  <div>
                    <p className="text-base font-medium text-white">Agencias Tradicionales:</p>
                    <p className="text-sm text-zinc-400 font-light tracking-wide">
                      $20K-$50K, 6-12 meses, sin tráfico garantizado.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green mt-2"></span>
                  <div>
                    <p className="text-base font-medium text-white">Innovare Marketplaces:</p>
                    <p className="text-sm text-zinc-400 font-light tracking-wide">
                      MVP funcional en 30 días, optimizado para tráfico orgánico.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="font-medium mb-4 text-white">Lo que obtienes:</h3>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                    <Check className="h-4 w-4 text-neon-green" />
                  </div>
                  <span className="text-base text-zinc-300 font-light tracking-wide">
                    MVP completo y funcional en 30 días
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                    <Check className="h-4 w-4 text-neon-green" />
                  </div>
                  <span className="text-base text-zinc-300 font-light tracking-wide">
                    Optimización SEO para tráfico orgánico
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                    <Check className="h-4 w-4 text-neon-green" />
                  </div>
                  <span className="text-base text-zinc-300 font-light tracking-wide">
                    Estrategias de monetización desde el día 1
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                    <Check className="h-4 w-4 text-neon-green" />
                  </div>
                  <span className="text-base text-zinc-300 font-light tracking-wide">
                    3 bonos exclusivos para escalar rápidamente
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-neon-green/10 p-1 rounded-full border border-neon-green/30">
                    <Check className="h-4 w-4 text-neon-green" />
                  </div>
                  <span className="text-base text-zinc-300 font-light tracking-wide">
                    Garantía de satisfacción o reembolso
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-neon-green/10 rounded-xl border border-neon-green/30">
              <p className="text-base font-medium text-center text-white">
                Incluye más de <span className="text-neon-green">$3,788 USD</span> en BONOS por tiempo limitado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

