export interface Users {
  data: UsersData[];
  meta: UsersMeta;
}

export interface UsersData {
  type: UsersType;
  id: string;
  attributes: UsersAttributes;
}

export interface UsersAttributes {
  firstName: string;
  lastName: string;
  username: string;
  sellerType: UsersSellerType;
  country: UsersCountry;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
  taxId?: string;
  clientId?: string;
  streetAndNumber?: string;
  postalCode?: string;
  validationType?: string;
  validationImg: string[];
  acceptTermsAndConditions: boolean;
  accountVerified: boolean;
  defaultPaymentMethodId?: string;
}

export enum UsersCountry {
  México = "México",
}

export enum UsersSellerType {
  Dealer = "Dealer",
  PersonaPrivada = "Persona privada",
}

export enum UsersType {
  User = "user",
}

export interface UsersMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
