export interface GetLiveAuctions {
  data: GetLiveAuctionsData[];
  meta: GetLiveAuctionsMeta;
}

export interface GetLiveAuctionsData {
  _id: string;
  type: string;
  id: string;
  attributes: GetLiveAuctionsAttributes;
}

export interface GetLiveAuctionsAttributes {
  lote: number;
  portada: string;
  title: string;
  status: string;
  tiempo?: string;
  reserva: number;
  ofertaMasAlta: number;
  startDate: string;
  endDate: string;
}

export interface GetLiveAuctionsMeta {
  message: string;
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
