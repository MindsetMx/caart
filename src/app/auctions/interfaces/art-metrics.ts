export interface ArtMetrics {
  data: ArtMetricsData;
}

export interface ArtMetricsData {
  type: string;
  id: string;
  attributes: ArtMetricsAttributes;
}

export interface ArtMetricsAttributes {
  visualizations: number;
  followedCount: number;
  isFollowing: boolean;
}
