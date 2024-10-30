export interface GetAllCarMedia {
  data: GetAllCarMediaData;
}

export interface GetAllCarMediaData {
  registro: GetAllCarMediaUrls;
  mecanicas: GetAllCarMediaUrls;
  interior: GetAllCarMediaUrls;
  exterior: GetAllCarMediaUrls;
  extra: GetAllCarMediaUrls;
  videos: string[];
}

export interface GetAllCarMediaUrls {
  photos: string[];
  videos: string[];
}
