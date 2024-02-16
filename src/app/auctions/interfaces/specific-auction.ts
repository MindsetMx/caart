export interface SpecificAuction {
  data: SpecificAuctionData;
}

export interface SpecificAuctionData {
  _id: string;
  originalAuctionCarId: string;
  isWithReserve: boolean;
  reserveCommissionValue: number;
  startDate: string;
  endDate: string;
  reserveAmount: number;
  __v: number;
  status: string;
  premium: boolean;
  categories: string[];
  bids: SpecificAuctionBid[];
}

export interface SpecificAuctionBid {
  userId: string;
  bidAmount: number;
  bidTime: string;
  holdAmount: number;
  stripeTransactionId: null;
  isHoldActive: boolean;
  winner: boolean;
  paymentMethodId: string;
  userName: string;
  _id: string;
}

