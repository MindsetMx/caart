export interface SpecificMemorabiliaAuction {
  data: SpecificMemorabiliaAuctionData;
}

export interface SpecificMemorabiliaAuctionData {
  _id: string;
  originalMemorabiliaId: string;
  isWithReserve: boolean;
  startDate: string;
  endDate: string;
  status: string;
  premium: boolean;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  reserveCommissionValue: number;
  reserveAmount: number;
  winnerInfo: SpecificAuctionBidWinnerInfo;
  bids: SpecificMemorabiliaAuctionBid[];
}

interface SpecificAuctionBidWinnerInfo {
  userId: string;
  amount: number;
  chargeId: string;
  purchaseDate: Date;
}

export interface SpecificMemorabiliaAuctionBid {
  userId: SpecificMemorabiliaAuctionUserID;
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

export interface SpecificMemorabiliaAuctionUserID {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

