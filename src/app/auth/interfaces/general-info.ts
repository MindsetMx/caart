export interface GeneralInfo {
  data: Data;
}

export interface Data {
  type: string;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  hasGeneralInfo: boolean;
  message: string;
  taxId: string;
  hasStripeId: boolean;
  streetAndNumber: string;
  postalCode: string;
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  card: Card;
}

export interface Card {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}
