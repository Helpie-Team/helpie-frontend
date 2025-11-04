import { create } from 'zustand';
import { UserInfoResponse } from '../../api/types/auth/auth';

interface UserState {
  userInfo: UserInfoResponse | null;
  setUserInfo: (userInfo: UserInfoResponse | null) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  
  setUserInfo: (userInfo) => set({ userInfo }),
  
  clearUserInfo: () => set({ userInfo: null }),
}));

