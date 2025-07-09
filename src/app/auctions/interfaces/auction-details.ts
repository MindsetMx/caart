import { AuctionCarStatus } from "@app/dashboard/interfaces";

export interface AuctionDetails {
  data: AuctionDetailsData;
}

export interface AuctionDetailsData {
  type: string;
  id: string;
  attributes: AuctionDetailsAttributes;
}

export interface AuctionDetailsAttributes {
  acceptedBySeller: boolean;
  isOwner: boolean;
  comingSoon: boolean;
  _id: string;
  originalAuctionCarId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: string;
  endDate: string;
  reserveAmount: number;
  status: AuctionCarStatus;
  daysActive: number;
  premium: boolean;
  categories: string[];
  title: string;
  bids: any[];
  __v: number;
  auctionCarForm: AuctionDetailsAuctionCarForm;
  extras: AuctionDetailsExtras;
  interiorDetails: AuctionDetailsInteriorDetails;
  mechanicsDetails: AuctionDetailsMechanicsDetails;
  exteriorDetails: AuctionDetailsExteriorDetails;
  carHistory: AuctionDetailsCarHistory;
  dataUser: AuctionDetailsDataUser;
  secondsRemaining: number;
}

export interface AuctionDetailsAuctionCarForm {
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
  otherTransmission: string;
  engine: string;
  city: string;
  postalCode: string;
  state: string;
  reserve: boolean;
  reserveAmount: number;
  kmType: KmType;
  kmInput: number;
  howDidYouHearAboutUs: string;
  photos: string[];
  videos: any[];
  interest: string;
  acceptTerms: boolean;
  status: string;
  userId: string;
  lotNumber: number;
  __v: number;
}

export enum KmType {
  Kilometrage = 'KM',
  Mileage = 'MI',
}

export interface AuctionDetailsCarHistory {
  _id: string;
  blocks: AuctionDetailsBlock[];
  originalAuctionCarId: string;
  extract: string;
  extraInfo: string[];
  createdAt: Date;
  __v: number;
}

export interface AuctionDetailsBlock {
  type: string;
  content: string;
  _id: string;
}

export interface AuctionDetailsDataUser {
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
  validationImg: string[];
  acceptTermsAndConditions: boolean;
  accountVerified: boolean;
  verificationCode: null;
  verificationCodeExpires: null;
  __v: number;
  postalCode: string;
  streetAndNumber: string;
  taxId: string;
  validationType: string;
  clientId: string;
  defaultPaymentMethodId: string;
}

export interface AuctionDetailsExteriorDetails {
  _id: string;
  originalAuctionCarId: string;
  VIN: string;
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

export interface AuctionDetailsExtras {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  additionalCharges: AuctionDetailsAdditionalCharge[];
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

export interface AuctionDetailsAdditionalCharge {
  chargeType: string;
  amount: number;
  _id: string;
}

export interface AuctionDetailsInteriorDetails {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  interiorColor: string;
  material: string;
  interiorDetails: string;
  interiorPhotos?: string[];
  interiorVideos?: any[];
}

export interface AuctionDetailsMechanicsDetails {
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
  tireDate: Date;
  tireSize: string;
}
