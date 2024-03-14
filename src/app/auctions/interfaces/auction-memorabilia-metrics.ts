export interface AuctionMemorabiliaMetrics {
  data: AuctionMemorabiliaMetricsData;
}

export interface AuctionMemorabiliaMetricsData {
  type: string;
  id: string;
  attributes: AuctionMemorabiliaMetricsAttributes;
}

export interface AuctionMemorabiliaMetricsAttributes {
  visualizations: number;
  followedCount: number;
  isFollowing: boolean;
}
