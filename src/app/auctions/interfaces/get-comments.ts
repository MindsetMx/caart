export interface Relationships {
  responses: GetComments;
}

export interface GetCommentsData {
  type: string;
  id: string;
  attributes: GetCommentsAttributes;
  relationships?: Relationships;
}

export interface GetComments {
  data: GetCommentsData[];
}

export interface GetCommentsAttributes {
  text: string;
  createdBy: string;
  dateCreated: string;
  isBid: boolean;
  isSeller: boolean;
  likesCount: number;
  likedByMe: boolean;
}
