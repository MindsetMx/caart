export interface CalculateStartingBidArtAuction {
  data: CalculateStartingBidArtAuctionData;
  meta: CalculateStartingBidArtAuctionMeta;
}

export interface CalculateStartingBidArtAuctionData {
  type: string;
  id: string;
  attributes: CalculateStartingBidArtAuctionAttributes;
}

export interface CalculateStartingBidArtAuctionAttributes {
  startingBid: number;
}

export interface CalculateStartingBidArtAuctionMeta {
  message: string;
}
