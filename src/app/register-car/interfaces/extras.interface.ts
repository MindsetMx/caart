export interface Extras {
  data: ExtrasData;
}

export interface ExtrasData {
  type: string;
  attributes: ExtrasAttributes;
}

export interface ExtrasAttributes {
  toolBox: boolean;
  carCover: boolean;
  batteryCharger: boolean;
  manuals: boolean;
  tireInflator: boolean;
  numberOfKeys: number;
  others: string;
  additionalCharges: AdditionalCharge[];
  comments: string;
  termsConditionsAccepted: boolean;
}

export interface AdditionalCharge {
  chargeType: string;
  amount: number;
  _id: string;
}
