export interface AuctionArtDetails {
  data: AuctionArtDetailsData;
}

export interface AuctionArtDetailsData {
  type: string;
  id: string;
  attributes: AuctionArtDetailsAttributes;
}

export interface AuctionArtDetailsAttributes {
  _id: string;
  artist: string;
  title: string;
  year: number;
  materials: string;
  category: string;
  otherCategory: string;
  reserve: boolean;
  reserveAmount: number;
  rarity: string;
  height: string;
  width: string;
  depth: string;
  unit: string;
  condition: string;
  postalCode: string;
  state: string;
  userId: string;
  photos: string[];
  videos: any[];
  interest: string;
  acceptTerms: boolean;
  status: string;
  __v: number;
}
