export interface LastChanceCarAuctions {
  data: LastChanceCarAuctionsData[];
  meta: LastChanceCarAuctionsMeta;
}

export interface LastChanceCarAuctionsData {
  type: string;
  id: string;
  attributes: LastChanceCarAuctionsAttributes;
}

export interface LastChanceCarAuctionsAttributes {
  originalAuctionCarId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: Date;
  endDate: Date;
  reserveAmount: number;
  bids: LastChanceCarAuctionsBid[];
  status: string;
  categories: string[];
  lastBid: number;
  carDetails: LastChanceCarAuctionsCarDetails;
}

export interface LastChanceCarAuctionsBid {
  _id: string;
  userId: string;
  username: string;
  email: string;
  bidAmount: number;
}

export interface LastChanceCarAuctionsCarDetails {
  brand: string;
  year: number;
  carModel: string;
  exteriorColor: string;
  interiorColor: string;
  city: string;
  postalCode: string;
  state: string;
  reserve: boolean;
  reserveAmount: number;
  kmType: string;
  kmInput: number;
  transmissionType: string;
  engine: string;
  cover: string;
  videos: string[];
  lotNumber: number;
}

export interface LastChanceCarAuctionsMeta {
  total: number;
}
