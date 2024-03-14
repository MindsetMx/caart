export interface BiddingMemorabiliaConditions {
  data: BiddingMemorabiliaConditionsData;
}

export interface BiddingMemorabiliaConditionsData {
  minimumNextBid: number;
  minimumIncrement: number;
  lastBidAmount: number;
}
