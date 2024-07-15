export interface GetCarBiddingConditions {
  data: GetCarBiddingConditionsData;
}

export interface GetCarBiddingConditionsData {
  minimumNextBid: number;
  minimumIncrement: number;
  lastBidAmount: number;
  reserve: number;
}
