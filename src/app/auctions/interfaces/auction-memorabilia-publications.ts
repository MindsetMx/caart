export interface AuctionMemorabiliaPublications {
  data: AuctionMemorabiliaPublicationsData[];
}

export interface AuctionMemorabiliaPublicationsData {
  type: string;
  id: string;
  attributes: AuctionMemorabiliaPublicationsAttributes;
}

export interface AuctionMemorabiliaPublicationsAttributes {
  title: string;
  photo: string;
  status: string;
}
