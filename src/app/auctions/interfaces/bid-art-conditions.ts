export interface BidArtConditions {
  data: BidArtConditionsData;
}

export interface BidArtConditionsData {
  isBidValid: boolean;
  minimumNextBid: number;
  minimumIncrement: number;
  willHoldApply: boolean;
  holdAmount: number;
  disableBidButton: boolean;
}
