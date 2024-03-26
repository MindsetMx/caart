export interface RecentlyCompletedMemorabiliaAuctions {
  data: RecentlyCompletedMemorabiliaAuctionsData[];
  meta: RecentlyCompletedMemorabiliaAuctionsMeta;
}

export interface RecentlyCompletedMemorabiliaAuctionsData {
  type: string;
  id: string;
  attributes: RecentlyCompletedMemorabiliaAuctionsAttributes;
}

export interface RecentlyCompletedMemorabiliaAuctionsAttributes {
  endDate: string;
  categories: string[];
  premium: boolean;
  lastBid: null;
  photos: string[];
  showState: string;
  title: string;
}

export interface RecentlyCompletedMemorabiliaAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
