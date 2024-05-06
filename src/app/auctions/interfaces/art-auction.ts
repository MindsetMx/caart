export interface ArtAuction {
  data: ArtAuctionData[];
  meta: ArtAuctionMeta;
}

export interface ArtAuctionData {
  type: string;
  id: string;
  originalAuctionArtId: string;
  attributes: ArtAuctionAttributes;
}

export interface ArtAuctionAttributes {
  premium: boolean;
  lastBid: null;
  title: string;
  endDate: Date;
  cover: string;
  year: number;
  extract: string;
  reserve: boolean;
}

export interface ArtAuctionMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
