export interface GetAllAuctions {
  data: GetAllAuctionsData[];
  meta: GetAllAuctionsMeta;
}

export interface GetAllAuctionsData {
  _id: string;
  originalAuctionCarId?: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: string;
  endDate: string;
  reserveAmount: number;
  status: string;
  premium: boolean;
  categories: string[];
  bids: GetAllAuctionsBid[];
  __v: number;
  auctionCarDetails?: GetAllAuctionsAuctionCarDetails;
  extract: string;
  lastBidAmount: GetAllAuctionsLastBidAmount;
  originalMemorabiliaId?: string;
  createdAt?: string;
  updatedAt?: string;
  auctionMemorabiliaDetails?: GetAllAuctionsAuctionMemorabiliaDetails;
}

export interface GetAllAuctionsAuctionCarDetails {
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

export interface GetAllAuctionsAuctionMemorabiliaDetails {
  _id: string;
  title: string;
  history: string;
  materials: string;
  dimensions: string;
  hasSignature: boolean;
  hasAuthenticityCertificate: boolean;
  technicalSheet: string;
  state: string;
  city: string;
  reserve: boolean;
  reserveAmount: number;
  photos: string[];
  videos: string[];
  additionalInformation: string;
  userId: string;
  status: string;
  __v: number;
  stateOfMemorabilia: string;
}

export interface GetAllAuctionsBid {
  userId: GetAllAuctionsUserID;
  bidAmount: number;
  bidTime: string;
  holdAmount: number;
  stripeTransactionId: null | string;
  isHoldActive: boolean;
  winner: boolean;
  paymentMethodId: GetAllAuctionsPaymentMethodID;
  _id: string;
}

export enum GetAllAuctionsPaymentMethodID {
  Pm1Owu6RERAnFdCDEdFEFVpugT = "pm_1Owu6rERAnFdCDEdFEFVpugT",
  Pm1Owu7ZERAnFdCDEdmj0E36TT = "pm_1Owu7zERAnFdCDEdmj0E36TT",
  Pm1P1E3BERAnFdCDEd2W7N7X5Q = "pm_1P1e3BERAnFdCDEd2W7n7X5q",
}

export enum GetAllAuctionsUserID {
  The65Fcb14D6354636Fc27Ed50B = "65fcb14d6354636fc27ed50b",
  The65Fcb4D880C1880Cceb8C672 = "65fcb4d880c1880cceb8c672",
  The660Df20743Db2E3543Ab889F = "660df20743db2e3543ab889f",
}

export interface GetAllAuctionsLastBidAmount {
  lastBidAmount: number;
}

export interface GetAllAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

