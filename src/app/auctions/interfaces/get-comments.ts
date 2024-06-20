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
  createdBy: string;
  dateCreated: string;
  images: string[];
  isBid: boolean;
  isSeller: boolean;
  likedByMe: boolean;
  likesCount: number;
  parentCommentId: null;
  text: string;
}

export interface GetCommentsRelationships {
  responses: any[];
}

