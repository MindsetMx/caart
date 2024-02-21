export interface BidConditions {
  data: BidConditionsData;
}

export interface BidConditionsData {
  isBidValid: boolean;
  minimumNextBid: number;
  minimumIncrement: number;
  willHoldApply: boolean;
  holdAmount: number;
  disableBidButton: boolean;
}
