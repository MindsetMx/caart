export interface MyLiveArtAuctions {
  data: MyLiveArtAuctionsData[];
  meta: MyLiveArtAuctionsMeta;
}

export interface MyLiveArtAuctionsData {
  type: string;
  id: string;
  attributes: MyLiveArtAuctionsAttributes;
}

export interface MyLiveArtAuctionsAttributes {
  originalAuctionArtId: string;
  isWithReserve: boolean;
  reserveCommissionValue: null;
  startDate: Date;
  endDate: Date;
  reserveAmount: number;
  bids: MyLiveArtAuctionsBid[];
  status: string;
  categories: string[];
  artDetails: MyLiveArtAuctionsArtDetails;
  cover: string;
}

export interface MyLiveArtAuctionsArtDetails {
  artist: string;
  title: string;
  year: number;
}

export interface MyLiveArtAuctionsBid {
  userId: string;
  username: string;
  email: string;
  bidAmount: number;
  _id: string;
  bidTime: Date;
}

export interface MyLiveArtAuctionsMeta {
  total: number;
}
