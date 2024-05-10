export interface LastChanceAuctionArtDetail {
  data: LastChanceAuctionArtDetailData;
}

export interface LastChanceAuctionArtDetailData {
  type: string;
  id: string;
  attributes: LastChanceAuctionArtDetailAttributes;
}

export interface LastChanceAuctionArtDetailAttributes {
  _id: string;
  originalAuctionArtId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: Date;
  endDate: string;
  title: string;
  reserveAmount: number;
  status: string;
  categories: string[];
  lastBid: number;
  bids: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  carHistory: LastChanceAuctionArtDetailCarHistory;
  auctionArtForm: LastChanceAuctionArtDetailAuctionArtForm;
  dataUser: LastChanceAuctionArtDetailDataUser;
}

export interface LastChanceAuctionArtDetailAuctionArtForm {
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
  reserveAmount: number;
}

export interface LastChanceAuctionArtDetailCarHistory {
  _id: string;
  blocks: LastChanceAuctionArtDetailBlock[];
  originalAuctionArtId: string;
  extract: string;
  createdAt: Date;
  __v: number;
}

export interface LastChanceAuctionArtDetailBlock {
  type: string;
  content: string;
  _id: string;
}


export interface LastChanceAuctionArtDetailDataUser {
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
