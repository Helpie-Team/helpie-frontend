import { create } from 'zustand';

export type ModalType = 'login' | 'signup' | 'signup-form' | 'email-signup' | 'email-login' | null;

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  socialAccessToken: string | null;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  switchModal: () => void;
  openSignupForm: (token: string) => void;
  openLoginModal: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  modalType: null,
  socialAccessToken: null,
  
  openModal: (type: ModalType) => {
    if (type) {
      set({ isOpen: true, modalType: type });
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeModal: () => {
    set({ isOpen: false, modalType: null, socialAccessToken: null });
    document.body.style.overflow = 'unset';
  },
  
  switchModal: () => {
    const { modalType } = get();
    if (modalType === 'login') {
      set({ modalType: 'signup' });
    } else if (modalType === 'signup') {
      set({ modalType: 'login' });
    }
  },
  
  openSignupForm: (token: string) => {
    set({ isOpen: true, modalType: 'signup-form', socialAccessToken: token });
    document.body.style.overflow = 'hidden';
  },
  
  openLoginModal: () => {
    set({ isOpen: true, modalType: 'login' });
    document.body.style.overflow = 'hidden';
  },
}));
