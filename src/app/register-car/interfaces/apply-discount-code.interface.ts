export interface ApplyDiscountCode {
  data: Datum[];
  discountInfo: DiscountInfo;
}

export interface Datum {
  type: string;
  id: string;
  attributes: DatumAttributes;
}

export interface DatumAttributes {
  _id: string;
  amount: number;
  description: string;
  recommended: boolean;
  submessage: string;
  __v: number;
  originalAmount: number;
  discountedAmount: number;
}

export interface DiscountInfo {
  type: string;
  id: string;
  attributes: DiscountInfoAttributes;
}

export interface DiscountInfoAttributes {
  message: string;
  discount: number;
  discountType: string;
  isValid: boolean;
}
