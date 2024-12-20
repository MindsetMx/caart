// Generated by https://quicktype.io

export interface AuctionMemorabiliaDetails {
  data: AuctionMemorabiliaDetailsData;
}

export interface AuctionMemorabiliaDetailsData {
  type: string;
  id: string;
  attributes: AuctionMemorabiliaDetailsAttributes;
}

export interface AuctionMemorabiliaDetailsAttributes {
  _id: string;
  originalMemorabiliaId: string;
  hasAuthenticityCertificate: boolean;
  isWithReserve: boolean;
  comingSoon: boolean;
  startDate: string;
  endDate: string;
  status: string;
  premium: boolean;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  reserveCommissionValue: number;
  reserveAmount: number;
  bids: AuctionMemorabiliaDetailsBid[];
  auctionCarForm: AuctionMemorabiliaDetailsAuctionCarForm;
  extras: AuctionMemorabiliaDetailsExteriorDetails;
  interiorDetails: AuctionMemorabiliaDetailsExteriorDetails;
  mechanicsDetails: AuctionMemorabiliaDetailsExteriorDetails;
  exteriorDetails: AuctionMemorabiliaDetailsExteriorDetails;
  carHistory: AuctionMemorabiliaDetailsCarHistory;
}

export interface AuctionMemorabiliaDetailsAuctionCarForm {
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

export interface AuctionMemorabiliaDetailsBid {
  userId: string;
  bidAmount: number;
  bidTime: string;
  holdAmount: number;
  stripeTransactionId: null | string;
  isHoldActive: boolean;
  winner: boolean;
  paymentMethodId: string;
  _id: string;
}

export interface AuctionMemorabiliaDetailsCarHistory {
  _id: string;
  originalMemorabiliaId: string;
  story: string;
  storyExtract: string;
  technicalSheet: string;
  publishPhotos: string[];
  publishVideos: string[];
  saleRange: string;
  __v: number;
}

export interface AuctionMemorabiliaDetailsExteriorDetails {
}
