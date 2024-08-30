import { AuctionTypes } from "@activity/enums";

export interface Approved {
  data: ApprovedData[];
  meta: ApprovedMeta;
}

export interface ApprovedData {
  type: AuctionTypes;
  id: string;
  _id: string;
  route: Route;
  attributes: ApprovedAttributes;
}

export enum Route {
  lastChance = 'lastChance',
  active = 'active',
}

export interface ApprovedAttributes {
  bids: ApprovedBids[];
  hasUnreadComments: boolean;
  lote?: number;
  portada: string;
  title: string;
  status: MyAuctionsStatus;
  tiempo?: string;
  startDate: Date;
  reserva: number;
  ofertaMasAlta: number;
  winnerInfo: WinnerInfo;
}

export interface ApprovedBids {
  userId: string;
  bidAmount: number;
  bidDate: Date;
  paymentIntentId: string;
  rejected: boolean;
  _id: string;
  userInfo: ApprovedUserInfo;
}

export interface ApprovedUserInfo {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface WinnerInfo {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  amount: number;
  chargeId: string;
  purchaseDate: Date;
  phoneNumber: string;
}

export interface ApprovedMeta {
  message: string;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export enum MyAuctionsStatus {
  lastChance = 'lastChance',
  liveAuction = 'active',
  sold = 'Vendido',
  preview = 'Preview',
  proxima = 'proxima',
}
