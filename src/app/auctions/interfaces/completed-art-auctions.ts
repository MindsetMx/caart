import { AuctionResultsTypes } from "@app/auction-results/enums";

export interface CompletedArtAuctions {
  data: CompletedArtAuctionsData[];
  meta: CompletedArtAuctionsMeta;
}

export interface CompletedArtAuctionsData {
  type: AuctionResultsTypes;
  id: string;
  originalAuctionArtId: string;
  attributes: CompletedArtAuctionsAttributes;
}

export interface CompletedArtAuctionsAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  endDate: string;
  title: string;
  cover: string;
  year: number;
  extract: string;
}

export interface CompletedArtAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
