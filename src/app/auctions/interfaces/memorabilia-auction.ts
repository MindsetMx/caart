export interface MemorabiliaAuction {
  data: MemorabiliaAuctionData[];
  meta: MemorabiliaAuctionMeta;
}

export interface MemorabiliaAuctionData {
  type: string;
  id: string;
  originalMemorabiliaId: string;
  attributes: MemorabiliaAuctionAttributes;
}

export interface MemorabiliaAuctionAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: null;
  endDate: string;
  photos: string[];
  title: string;
  stateOfMemorabilia: string;
  extract: string;
  state: string;
  city: string;
}

export interface MemorabiliaAuctionMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

