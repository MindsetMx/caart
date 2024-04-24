export interface VehicleAuction {
  data: VehicleAuctionData[];
  meta: VehicleAuctionMeta;
}

export interface VehicleAuctionData {
  type: string;
  id: string;
  originalAuctionCarId: string;
  attributes: VehicleAuctionAttributes;
}

export interface VehicleAuctionAttributes {
  brand: string;
  city: string;
  endDate: string;
  extract: string;
  lastBid: number;
  model: string;
  cover: string;
  premium: boolean;
  reserve: boolean;
  state: string;
  year: number;
  title: string;
}

export interface VehicleAuctionMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
