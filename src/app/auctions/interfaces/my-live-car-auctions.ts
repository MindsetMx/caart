export interface MyLiveCarAuctions {
  data: MyLiveCarAuctionsData[];
  meta: MyLiveCarAuctionsMeta;
}

export interface MyLiveCarAuctionsData {
  type: string;
  id: string;
  attributes: MyLiveCarAuctionsAttributes;
}

export interface MyLiveCarAuctionsAttributes {
  originalAuctionCarId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: Date;
  endDate: Date;
  reserveAmount: number;
  bids: MyLiveCarAuctionsBid[];
  status: string;
  categories: string[];
  carDetails: MyLiveCarAuctionsCarDetails;
  cover: string;
}

export interface MyLiveCarAuctionsBid {
  userId: string;
  username: string;
  email: string;
  bidAmount: number;
  _id: string;
  bidTime: Date;
}

export interface MyLiveCarAuctionsCarDetails {
  brand: string;
  year: number;
  carModel: string;
}

export interface MyLiveCarAuctionsMeta {
  total: number;
}
