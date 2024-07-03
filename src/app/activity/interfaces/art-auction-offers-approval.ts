export interface ArtAuctionOffersApproval {
  data: ArtAuctionOffersApprovalData[];
  meta: ArtAuctionOffersApprovalMeta;
}

export interface ArtAuctionOffersApprovalData {
  type: string;
  id: string;
  attributes: ArtAuctionOffersApprovalAttributes;
}

export interface ArtAuctionOffersApprovalAttributes {
  fecha: Date;
  userName: string;
  bidAmount: number;
  rejected: boolean;
  originalAuctionArtId: string;
  lastChanceAuctionId: string;
}

export interface ArtAuctionOffersApprovalMeta {
  message: string;
}
