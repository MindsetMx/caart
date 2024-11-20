import { AuctionStatus, AuctionTypesAll } from "@auctions/enums";

export interface GetAllAuctions {
  data: GetAllAuctionsData[];
  meta: GetAllAuctionsMeta;
}

export interface GetAllAuctionsData {
  id: string;
  type: AuctionTypesAll;
  originalAuctionId: string;
  attributes: GetAllAuctionsAttributes;
}

export interface GetAllAuctionsAttributes {
  artist?: string;
  artTitle?: string;
  cover: string;
  comingSoon: boolean;
  endDate: string;
  extract: string;
  lastBid: number;
  materials?: string;
  premium: boolean;
  rarity?: string;
  reserve: boolean;
  secondsRemaining: number;
  startDate: string;
  status: AuctionStatus;
  title: string;
}

export interface GetAllAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
