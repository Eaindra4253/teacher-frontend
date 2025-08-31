import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EncryptStorage } from "encrypt-storage";

const encryptStorage = new EncryptStorage("auth-storage");
export interface AuthState {
  auth?: LoginResponse;
  setAuthUser: (token: LoginResponse) => void;
  removeAuthUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: undefined,
      setAuthUser: (auth) => set((state) => ({ ...state, auth })),
      removeAuthUser: () => set(() => ({ auth: undefined })),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: {
        getItem: (name) => encryptStorage.getItem(name),
        setItem: (name, value) => encryptStorage.setItem(name, value),
        removeItem: (name) => encryptStorage.removeItem(name),
      },
    }
  )
);
