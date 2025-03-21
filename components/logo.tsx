export default function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* Simplified logo - just "Innovare" in green */}
      <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        <text x="10" y="30" fontSize="24" fill="#00FF66" fontFamily="Arial, sans-serif" fontWeight="bold">
          INNOVARE
        </text>
      </svg>
    </div>
  )
}

