
export interface GetCarHistory {
  _id: string;
  blocks: GetCarHistoryBlock[];
  originalAuctionCarId: string;
  extract: string;
  extraInfo: string[];
  createdAt: Date;
  __v: number;
}

export interface GetCarHistoryBlock {
  type: string;
  content: string;
  _id: string;
}
