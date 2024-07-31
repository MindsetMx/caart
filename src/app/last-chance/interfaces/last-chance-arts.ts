export interface LastChanceArts {
  data: LastChanceArtsData[];
  meta: LastChanceArtsMeta;
}

export interface LastChanceArtsData {
  type: string;
  id: string;
  originalAuctionArtId: string;
  attributes: LastChanceArtsAttributes;
}

export interface LastChanceArtsAttributes {
  reserve: boolean;
  lastBid: null;
  endDate: Date;
  photos: string[];
  artist: string;
  title: string;
  year: number;
  extract: string;
  reserveAmount: number;
}

export interface LastChanceArtsMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
