export interface GetBids {
  data: GetBidsData;
}

export interface GetBidsData {
  bids: GetBidsBid[];
  totalBids: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetBidsBid {
  userId: GetBidsUserID;
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

export interface GetBidsUserID {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}
