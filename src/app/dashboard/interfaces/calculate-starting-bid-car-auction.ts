export interface CalculateStartingBidCarAuction {
  data: CalculateStartingBidCarAuctionData;
  meta: CalculateStartingBidCarAuctionMeta;
}

export interface CalculateStartingBidCarAuctionData {
  type: string;
  id: string;
  attributes: CalculateStartingBidCarAuctionAttributes;
}

export interface CalculateStartingBidCarAuctionAttributes {
  startingBid: number;
}

export interface CalculateStartingBidCarAuctionMeta {
  message: string;
}
