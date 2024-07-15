export interface GetArtBiddingConditions {
  data: GetArtBiddingConditionsData;
}

export interface GetArtBiddingConditionsData {
  minimumNextBid: number;
  minimumIncrement: number;
  lastBidAmount: number;
  reserve: number;
}
