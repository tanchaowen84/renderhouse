'use client';

import { formatCredits } from '@/lib/credits';
import { useCreditsStore } from '@/stores/credits-store';
import { useEffect } from 'react';

interface CreditsBadgeProps {
  initialCreditsUnits: number;
}

export function CreditsBadge({ initialCreditsUnits }: CreditsBadgeProps) {
  const creditsUnits = useCreditsStore((state) => state.creditsUnits);
  const setCreditsUnits = useCreditsStore((state) => state.setCreditsUnits);

  useEffect(() => {
    setCreditsUnits(initialCreditsUnits ?? 0);
  }, [initialCreditsUnits, setCreditsUnits]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-[#d9dde1] bg-white/90 px-3.5 py-1.5 text-xs font-medium text-[#1f4b3e] shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6bb4a0] opacity-60"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6bb4a0]"></span>
      </span>
      <span>Credits · {formatCredits(creditsUnits)}</span>
    </div>
  );
}
