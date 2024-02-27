export interface GetComments {
  data: GetCommentsData[];
}
export interface GetCommentsRelationships {
  responses: GetCommentsData[];
}

export interface GetCommentsData {
  _id: string;
  text: string;
  createdBy: string;
  dateCreated: string;
  isBid: boolean;
  isSeller: boolean;
  likesCount: number;
  likedByMe: boolean;
  relationships: GetCommentsRelationships;
  parentCommentId?: string;
}
