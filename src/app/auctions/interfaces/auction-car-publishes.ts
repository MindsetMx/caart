export interface AuctionCarPublications {
  data: AuctionCarPublicationsData[];
}

export interface AuctionCarPublicationsData {
  type: string;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  status: string;
}

