export interface LastChanceAuctionVehicleDetail {
  data: LastChanceAuctionVehicleDetailData;
}

export interface LastChanceAuctionVehicleDetailData {
  type: string;
  id: string;
  attributes: LastChanceAuctionVehicleDetailAttributes;
}

export interface LastChanceAuctionVehicleDetailAttributes {
  _id: string;
  originalAuctionCarId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: Date;
  endDate: string;
  reserveAmount: number;
  status: string;
  categories: string[];
  lastBid: number;
  title: string;
  bids: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  extras: LastChanceAuctionVehicleDetailExtras;
  interiorDetails: LastChanceAuctionVehicleDetailInteriorDetails;
  mechanicsDetails: LastChanceAuctionVehicleDetailMechanicsDetails;
  exteriorDetails: LastChanceAuctionVehicleDetailExteriorDetails;
  carHistory: LastChanceAuctionVehicleDetailCarHistory;
  auctionCarForm: LastChanceAuctionVehicleDetailAuctionCarForm;
  dataUser: LastChanceAuctionVehicleDetailDataUser;
}

export interface LastChanceAuctionVehicleDetailAuctionCarForm {
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
  lotNumber: number;
  __v: number;
}

export interface LastChanceAuctionVehicleDetailCarHistory {
  _id: string;
  blocks: LastChanceAuctionVehicleDetailBlock[];
  originalAuctionCarId: string;
  extract: string;
  extraInfo: string;
  createdAt: Date;
  __v: number;
}

export interface LastChanceAuctionVehicleDetailBlock {
  type: string;
  content: string;
  _id: string;
}

export interface LastChanceAuctionVehicleDetailDataUser {
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

export interface LastChanceAuctionVehicleDetailExteriorDetails {
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

export interface LastChanceAuctionVehicleDetailExtras {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  additionalCharges: LastChanceAuctionVehicleDetailAdditionalCharge[];
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

export interface LastChanceAuctionVehicleDetailAdditionalCharge {
  chargeType: string;
  amount: number;
  _id: string;
}

export interface LastChanceAuctionVehicleDetailInteriorDetails {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  interiorColor: string;
  material: string;
  interiorDetails: string;
  interiorPhotos: string[];
  interiorVideos: any[];
}

export interface LastChanceAuctionVehicleDetailMechanicsDetails {
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
