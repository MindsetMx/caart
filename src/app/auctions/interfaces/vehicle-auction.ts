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
  endDate: string;
  extract: string;
  lastBid: number;
  model: string;
  photos: string[];
  premium: boolean;
  reserve: boolean;
  year: number;
}

export interface VehicleAuctionMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
