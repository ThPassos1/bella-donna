import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoredUser, Customer, CustomerAddress, CustomerSettings } from "../types/customer";
import type { PaymentMethod, SupportTicket, ReturnRequest } from "../types/account";
import { demoUser, demoPaymentMethods, DEMO_EMAIL } from "../data/demoCustomer";

const USERS_KEY = "bd-users";
const PAYMENTS_KEY = "bd-payments";
const TICKETS_KEY = "bd-tickets";
const RETURNS_KEY = "bd-returns";

export interface AuthStore {
  sessionUserId: string | null;
  users: StoredUser[];
  paymentMethods: Record<string, PaymentMethod[]>;
  tickets: SupportTicket[];
  returnRequests: ReturnRequest[];
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  isForgotOpen: boolean;
  authView: "login" | "register" | "forgot";
  openLogin: () => void;
  openRegister: () => void;
  openForgot: () => void;
  closeAuth: () => void;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    cpf?: string;
    password: string;
  }) => { success: boolean; error?: string };
  forgotPassword: (email: string) => { success: boolean; error?: string };
  logout: () => void;
  getCurrentUser: () => StoredUser | null;
  updateCustomer: (data: Partial<Customer>) => void;
  updateSettings: (settings: Partial<CustomerSettings>) => void;
  addAddress: (address: Omit<CustomerAddress, "id">) => void;
  updateAddress: (id: string, data: Partial<CustomerAddress>) => void;
  deleteAddress: (id: string) => void;
  setPrimaryAddress: (id: string) => void;
  getPaymentMethods: () => PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPayment: (id: string) => void;
  addTicket: (ticket: Omit<SupportTicket, "id" | "status" | "createdAt">) => void;
  addReturnRequest: (req: Omit<ReturnRequest, "id" | "status" | "createdAt">) => void;
  changePassword: (current: string, newPass: string) => { success: boolean; error?: string };
  seedDemoIfNeeded: () => void;
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      sessionUserId: null,
      users: loadJson<StoredUser[]>(USERS_KEY, []),
      paymentMethods: loadJson<Record<string, PaymentMethod[]>>(PAYMENTS_KEY, {}),
      tickets: loadJson<SupportTicket[]>(TICKETS_KEY, []),
      returnRequests: loadJson<ReturnRequest[]>(RETURNS_KEY, []),
      isLoginOpen: false,
      isRegisterOpen: false,
      isForgotOpen: false,
      authView: "login",

      openLogin: () => set({ isLoginOpen: true, authView: "login" }),
      openRegister: () => set({ isLoginOpen: true, authView: "register" }),
      openForgot: () => set({ isLoginOpen: true, authView: "forgot" }),
      closeAuth: () =>
        set({ isLoginOpen: false, isRegisterOpen: false, isForgotOpen: false }),

      seedDemoIfNeeded: () => {
        const users = get().users;
        if (!users.find((u) => u.email === DEMO_EMAIL)) {
          const updated = [...users, demoUser];
          localStorage.setItem(USERS_KEY, JSON.stringify(updated));
          const payments = { ...get().paymentMethods, [demoUser.id]: demoPaymentMethods };
          localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
          set({ users: updated, paymentMethods: payments });
        }
      },

      login: (email, password) => {
        get().seedDemoIfNeeded();
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) {
          return { success: false, error: "E-mail ou senha incorretos." };
        }
        set({ sessionUserId: user.id, isLoginOpen: false });
        return { success: true };
      },

      register: (data) => {
        get().seedDemoIfNeeded();
        if (get().users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
          return { success: false, error: "Este e-mail já está cadastrado." };
        }
        const id = crypto.randomUUID();
        const newUser: StoredUser = {
          id,
          email: data.email,
          password: data.password,
          customer: {
            id,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            cpf: data.cpf,
            createdAt: new Date().toISOString(),
          },
          addresses: [],
          settings: {
            emailNews: true,
            emailPromos: true,
            emailNewProducts: true,
          },
        };
        const users = [...get().users, newUser];
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users, sessionUserId: id, isLoginOpen: false });
        return { success: true };
      },

      forgotPassword: (email) => {
        get().seedDemoIfNeeded();
        const exists = get().users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (!exists) {
          return { success: false, error: "E-mail não encontrado." };
        }
        set({ isLoginOpen: false });
        return { success: true };
      },

      logout: () => set({ sessionUserId: null }),

      getCurrentUser: () => {
        const id = get().sessionUserId;
        if (!id) return null;
        return get().users.find((u) => u.id === id) ?? null;
      },

      updateCustomer: (data) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const users = get().users.map((u) =>
          u.id === user.id ? { ...u, customer: { ...u.customer, ...data } } : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users });
      },

      updateSettings: (settings) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const users = get().users.map((u) =>
          u.id === user.id ? { ...u, settings: { ...u.settings, ...settings } } : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users });
      },

      addAddress: (address) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const newAddr: CustomerAddress = { ...address, id: crypto.randomUUID() };
        let addresses = [...user.addresses, newAddr];
        if (newAddr.isPrimary || addresses.length === 1) {
          addresses = addresses.map((a) => ({
            ...a,
            isPrimary: a.id === newAddr.id,
          }));
        }
        const users = get().users.map((u) =>
          u.id === user.id ? { ...u, addresses } : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users });
      },

      updateAddress: (id, data) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const users = get().users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                addresses: u.addresses.map((a) =>
                  a.id === id ? { ...a, ...data } : a
                ),
              }
            : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users });
      },

      deleteAddress: (id) => {
        const user = get().getCurrentUser();
        if (!user) return;
        let addresses = user.addresses.filter((a) => a.id !== id);
        if (addresses.length > 0 && !addresses.some((a) => a.isPrimary)) {
          addresses[0] = { ...addresses[0], isPrimary: true };
        }
        const users = get().users.map((u) =>
          u.id === user.id ? { ...u, addresses } : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users });
      },

      setPrimaryAddress: (id) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const users = get().users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                addresses: u.addresses.map((a) => ({
                  ...a,
                  isPrimary: a.id === id,
                })),
              }
            : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users });
      },

      getPaymentMethods: () => {
        const user = get().getCurrentUser();
        if (!user) return [];
        return get().paymentMethods[user.id] ?? [];
      },

      addPaymentMethod: (method) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const methods = get().getPaymentMethods();
        const newMethod: PaymentMethod = { ...method, id: crypto.randomUUID() };
        let updated = [...methods, newMethod];
        if (newMethod.isDefault) {
          updated = updated.map((m) => ({
            ...m,
            isDefault: m.id === newMethod.id,
          }));
        }
        const all = { ...get().paymentMethods, [user.id]: updated };
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(all));
        set({ paymentMethods: all });
      },

      removePaymentMethod: (id) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const updated = get().getPaymentMethods().filter((m) => m.id !== id);
        const all = { ...get().paymentMethods, [user.id]: updated };
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(all));
        set({ paymentMethods: all });
      },

      setDefaultPayment: (id) => {
        const user = get().getCurrentUser();
        if (!user) return;
        const updated = get().getPaymentMethods().map((m) => ({
          ...m,
          isDefault: m.id === id,
        }));
        const all = { ...get().paymentMethods, [user.id]: updated };
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(all));
        set({ paymentMethods: all });
      },

      addTicket: (ticket) => {
        const user = get().getCurrentUser();
        const newTicket: SupportTicket = {
          ...ticket,
          userId: user?.id,
          id: String(1000 + get().tickets.length + 1),
          status: "in_review",
          createdAt: new Date().toISOString(),
        };
        const tickets = [newTicket, ...get().tickets];
        localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
        set({ tickets });
      },

      addReturnRequest: (req) => {
        const user = get().getCurrentUser();
        const newReq: ReturnRequest = {
          ...req,
          userId: user?.id,
          id: crypto.randomUUID(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        const returnRequests = [newReq, ...get().returnRequests];
        localStorage.setItem(RETURNS_KEY, JSON.stringify(returnRequests));
        set({ returnRequests });
      },

      changePassword: (current, newPass) => {
        const user = get().getCurrentUser();
        if (!user) return { success: false, error: "Usuário não logado." };
        if (user.password !== current) {
          return { success: false, error: "Senha atual incorreta." };
        }
        const users = get().users.map((u) =>
          u.id === user.id ? { ...u, password: newPass } : u
        );
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        set({ users });
        return { success: true };
      },
    }),
    {
      name: "bd-auth",
      partialize: (state) => ({
        sessionUserId: state.sessionUserId,
        users: state.users,
        paymentMethods: state.paymentMethods,
        tickets: state.tickets,
        returnRequests: state.returnRequests,
      }),
    }
  )
);
