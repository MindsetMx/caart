import { AuctionStatus } from "@auctions/enums";

export interface ArtAuction {
  data: ArtAuctionData[];
  meta: ArtAuctionMeta;
}

export interface ArtAuctionData {
  type: string;
  id: string;
  originalAuctionArtId: string;
  attributes: ArtAuctionAttributes;
}

export interface ArtAuctionAttributes {
  premium: boolean;
  lastBid: number;
  title: string;
  endDate: string;
  cover: string;
  year: number;
  extract: string;
  reserve: boolean;
  status: AuctionStatus;
  secondsRemaining: number;
  startDate: string;
  comingSoon: boolean;
}

export interface ArtAuctionMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
