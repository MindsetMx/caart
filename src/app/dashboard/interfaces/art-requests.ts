export interface ArtRequests {
  data: ArtRequestsData[];
}

export interface ArtRequestsData {
  id: string;
  type: string;
  attributes: ArtRequestsAttributes;
}

export interface ArtRequestsAttributes {
  artist: string;
  title: string;
  photo: string;
  status: string;
}
