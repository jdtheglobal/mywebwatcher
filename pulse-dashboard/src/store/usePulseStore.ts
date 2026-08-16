import { create } from 'zustand';

export interface User {
  userId: string;
  email: string;
  name: string;
  picture?: string;
}

interface PulseState {
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
  selectedSiteId: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
  setSelectedSiteId: (id: string | null) => void;
}

export const usePulseStore = create<PulseState>((set) => ({
  user: null,
  token: null,
  isAuthLoading: true,
  selectedSiteId: null,
  
  login: (token, user) => {
    localStorage.setItem('pulseAuthToken', token);
    localStorage.setItem('pulseUser', JSON.stringify(user));
    set({ token, user, isAuthLoading: false });
  },

  logout: () => {
    localStorage.removeItem('pulseAuthToken');
    localStorage.removeItem('pulseUser');
    set({ token: null, user: null, isAuthLoading: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('pulseAuthToken');
    const userStr = localStorage.getItem('pulseUser');
    if (token && userStr) {
      try {
        set({ token, user: JSON.parse(userStr), isAuthLoading: false });
      } catch (e) {
        set({ token: null, user: null, isAuthLoading: false });
      }
    } else {
      set({ token: null, user: null, isAuthLoading: false });
    }
  },
  
  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
}));
