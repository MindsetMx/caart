export interface FollowAuction {
  data: FollowAuctionData;
  meta: FollowAuctionMeta;
}

export interface FollowAuctionData {
  type: string;
  id: string;
  attributes: FollowAuctionAttributes;
}

export interface FollowAuctionAttributes {
  isFollowing: boolean;
}

export interface FollowAuctionMeta {
  message: string;
}
