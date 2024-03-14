export interface GetComments {
  data: GetCommentsData[];
}

export interface GetCommentsData {
  id: string;
  type: string;
  attributes: GetCommentsAttributes;
  relationships: GetCommentsRelationships;
}

export interface GetCommentsAttributes {
  text: string;
  createdBy: string;
  dateCreated: string;
  isBid: boolean;
  isSeller: boolean;
  likesCount: number;
  likedByMe: boolean;
  parentCommentId: null;
}

export interface GetCommentsRelationships {
  responses: any[];
}

