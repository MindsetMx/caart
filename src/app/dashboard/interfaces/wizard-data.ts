export interface WizardData {
  data: WizardDataData;
}

export interface WizardDataData {
  registerCarDetails: WizardDataRegisterCarDetails;
  mechanicsDetails: WizardDataMechanicsDetails;
  interiorDetails: WizardDataInteriorDetails;
  exteriorDetails: WizardDataExteriorDetails;
  extrasDetails: WizardDataExtrasDetails;
}

export interface WizardDataExteriorDetails {
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

export interface WizardDataExtrasDetails {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  additionalCharges: WizardDataAdditionalCharge[];
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

export interface WizardDataAdditionalCharge {
  chargeType: string;
  amount: number;
  _id: string;
}

export interface WizardDataInteriorDetails {
  _id: string;
  originalAuctionCarId: string;
  __v: number;
  interiorColor: string;
  material: string;
  interiorDetails: string;
  interiorPhotos?: string[];
  interiorVideos?: any[];
}

export interface WizardDataMechanicsDetails {
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

export interface WizardDataRegisterCarDetails {
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
