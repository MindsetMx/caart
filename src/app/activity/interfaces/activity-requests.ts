export interface ActivityRequests {
  data: ActivityRequestsData[];
  meta: ActivityRequestsMeta;
}

export interface ActivityRequestsData {
  type: ActivityRequestsType;
  id: string;
  attributes: ActivityRequestsAttributes;
}

export interface ActivityRequestsAttributes {
  marca?: string;
  modelo?: string;
  año: number;
  lote?: number;
  status: ActivityRequestsStatus;
  porcentaje: number;
  solicitud: boolean;
  pago: boolean;
  formularios: boolean;
  autorizacion: boolean;
  enVivo: boolean;
  artista?: string;
  titulo?: string;
  portada: string;
  auctionPaymentId: string;
  auctionLiveId: string;
}

export enum ActivityRequestsStatus {
  Accepted = "accepted",
  Pending = "pending",
  rejected = "rejected",
}

export enum ActivityRequestsType {
  Arte = "arte",
  Autos = "autos",
}

export interface ActivityRequestsMeta {
  message: string;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
