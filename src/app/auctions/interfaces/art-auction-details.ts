export interface ArtAuctionDetails {
  data: ArtAuctionDetailsData;
}

export interface ArtAuctionDetailsData {
  type: string;
  id: string;
  attributes: ArtAuctionDetailsAttributes;
}

export interface ArtAuctionDetailsAttributes {
  _id: string;
  originalAuctionArtId: string;
  isWithReserve: boolean;
  reserveCommissionValue: null;
  startDate: Date;
  endDate: string;
  status: string;
  premium: boolean;
  categories: string[];
  title: string;
  bids: ArtAuctionDetailsBid[];
  __v: number;
  auctionArtForm: ArtAuctionDetailsAuctionArtForm;
  artHistory: ArtHistory;
  dataUser: ArtAuctionDetailsDataUser;
}

export interface ArtAuctionDetailsAuctionArtForm {
  _id: string;
  artist: string;
  title: string;
  year: number;
  materials: string;
  category: string;
  otherCategory: string;
  rarity: string;
  height: string;
  width: string;
  depth: string;
  condition: string;
  origin: string;
  userId: string;
  photos: string[];
  videos: string[];
  acceptTerms: boolean;
  status: string;
  __v: number;
  reserve: boolean;
}

export interface ArtAuctionDetailsBid {
  userId: string;
  bidAmount: number;
  bidTime: Date;
  holdAmount: number;
  stripeTransactionId: null | string;
  isHoldActive: boolean;
  winner: boolean;
  paymentMethodId: string;
  _id: string;
}

export interface ArtHistory {
  _id: string;
  blocks: ArtHistoryBlock[];
  originalAuctionArtId: string;
  extract: string;
  createdAt: Date;
  __v: number;
}

export interface ArtHistoryBlock {
  type: string;
  content: string;
  _id: string;
}

export interface ArtAuctionDetailsDataUser {
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
}