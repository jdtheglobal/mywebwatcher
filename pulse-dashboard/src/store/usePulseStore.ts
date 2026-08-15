import { create } from 'zustand';

interface User {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
}

interface PulseState {
  user: User | null;
  isAuthLoading: boolean;
  selectedSiteId: string | null;
  fetchUser: () => Promise<void>;
  setSelectedSiteId: (id: string | null) => void;
}

export const usePulseStore = create<PulseState>((set) => ({
  user: null,
  isAuthLoading: true,
  selectedSiteId: null,
  
  fetchUser: async () => {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      set({ user: clientPrincipal, isAuthLoading: false });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ user: null, isAuthLoading: false });
    }
  },
  
  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
}));
