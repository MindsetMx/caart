export interface CompletedAuctions {
  data: CompletedAuctionsData[];
  meta: CompletedAuctionsMeta;
}

export interface CompletedAuctionsData {
  type: string;
  id: string;
  originalAuctionCarId: string;
  attributes: CompletedAuctionsAttributes;
}

export interface CompletedAuctionsAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  endDate: string;
  cover: string;
  brand: string;
  model: string;
  year: number;
  extract: string;
  state: string;
  city: string;
}

export interface CompletedAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
