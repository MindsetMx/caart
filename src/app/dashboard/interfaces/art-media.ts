export interface ArtMedia {
  data: ArtMediaData;
}

export interface ArtMediaData {
  registro: ArtMediaRegistro;
  extra: ArtMediaRegistro;
}

export interface ArtMediaRegistro {
  photos: string[];
  videos: string[];
}
