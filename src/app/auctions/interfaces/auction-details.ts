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
  originalAuctionCarId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: string;
  endDate: string;
  reserveAmount: number;
  __v: number;
  status: string;
  premium: boolean;
  categories: string[];
  bids: Bid[];
  auctionCarForm: AuctionCarForm;
  extras: Extras;
  interiorDetails: InteriorDetails;
  mechanicsDetails: MechanicsDetails;
  exteriorDetails: ExteriorDetails;
  carHistory: CarHistory;
}

export interface CarHistory {
  _id: string;
  content: string;
  originalAuctionCarId: string;
  createdAt: string;
}

export interface AuctionCarForm {
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
  state: string;
}

export interface Bid {
  userId: string;
  bidAmount: number;
  bidTime: string;
  holdAmount: number;
  stripeTransactionId: null;
  isHoldActive: boolean;
  winner: boolean;
  paymentMethodId: string;
  _id: string;
}

export interface ExteriorDetails {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  accident: boolean;
  brand: string;
  carHistory: string;
  carModel: string;
  detailComments: string;
  exteriorColor: string;
  exteriorCondition: string;
  exteriorModified: boolean;
  exteriorPhotos: string[];
  exteriorVideos: any[];
  invoiceDetails: string;
  invoiceType: string;
  kmInput: number;
  odometerVerified: boolean;
  originalPaint: boolean;
  otherTransmission: string;
  paintMeter: boolean;
  raced: boolean;
  specificColor: string;
  transmissionType: string;
  warranties: boolean;
  wichWarranties: string;
  year: number;
}

export interface Extras {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  additionalCharges: AdditionalCharge[];
  batteryCharger: boolean;
  carCover: boolean;
  comments: string;
  manuals: boolean;
  numberOfKeys: number;
  others: string;
  termsConditionsAccepted: boolean;
  tireInflator: boolean;
  toolBox: boolean;
}

export interface AdditionalCharge {
  chargeType: string;
  amount: number;
  _id: string;
}

export interface InteriorDetails {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  accessoriesFunctioning: boolean;
  comments: string;
  interiorColor: string;
  interiorCondition: string;
  interiorModifications: boolean;
  interiorPhotos: string[];
  interiorVideos: any[];
  material: string;
}

export interface MechanicsDetails {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  comments: string;
  extraEquipment: boolean;
  extraTiresOrRims: string;
  factoryEquipment: boolean;
  illuminatedDashboardSensor: boolean;
  improvementModificationOriginal: boolean;
  mechanicalProblemDetail: boolean;
  mechanicsPhotos: string[];
  mechanicsVideos: any[];
  originalRims: boolean;
  originalTransmissionEngine: boolean;
  performedServicesWithDates: string;
  spareTire: boolean;
  tireBrand: string;
  tireCondition: string;
  tireDate: string;
  tireSize: string;
}
