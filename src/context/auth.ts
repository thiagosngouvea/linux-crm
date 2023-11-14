import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface User {
    id: string;
    name: string;
    email: string;
    token: string;
    role: string;
    avatar: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    phone: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    setUser: (user: User) => void;
    updateUser: (user: User) => void;
    recoveryAuth: any;
    logout: () => void;
  }
  
  const useAuthStore = create<AuthStore>()(persist(
    (set, get) => ({
      isAuthenticated: !!get()?.user?.token ?? false,
      user: null,
      setUser: (user) => set({ user }),
      updateUser: async (user) => {
        set((state) => ({ user: { ...state.user, ...user }}));
      },
      recoveryAuth: async () => {
        return {
          success: !!get()?.user?.token ?? false,
        };
      },
      logout: async () => {
        useAuthStore.persist.clearStorage();
        //tem que fazer com que o recoveryAuth retorne false
        set({ user: null });
        
      }
    }),
    {
      name: 'LINUX-SESSION', // Nome da chave no localStorage ou AsyncStorage
      storage: createJSONStorage(() => localStorage), // Opcional, mas recomendado
    }
  ));
  
  export { useAuthStore };
  