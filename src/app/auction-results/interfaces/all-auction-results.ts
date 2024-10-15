import { AuctionResultsTypes } from "@app/auction-results/enums/auction-results-types.enum";

export interface AuctionResults {
  data: AuctionResultsData[];
  meta: AuctionResultsMeta;
}

export interface AuctionResultsData {
  auctionType: AuctionResultsTypes;
  id: string;
  originalAuctionId: string;
  attributes: AuctionResultsAttributes;
}

export interface AuctionResultsAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  endDate: string;
  title: string;
  cover: string;
  brand: string;
  model: string;
  year: number | string;
  artist: string;
  artTitle: string;
  materials: string;
  category: string;
  rarity: string;
  extract: string;
}

export enum AuctionResultsAuctionType {
  Art = "art",
  Car = "car",
}

export interface AuctionResultsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
