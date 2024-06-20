export interface GetAllAuctions {
  data: GetAllAuctionsData[];
  meta: GetAllAuctionsMeta;
}

export interface GetAllAuctionsData {
  id: string;
  type: string;
  originalAuctionId: string;
  attributes: GetAllAuctionsAttributes;
}

export interface GetAllAuctionsAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  title: string;
  endDate: string;
  cover: string;
  artist?: string;
  artTitle?: string;
  materials?: string;
  rarity?: string;
  extract: string;
}

export interface GetAllAuctionsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
