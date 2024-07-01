export interface ArtAuctionPreview {
  data: ArtAuctionPreviewData;
  meta: ArtAuctionPreviewMeta;
}

export interface ArtAuctionPreviewData {
  type: string;
  id: string;
  attributes: ArtAuctionPreviewAttributes;
}

export interface ArtAuctionPreviewAttributes {
  originalAuctionArtId: string;
  isWithReserve: boolean;
  reserveCommissionValue: null;
  daysActive: number;
  title: string;
  status: string;
  reserveAmount: number;
  startingBid: number;
  premium: boolean;
  categories: string[];
}

export interface ArtAuctionPreviewMeta {
  message: string;
}
