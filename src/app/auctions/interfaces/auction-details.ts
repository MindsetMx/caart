export interface AuctionDetails {
  data: AuctionDetailsData;
}

export interface AuctionDetailsData {
  type: string;
  id: string;
  attributes: AuctionDetailsAttributes;
}

export interface AuctionDetailsAttributes {
  __v: number;
  _id: string;
  auctionCarForm: AuctionCarForm;
  bids: Bid[];
  carHistory: CarHistory;
  categories: string[];
  dataUser: dataUser;
  endDate: string;
  exteriorDetails: ExteriorDetails;
  extras: Extras;
  interiorDetails: InteriorDetails;
  internalNumber: string;
  isWithReserve: boolean;
  mechanicsDetails: MechanicsDetails;
  originalAuctionCarId: string;
  premium: boolean;
  reserveAmount: number;
  reserveCommissionValue: number;
  startDate: string;
  status: string;
}
export interface dataUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  sellerType: string;
  country: string;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
  password: string;
  taxId: string;
  streetAndNumber: string;
  postalCode: string;
  validationType: string;
  validationImg: string[];
  acceptTermsAndConditions: boolean;
  accountVerified: boolean;
  verificationCode: null;
  verificationCodeExpires: null;
  __v: number;
  clientId: string;
}

export interface CarHistory {
  _id: string;
  additionalCharges: string;
  additionalInfo: string;
  content: string;
  originalAuctionCarId: string;
  createdAt: string;
  extraInfo: string;
}

export interface AuctionCarForm {
  __v: number;
  _id: string;
  acceptTerms: boolean;
  brand: string;
  carModel: string;
  city: string;
  engine: string;
  exteriorColor: string;
  generalCondition: string;
  howDidYouHearAboutUs: string;
  interest: string;
  interiorColor: string;
  kmInput: number;
  kmType: string;
  lotNumber: string;
  otherTransmission: null;
  photos: string[];
  postalCode: string;
  reserve: boolean;
  reserveAmount: number;
  specificColor: string;
  state: string;
  status: string;
  transmissionType: string;
  type: string;
  userId: string;
  videos: any[];
  year: number;
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
