export interface CompletedAuctions {
  data: CompletedAuctionsData[];
  meta: CompletedAuctionsMeta;
}

export interface CompletedAuctionsData {
  type: string;
  id: string;
  originalAuctionId: string;
  attributes: CompletedAuctionsAttributes;
}

export interface CompletedAuctionsAttributes {
  brand: string;
  // city: string;
  cover: string;
  endDate: string;
  extract: string;
  lastBid: number;
  // model: string;
  premium: boolean;
  reserve: boolean;
  // state: string;
  title: string;
  year: number;
}

export interface CompletedAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
