export interface Approved {
  data: ApprovedData[];
  meta: ApprovedMeta;
}

export interface ApprovedData {
  type: string;
  id: string;
  attributes: ApprovedAttributes;
}

export interface ApprovedAttributes {
  lote?: number;
  portada: string;
  title: string;
  status: string;
  tiempo: string;
  reserva: number;
  ofertaMasAlta: number;
}

export interface ApprovedMeta {
  message: string;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
