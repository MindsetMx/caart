export interface AuctionResults {
  data: AuctionResultsData[];
  meta: AuctionResultsMeta;
}

export interface AuctionResultsData {
  type: string;
  id: string;
  originalAuctionId: string;
  attributes: AuctionResultsAttributes;
}

export interface AuctionResultsAttributes {
  reserve: boolean;
  lastBid: number | null;
  endDate: string;
  title: string;
  cover: string;
  brand?: string;
  model?: string;
  year?: number;
  artist?: string;
  artTitle?: string;
  materials?: string;
  rarity?: string;
  premium: boolean;
  extract: string;
}

export interface AuctionResultsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
