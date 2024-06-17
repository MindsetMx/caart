export interface SpecificCarAuctionDetailsLastChance {
  data: SpecificCarAuctionDetailsLastChanceData;
}

export interface SpecificCarAuctionDetailsLastChanceData {
  _id: string;
  originalAuctionCarId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: Date;
  endDate: Date;
  reserveAmount: number;
  status: string;
  categories: string[];
  lastBid: number;
  title: string;
  bids: SpecificCarAuctionDetailsLastChanceBid[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  premium: boolean;
  type: string;
  winnerInfo: SpecificCarAuctionDetailsLastChanceWinnerInfo;
}

export interface SpecificCarAuctionDetailsLastChanceWinnerInfo {
  userId: string;
  amount: number;
  chargeId: string;
  purchaseDate: Date;
}

export interface SpecificCarAuctionDetailsLastChanceBid {
  userId: SpecificCarAuctionDetailsLastChanceUserID;
  bidAmount: number;
  bidDate: string;
  paymentIntentId: string;
  rejected: boolean;
  _id: string;
  userName: string;
}

export interface SpecificCarAuctionDetailsLastChanceUserID {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}
