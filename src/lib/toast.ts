import { create } from 'zustand';

type ToastKind = 'success' | 'error' | 'info';

type ToastState = {
  id: number;
  message: string;
  kind: ToastKind;
};

type ToastStore = {
  toasts: ToastState[];
  show: (message: string, kind?: ToastKind) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, kind = 'info') => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, message, kind }] }));
    setTimeout(() => {
      useToastStore.getState().dismiss(id);
    }, 2600);
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));

export const toast = {
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
  info: (message: string) => useToastStore.getState().show(message, 'info'),
};