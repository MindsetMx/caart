export interface AuctionDetails {
  data: AuctionDetailsData;
}

export interface AuctionDetailsData {
  type: string;
  id: string;
  attributes: AuctionDetailsAttributes;
}

export interface AuctionDetailsAttributes {
  _id: string;
  type: string;
  brand: string;
  year: number;
  carModel: string;
  exteriorColor: string;
  interiorColor: string;
  specificColor: string;
  generalCondition: string;
  transmissionType: string;
  otherTransmission: null;
  engine: string;
  city: string;
  postalCode: string;
  state: string;
  reserve: boolean;
  reserveAmount: number;
  kmType: string;
  kmInput: number;
  howDidYouHearAboutUs: string;
  photos: string[];
  videos: any[];
  interest: string;
  acceptTerms: boolean;
  status: string;
  userId: string;
  __v: number;
  lotNumber: number;
}
