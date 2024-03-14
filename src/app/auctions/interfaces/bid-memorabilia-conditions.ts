export interface BidMemorabiliaConditions {
  data: BidMemorabiliaConditionsData;
}

export interface BidMemorabiliaConditionsData {
  isBidValid: boolean;
  minimumNextBid: number;
  minimumIncrement: number;
  willHoldApply: boolean;
  holdAmount: number;
  disableBidButton: boolean;
}
