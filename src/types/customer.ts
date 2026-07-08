export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isPrimary: boolean;
}

export interface CustomerSettings {
  emailNews: boolean;
  emailPromos: boolean;
  emailNewProducts: boolean;
}

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  customer: Customer;
  addresses: CustomerAddress[];
  settings: CustomerSettings;
}
