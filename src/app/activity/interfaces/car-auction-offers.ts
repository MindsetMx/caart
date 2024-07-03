export interface CarAuctionOffers {
  data: CarAuctionOffersData[];
  meta: CarAuctionOffersMeta;
}

export interface CarAuctionOffersData {
  type: string;
  id: string;
  attributes: CarAuctionOffersAttributes;
}

export interface CarAuctionOffersAttributes {
  fecha: Date;
  userName: string;
  bidAmount: number;
}

export interface CarAuctionOffersMeta {
  message: string;
}
