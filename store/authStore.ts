import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  followers?: number;
  following?: number;
  bio?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  followUser: (userId: number) => void;
  unfollowUser: (userId: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: async (username: string, password: string) => {
        // Simulate API call with validation
        if (username.length >= 3 && password.length >= 6) {
          const mockUser: User = {
            id: 1,
            username,
            email: `${username}@example.com`,
            firstName: username.charAt(0).toUpperCase() + username.slice(1),
            lastName: 'User',
            avatar: `https://i.pravatar.cc/150?u=${username}`,
            followers: Math.floor(Math.random() * 1000) + 100,
            following: Math.floor(Math.random() * 500) + 50,
            bio: 'Living life one post at a time ✨',
          };
          set({ isAuthenticated: true, user: mockUser });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      followUser: (userId: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              following: (currentUser.following || 0) + 1 
            } 
          });
        }
      },
      unfollowUser: (userId: number) => {
        const currentUser = get().user;
        if (currentUser && currentUser.following && currentUser.following > 0) {
          set({ 
            user: { 
              ...currentUser, 
              following: currentUser.following - 1 
            } 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);