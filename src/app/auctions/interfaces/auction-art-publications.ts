export interface AuctionArtPublications {
  data: AuctionArtPublicationsData[];
}

export interface AuctionArtPublicationsData {
  type: string;
  id: string;
  attributes: AuctionArtPublicationsAttributes;
}

export interface AuctionArtPublicationsAttributes {
  status: string;
  title: string;
  photo: string;
}
