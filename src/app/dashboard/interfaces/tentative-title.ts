
export interface TentativeTitle {
  data: TentativeTitleData;
  meta: TentativeTitleMeta;
}

export interface TentativeTitleData {
  type: string;
  id: string;
  attributes: TentativeTitleAttributes;
}

export interface TentativeTitleAttributes {
  brand: string;
  year: number;
  carModel: string;
  exteriorColor: string;
  engine: string;
}

export interface TentativeTitleMeta {
  message: string;
}
