import { AuctionStatus } from "@auctions/enums";

export interface GetLiveCarAuction {
  data: GetLiveCarAuctionData;
}

export interface GetLiveCarAuctionData {
  type: string;
  id: string;
  originalAuctionCarId: string;
  attributes: GetLiveCarAuctionAttributes;
}

export interface GetLiveCarAuctionAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  title: string;
  endDate: string;
  brand: string;
  model: string;
  year: number;
  extract: string;
  state: string;
  city: string;
  cover: string;
  status: AuctionStatus;
}
