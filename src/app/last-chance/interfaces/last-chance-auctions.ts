export interface LastChanceAuctions {
  data: LastChanceAuctionsData[];
  meta: LastChanceAuctionsMeta;
}

export interface LastChanceAuctionsData {
  type: string;
  id: string;
  originalAuctionId: string;
  attributes: LastChanceAuctionsAttributes;
}

export interface LastChanceAuctionsAttributes {
  reserve: boolean;
  lastBid: null;
  endDate: null;
  title: string;
  extract: string;
  cover: string;
  premium: boolean;
}

export interface LastChanceAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
