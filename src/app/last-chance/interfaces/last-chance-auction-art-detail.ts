export interface LastChanceAuctionArtDetail {
  data: LastChanceAuctionArtDetailData;
}

export interface LastChanceAuctionArtDetailData {
  type: string;
  id: string;
  attributes: LastChanceAuctionArtDetailAttributes;
}

export interface LastChanceAuctionArtDetailAttributes {
  __v: number;
  _id: string;
  artDetail: LastChanceAuctionArtDetailArtDetail;
  auctionArtForm: LastChanceAuctionArtDetailAuctionArtForm;
  bids: any[];
  carHistory: LastChanceAuctionArtDetailCarHistory;
  categories: string[];
  createdAt: Date;
  dataUser: LastChanceAuctionArtDetailDataUser;
  endDate: string;
  isWithReserve: boolean;
  lastBid: number;
  originalAuctionArtId: string;
  reserveAmount: number;
  reserveCommissionValue: number;
  startDate: Date;
  status: string;
  title: string;
  updatedAt: Date;
}

export interface LastChanceAuctionArtDetailArtDetail {
  _id: string;
  certificadoAutenticidad: boolean;
  entidadCertificado: string;
  entregaConMarco: boolean;
  firmaArtista: boolean;
  procedenciaObra: string;
  historiaArtista: string;
  originalAuctionArtId: string;
  photos: any[];
  videos: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}


export interface LastChanceAuctionArtDetailAuctionArtForm {
  _id: string;
  artist: string;
  title: string;
  unit: string;
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
  extraInfo: string[];
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
