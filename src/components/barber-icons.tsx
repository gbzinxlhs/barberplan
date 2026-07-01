export function BarberPole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 120" className={className} fill="none">
      <rect x="6" y="2" width="20" height="116" rx="4" className="fill-zinc-800" />
      <rect x="4" y="0" width="24" height="6" rx="3" className="fill-zinc-600" />
      <rect x="4" y="114" width="24" height="6" rx="3" className="fill-zinc-600" />
      <rect x="8" y="6" width="16" height="108" rx="2" fill="url(#poleStripe)" />
      <defs>
        <linearGradient id="poleStripe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="14%" stopColor="#ef4444" />
          <stop offset="14%" stopColor="#ffffff" />
          <stop offset="28.5%" stopColor="#ffffff" />
          <stop offset="28.5%" stopColor="#3b82f6" />
          <stop offset="43%" stopColor="#3b82f6" />
          <stop offset="43%" stopColor="#ef4444" />
          <stop offset="57%" stopColor="#ef4444" />
          <stop offset="57%" stopColor="#ffffff" />
          <stop offset="71.5%" stopColor="#ffffff" />
          <stop offset="71.5%" stopColor="#3b82f6" />
          <stop offset="86%" stopColor="#3b82f6" />
          <stop offset="86%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BarberChair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" className={className} fill="none">
      <rect x="50" y="170" width="60" height="8" rx="3" className="fill-zinc-600" />
      <rect x="40" y="148" width="80" height="24" rx="4" className="fill-zinc-700" />
      <rect x="54" y="120" width="52" height="30" rx="3" className="fill-zinc-700" />
      <rect x="44" y="144" width="72" height="8" rx="2" className="fill-zinc-600" />
      <rect x="70" y="178" width="20" height="20" rx="2" className="fill-zinc-700" />
      <path d="M80 120 L80 86 Q80 50 118 34 L118 48 Q94 54 94 86 L94 120Z" className="fill-zinc-700" />
      <path d="M80 120 L80 86 Q80 50 42 34 L42 48 Q66 54 66 86 L66 120Z" className="fill-zinc-700" />
      <rect x="60" y="34" width="40" height="16" rx="6" className="fill-zinc-600" />
      <rect x="72" y="18" width="16" height="18" rx="4" className="fill-zinc-600" />
      <circle cx="80" cy="14" r="6" className="fill-zinc-500" />
      <circle cx="80" cy="14" r="3" className="fill-zinc-400" />
      <ellipse cx="80" cy="142" rx="38" ry="6" className="fill-zinc-800" opacity="0.6" />
    </svg>
  );
}

export function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <circle cx="14" cy="14" r="6" className="fill-zinc-600" />
      <circle cx="14" cy="46" r="6" className="fill-zinc-600" />
      <circle cx="14" cy="14" r="3" className="fill-zinc-500" />
      <circle cx="14" cy="46" r="3" className="fill-zinc-500" />
      <path d="M18 16 L44 30" className="stroke-zinc-600" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 44 L44 30" className="stroke-zinc-600" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 16 L44 16 Q48 16 48 20 L48 24" className="stroke-zinc-600" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M18 44 L44 44 Q48 44 48 40 L48 36" className="stroke-zinc-600" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Comb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} fill="none">
      <rect x="0" y="4" width="84" height="6" rx="3" className="fill-zinc-700" />
      <rect x="0" y="14" width="84" height="6" rx="3" className="fill-zinc-700" />
      <rect x="0" y="24" width="54" height="6" rx="3" className="fill-zinc-700" />
      <rect x="86" y="0" width="34" height="40" rx="4" className="fill-zinc-700" />
      <rect x="90" y="6" width="26" height="28" rx="2" className="fill-zinc-600" />
      <line x1="8" y1="4" x2="8" y2="30" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="18" y1="4" x2="18" y2="30" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="28" y1="4" x2="28" y2="30" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="38" y1="4" x2="38" y2="30" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="48" y1="4" x2="48" y2="30" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="58" y1="4" x2="58" y2="20" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="68" y1="4" x2="68" y2="20" className="stroke-zinc-600" strokeWidth="1.5" />
      <line x1="78" y1="4" x2="78" y2="20" className="stroke-zinc-600" strokeWidth="1.5" />
    </svg>
  );
}

export function StraightRazor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 30" className={className} fill="none">
      <path d="M82 4 L56 14 L54 16 L58 20 L80 12 Q88 8 82 4Z" className="fill-zinc-600" />
      <path d="M82 4 L56 14 L54 16 L58 20 L80 12 Q88 8 82 4Z" className="fill-zinc-500" opacity="0.5" />
      <rect x="12" y="12" width="40" height="6" rx="2" className="fill-zinc-700" />
      <rect x="10" y="8" width="46" height="14" rx="4" className="fill-zinc-800" />
      <rect x="10" y="8" width="46" height="4" rx="2" className="fill-zinc-700" />
      <line x1="52" y1="12" x2="56" y2="16" className="stroke-zinc-600" strokeWidth="1" />
    </svg>
  );
}

export function Mustache({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none">
      <path d="M10 20 Q10 4 30 8 Q40 12 50 20 Q60 12 70 8 Q90 4 90 20 Q90 30 80 34 Q70 36 50 28 Q30 36 20 34 Q10 30 10 20Z" className="fill-zinc-700" />
      <path d="M10 20 Q10 10 30 12 Q40 14 50 20 Q60 14 70 12 Q90 10 90 20" className="fill-zinc-600" />
    </svg>
  );
}

export function HairClipper({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 50" className={className} fill="none">
      <rect x="4" y="14" width="40" height="24" rx="6" className="fill-zinc-700" />
      <rect x="8" y="18" width="32" height="16" rx="3" className="fill-zinc-600" />
      <rect x="12" y="20" width="24" height="12" rx="2" className="fill-zinc-500" />
      <line x1="16" y1="20" x2="16" y2="32" className="stroke-zinc-400" strokeWidth="0.8" />
      <line x1="20" y1="20" x2="20" y2="32" className="stroke-zinc-400" strokeWidth="0.8" />
      <line x1="24" y1="20" x2="24" y2="32" className="stroke-zinc-400" strokeWidth="0.8" />
      <line x1="28" y1="20" x2="28" y2="32" className="stroke-zinc-400" strokeWidth="0.8" />
      <line x1="32" y1="20" x2="32" y2="32" className="stroke-zinc-400" strokeWidth="0.8" />
      <rect x="44" y="10" width="32" height="28" rx="8" className="fill-zinc-800" />
      <rect x="48" y="14" width="24" height="20" rx="6" className="fill-zinc-700" />
      <circle cx="60" cy="24" r="4" className="fill-zinc-500" />
      <circle cx="60" cy="24" r="2" className="fill-zinc-400" />
      <path d="M44 18 Q38 16 36 24" className="stroke-zinc-800" strokeWidth="2" fill="none" />
      <path d="M74 22 L78 22" className="stroke-zinc-600" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BadgePremium({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <circle cx="30" cy="30" r="28" className="fill-zinc-800" stroke="currentColor" strokeWidth="1" />
      <circle cx="30" cy="30" r="22" className="fill-zinc-700" />
      <path d="M30 10 L34 22 L46 22 L36 30 L40 42 L30 34 L20 42 L24 30 L14 22 L26 22Z" className="fill-primary" />
      <path d="M30 14 L33 23 L42 23 L35 29 L38 38 L30 32 L22 38 L25 29 L18 23 L27 23Z" className="fill-primary-foreground" opacity="0.9" />
    </svg>
  );
}

export function ShavingBrush({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 80" className={className} fill="none">
      <rect x="12" y="52" width="16" height="24" rx="4" className="fill-zinc-700" />
      <rect x="14" y="54" width="12" height="20" rx="2" className="fill-zinc-600" />
      <ellipse cx="20" cy="50" rx="16" ry="6" className="fill-zinc-700" />
      <rect x="6" y="8" width="28" height="42" rx="8" className="fill-zinc-600" />
      <rect x="8" y="10" width="24" height="38" rx="6" className="fill-zinc-500" />
      <line x1="14" y1="14" x2="14" y2="44" className="stroke-zinc-400" strokeWidth="0.5" />
      <line x1="20" y1="14" x2="20" y2="44" className="stroke-zinc-400" strokeWidth="0.5" />
      <line x1="26" y1="14" x2="26" y2="44" className="stroke-zinc-400" strokeWidth="0.5" />
    </svg>
  );
}

export function Razor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 24" className={className} fill="none">
      <rect x="40" y="6" width="56" height="12" rx="3" className="fill-zinc-700" />
      <rect x="44" y="8" width="48" height="8" rx="2" className="fill-zinc-600" />
      <path d="M40 12 L32 6 L28 6 L36 14 L40 14Z" className="fill-zinc-600" />
      <path d="M28 6 L22 2 L20 4 L26 8Z" className="fill-zinc-500" />
      <circle cx="24" cy="4" r="1.5" className="fill-zinc-400" />
      <rect x="46" y="4" width="6" height="16" rx="1" className="fill-zinc-500" opacity="0.3" />
    </svg>
  );
}
