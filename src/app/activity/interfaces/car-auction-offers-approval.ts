export interface CarAuctionOffersApproval {
  data: CarAuctionOffersApprovalData[];
  meta: CarAuctionOffersApprovalMeta;
}

export interface CarAuctionOffersApprovalData {
  type: CarAuctionOffersApprovalType;
  id: string;
  attributes: CarAuctionOffersApprovalAttributes;
}

export interface CarAuctionOffersApprovalAttributes {
  fecha: Date;
  userName: string;
  bidAmount: number;
  rejected: boolean;
  originalAuctionCarId: string;
  lastChanceAuctionId: string;
}

export enum CarAuctionOffersApprovalType {
  Bid = "bid",
}

export interface CarAuctionOffersApprovalMeta {
  message: string;
}

