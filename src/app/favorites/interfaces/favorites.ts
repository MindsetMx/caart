import { AuctionStatus } from "@auctions/enums";
import { FavoritesSource } from "@favorites/enums";

export interface Favorites {
  data: FavoritesData[];
  meta: FavoritesMeta;
}

export interface FavoritesData {
  type: string;
  id: string;
  originalAuctionId: string;
  auctionType: string;
  source: FavoritesSource;
  attributes: FavoritesAttributes;
}

export interface FavoritesAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  title: string;
  startDate: string;
  endDate: string;
  cover: string;
  extract: string;
  status: AuctionStatus;
  sourceLink: string;
  secondsRemaining: number;
  reserveAmount: number;
}

export interface FavoritesMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
