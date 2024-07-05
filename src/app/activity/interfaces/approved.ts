import { AuctionTypes } from "@activity/enums";

export interface Approved {
  data: ApprovedData[];
  meta: ApprovedMeta;
}

export interface ApprovedData {
  type: AuctionTypes;
  id: string;
  _id: string;
  attributes: ApprovedAttributes;
}

export interface ApprovedAttributes {
  lote?: number;
  portada: string;
  title: string;
  status: MyAuctionsStatus;
  tiempo?: string;
  reserva: number;
  ofertaMasAlta: number;
}

export interface ApprovedMeta {
  message: string;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export enum MyAuctionsStatus {
  lastChance = 'Última oportunidad',
  liveAuction = 'Subasta en vivo',
}
