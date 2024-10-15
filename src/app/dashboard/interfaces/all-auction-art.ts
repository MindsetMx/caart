export interface AllAuctionArt {
  data: AllAuctionArtDatum[];
  meta: AllAuctionArtMeta;
}

export interface AllAuctionArtDatum {
  type: AllAuctionArtType;
  id: string;
  attributes: AllAuctionArtAttributes;
}

export interface AllAuctionArtAttributes {
  artist: string;
  title: string;
  photo: string;
  status: AllAuctionArtStatus;
}

export enum AllAuctionArtStatus {
  Aceptado = "Aceptado",
  Pendiente = "Pendiente",
}

export enum AllAuctionArtType {
  AuctionArt = "auctionArt",
}

export interface AllAuctionArtMeta {
  page: number;
  size: number;
  total: number;
}
