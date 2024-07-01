export interface CarAuctionPreview {
  data: CarAuctionPreviewData;
  meta: CarAuctionPreviewMeta;
}

export interface CarAuctionPreviewData {
  type: string;
  id: string;
  attributes: CarAuctionPreviewAttributes;
}

export interface CarAuctionPreviewAttributes {
  categories: string[];
  daysActive: number;
  isWithReserve: boolean;
  originalAuctionCarId: string;
  premium: boolean;
  reserveAmount: number;
  reserveCommissionValue: null;
  startingBid: number;
  status: string;
  title: string;
}

export interface CarAuctionPreviewMeta {
  message: string;
}
