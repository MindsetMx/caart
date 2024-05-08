export interface BiddingArtConditions {
  data: BiddingArtConditionsData;
}

export interface BiddingArtConditionsData {
  minimumNextBid: number;
  minimumIncrement: number;
  lastBidAmount: number;
}
