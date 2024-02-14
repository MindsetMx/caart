export interface VehicleAuction {
  data: VehicleAuctionData[];
  meta: VehicleAuctionMeta;
}

export interface VehicleAuctionData {
  type: string;
  id: string;
  attributes: VehicleAuctionAttributes;
}

export interface VehicleAuctionAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  endDate: string;
  photos: string[];
  brand: string;
  year: number;
}

export interface VehicleAuctionMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
