export interface PaymentMethods {
  data: PaymentMethodsData[];
  meta: PaymentMethodsMeta;
}

export interface PaymentMethodsData {
  type: string;
  id: string;
  attributes: PaymentMethodsAttributes;
}

export interface PaymentMethodsAttributes {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface PaymentMethodsMeta {
  defaultPaymentMethodId: string;
}
