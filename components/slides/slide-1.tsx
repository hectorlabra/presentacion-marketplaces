import { Button } from "@/components/ui/button"

export default function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.15),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-white">
          LANZA TU <span className="text-neon-green">MARKETPLACE RENTABLE</span> EN 30 DÍAS
        </h1>

        <h2 className="text-xl md:text-2xl font-light mb-10 text-zinc-300 tracking-wide">
          CON TRÁFICO ORGÁNICO Y MONETIZACIÓN DESDE EL DÍA 1
        </h2>

        <Button className="bg-neon-green hover:bg-neon-green/90 text-black font-bold px-8 py-6 text-lg rounded-md">
          COMENZAR AHORA
        </Button>

        <div className="mt-16 flex flex-col items-center">
          <p className="text-lg font-medium mb-2 text-zinc-400">Presentado por:</p>
          <h3 className="text-2xl font-display font-bold mb-1 text-white">Luis Correa</h3>
          <p className="text-lg font-medium mb-4 text-neon-green">Director</p>
          <p className="text-sm text-zinc-400 max-w-md font-light tracking-wide">
            Ingeniero Industrial, Master en Ing. de Software. 10 años de experiencia implementando soluciones de
            software y marketing digital en Latinoamerica.
          </p>
        </div>
      </div>
    </div>
  )
}

