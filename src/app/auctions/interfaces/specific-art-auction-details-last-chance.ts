export interface SpecificArtAuctionDetailsLastChance {
  data: SpecificArtAuctionDetailsLastChanceData;
}

export interface SpecificArtAuctionDetailsLastChanceData {
  _id: string;
  originalAuctionArtId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  premium: boolean;
  startDate: Date;
  endDate: Date;
  reserveAmount: number;
  status: string;
  categories: string[];
  lastBid: number;
  title: string;
  bids: SpecificArtAuctionDetailsLastChanceBid[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  type: string;
  winnerInfo: SpecificArtAuctionDetailsLastChanceWinnerInfo;
}

export interface SpecificArtAuctionDetailsLastChanceWinnerInfo {
  userId: string;
  amount: number;
  chargeId: string;
  purchaseDate: Date;
}

export interface SpecificArtAuctionDetailsLastChanceBid {
  userId: SpecificArtAuctionDetailsLastChanceUserID;
  bidAmount: number;
  bidDate: string;
  paymentIntentId: string;
  rejected: boolean;
  _id: string;
  userName: string;
}

export interface SpecificArtAuctionDetailsLastChanceUserID {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}
