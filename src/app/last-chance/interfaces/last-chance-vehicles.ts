export interface LastChanceVehicles {
  data: LastChanceVehiclesData[];
  meta: LastChanceVehiclesMeta;
}

export interface LastChanceVehiclesData {
  type: string;
  id: string;
  originalAuctionCarId: string;
  attributes: LastChanceVehiclesAttributes;
}

export interface LastChanceVehiclesAttributes {
  reserve: boolean;
  lastBid: null;
  endDate: Date;
  title: string;
  cover: string;
  brand: string;
  model: string;
  year: number;
  extract: string;
  state: string;
  city: string;
}

export interface LastChanceVehiclesMeta {
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
