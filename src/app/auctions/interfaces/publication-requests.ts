export interface PublicationRequests {
  data: PublicationRequestsData[];
  meta: PublicationRequestsMeta;
}

export interface PublicationRequestsData {
  type: PublicationRequestsType;
  id: string;
  attributes: PublicationRequestsAttributes;
}

export interface PublicationRequestsAttributes {
  brand: string;
  year: number;
  photo: string;
  status: PublicationRequestsStatus;
}

export enum PublicationRequestsStatus {
  Aceptado = "Aceptado",
  Pendiente = "Pendiente",
}

export enum PublicationRequestsType {
  AuctionCar = "auctionCar",
}

export interface PublicationRequestsMeta {
  page: number;
  size: number;
  total: number;
}
