export interface AuctionTypes {
  data: AuctionTypesData[];
}

export interface AuctionTypesData {
  type: string;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  amount: number;
  description: string;
  recommended: boolean;
  submessage: string;
}

