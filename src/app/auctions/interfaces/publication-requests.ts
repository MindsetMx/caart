export interface PublicationRequests {
  data: PublicationRequestsData[];
}

export interface PublicationRequestsData {
  type: string;
  id: string;
  attributes: Attributes;
  status: string;
}

export interface Attributes {
  status: string;
  brand: string;
  year: number;
  photo: string;
}
