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
  reserveAmount: number;
  reserve: boolean;
}

export interface TentativeArtTitleMeta {
  message: string;
}
