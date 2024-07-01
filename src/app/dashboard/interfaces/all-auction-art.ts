export interface AllAuctionArt {
  data: AllAuctionArtData[];
}

export interface AllAuctionArtData {
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
