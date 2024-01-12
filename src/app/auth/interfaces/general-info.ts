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
  hasStripeId: boolean;
  paymentMethods: any[];
}

