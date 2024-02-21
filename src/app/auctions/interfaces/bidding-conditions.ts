export interface BiddingConditions {
  biddingConditions: BiddingConditions;
}

export interface BiddingConditions {
  data: BiddingConditionsData;
}

export interface BiddingConditionsData {
  minimumNextBid: number;
  minimumIncrement: number;
  lastBidAmount: number;
}

