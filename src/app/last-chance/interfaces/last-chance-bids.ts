export interface LastChanceBids {
  data: LastChanceBidsData;
}

export interface LastChanceBidsData {
  auction: LastChanceBidsAuction;
  meta: LastChanceBidsMeta;
}

export interface LastChanceBidsAuction {
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
  bids: LastChanceBidsBid[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  type: string;
  totalBids: number;
}

export interface LastChanceBidsBid {
  userId: LastChanceBidsUserID;
  bidAmount: number;
  bidDate: string;
  paymentIntentId: string;
  rejected: boolean;
  _id: string;
  userName: string;
}

export interface LastChanceBidsUserID {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface LastChanceBidsMeta {
  totalBids: number;
  currentPage: number;
  pageSize: number;
}
