import type { StoredUser } from "../types/customer";
import type { PaymentMethod } from "../types/account";

export const DEMO_EMAIL = "maria@belladonna.com.br";
export const DEMO_PASSWORD = "senha123";

export const demoPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "credit",
    label: "Visa terminado em 1234",
    lastFour: "1234",
    isDefault: true,
  },
  {
    id: "pm-2",
    type: "pix",
    label: "Pix cadastrado",
    isDefault: false,
  },
];

export const demoUser: StoredUser = {
  id: "user-demo-maria",
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
  customer: {
    id: "user-demo-maria",
    fullName: "Maria Helena Silva",
    email: DEMO_EMAIL,
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    birthDate: "1965-03-15",
    createdAt: "2020-01-10T10:00:00.000Z",
  },
  addresses: [
    {
      id: "addr-1",
      label: "Casa",
      cep: "01310-100",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      isPrimary: true,
    },
    {
      id: "addr-2",
      label: "Trabalho",
      cep: "04538-132",
      street: "Av. Brigadeiro Faria Lima",
      number: "2500",
      neighborhood: "Itaim Bibi",
      city: "São Paulo",
      state: "SP",
      isPrimary: false,
    },
  ],
  settings: {
    emailNews: true,
    emailPromos: true,
    emailNewProducts: false,
  },
};
