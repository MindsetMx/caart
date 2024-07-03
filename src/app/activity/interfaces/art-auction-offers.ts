export interface ArtAuctionOffers {
  data: ArtAuctionOffersData[];
  meta: ArtAuctionOffersMeta;
}

export interface ArtAuctionOffersData {
  type: string;
  id: string;
  attributes: ArtAuctionOffersAttributes;
}

export interface ArtAuctionOffersAttributes {
  fecha: Date;
  userName: string;
  bidAmount: number;
}

export interface ArtAuctionOffersMeta {
  message: string;
}
