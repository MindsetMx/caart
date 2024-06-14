export interface SpecificArtAuction {
  data: SpecificArtAuctionData;
}

export interface SpecificArtAuctionData {
  _id: string;
  originalAuctionArtId: string;
  isWithReserve: boolean;
  reserveCommissionValue: null;
  startDate: Date;
  endDate: Date;
  status: string;
  premium: boolean;
  categories: string[];
  title: string;
  winnerInfo: SpecificAuctionBidWinnerInfo;
  bids: SpecificArtAuctionBid[];
  __v: number;
}

interface SpecificAuctionBidWinnerInfo {
  userId: string;
  amount: number;
  chargeId: string;
  purchaseDate: Date;
}

export interface SpecificArtAuctionBid {
  userId: SpecificArtAuctionUserID;
  bidAmount: number;
  bidTime: string;
  holdAmount: number;
  stripeTransactionId: null | string;
  isHoldActive: boolean;
  winner: boolean;
  paymentMethodId: string;
  _id: string;
  userName: string;
}

export interface SpecificArtAuctionUserID {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}
