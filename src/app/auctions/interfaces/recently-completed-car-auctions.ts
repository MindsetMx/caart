export interface RecentlyCompletedCarAuctions {
  data: RecentlyCompletedCarAuctionsData[];
  meta: RecentlyCompletedCarAuctionsMeta;
}

export interface RecentlyCompletedCarAuctionsData {
  type: string;
  id: string;
  attributes: RecentlyCompletedCarAuctionsAttributes;
}

export interface RecentlyCompletedCarAuctionsAttributes {
  brand: string;
  model: string;
  year: number;
  engine: string;
  endDate: string;
  categories: string[];
  premium: boolean;
  lastBid: number | null;
  photos: string[];
  showState: string;
}

export interface RecentlyCompletedCarAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
