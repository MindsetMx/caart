export interface GetLiveArtAuction {
  data: GetLiveArtAuctionData;
}

export interface GetLiveArtAuctionData {
  type: string;
  id: string;
  originalAuctionArtId: string;
  attributes: GetLiveArtAuctionAttributes;
}

export interface GetLiveArtAuctionAttributes {
  reserve: boolean;
  premium: boolean;
  lastBid: number;
  title: string;
  endDate: string;
  cover: string;
  year: number;
  extract: string;
}
