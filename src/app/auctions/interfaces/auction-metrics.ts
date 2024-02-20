export interface AuctionMetrics {
  data: AuctionMetricsData;
}

export interface AuctionMetricsData {
  type: string;
  id: string;
  attributes: AuctionMetricsAttributes;
}

export interface AuctionMetricsAttributes {
  followedCount: number;
  isFollowing: boolean;
  visualizations: number;
}
