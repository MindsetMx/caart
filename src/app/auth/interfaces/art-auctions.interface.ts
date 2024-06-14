export interface ArtAuctions {
  data: ArtAuctionsData[];
  meta: ArtAuctionsMeta;
}

export interface ArtAuctionsData {
  type: string;
  id: string;
  attributes: ArtAuctionsAttributes;
}

export interface ArtAuctionsAttributes {
  originalAuctionArtId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: Date;
  endDate: Date;
  reserveAmount: number;
  bids: ArtAuctionsBid[];
  status: string;
  categories: string[];
  lastBid: number;
  artDetails: ArtAuctionsArtDetails;
}

export interface ArtAuctionsArtDetails {
  artist: string;
  title: string;
  year: number;
  materials: string;
  category: string;
  otherCategory: string;
  reserve: boolean;
  reserveAmount: number;
  height: string;
  width: string;
  depth: string;
  unit: string;
  condition: string;
  postalCode: string;
  state: string;
  photos: string[];
  videos: any[];
}

export interface ArtAuctionsBid {
  userId: string;
  username: string;
  email: string;
  bidAmount: number;
  _id: string;
}

export interface ArtAuctionsMeta {
  total: number;
}
