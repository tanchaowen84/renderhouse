import { create } from 'zustand';

type CreditsState = {
  creditsUnits: number;
  setCreditsUnits: (units: number) => void;
};

export const useCreditsStore = create<CreditsState>((set) => ({
  creditsUnits: 0,
  setCreditsUnits: (units) => set({ creditsUnits: units }),
}));
