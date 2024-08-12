export interface GetComments {
  data: GetCommentsData[];
  meta: GetCommentsMeta;
}

export interface GetCommentsMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
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
  read: boolean;
}

export interface GetCommentsRelationships {
  responses: any[];
}

