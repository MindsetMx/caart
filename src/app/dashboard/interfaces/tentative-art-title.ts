export interface TentativeArtTitle {
  data: TentativeArtTitleData;
  meta: TentativeArtTitleMeta;
}

export interface TentativeArtTitleData {
  type: string;
  id: string;
  attributes: TentativeArtTitleAttributes;
}

export interface TentativeArtTitleAttributes {
  title: string;
  artist: string;
  year: number;
  reserve: boolean;
  reserveAmount: number;
  category: string;
  otherCategory: string;
}

export interface TentativeArtTitleMeta {
  message: string;
}
