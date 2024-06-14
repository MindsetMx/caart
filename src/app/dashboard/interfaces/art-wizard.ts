export interface ArtWizard {
  data: ArtWizardData;
}

export interface ArtWizardData {
  registerArtDetails: ArtWizardRegisterArtDetails;
  artDetails: ArtWizardArtDetails;
}

export interface ArtWizardArtDetails {
  _id: string;
  certificadoAutenticidad: boolean;
  entidadCertificado: string;
  entregaConMarco: boolean;
  firmaArtista: boolean;
  procedenciaObra: string;
  historiaArtista: string;
  originalAuctionArtId: string;
  photos: any[];
  videos: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ArtWizardRegisterArtDetails {
  _id: string;
  artist: string;
  title: string;
  year: number;
  materials: string;
  category: string;
  otherCategory: string;
  rarity: string;
  height: string;
  width: string;
  depth: string;
  condition: string;
  origin: string;
  userId: string;
  photos: string[];
  videos: string[];
  acceptTerms: boolean;
  status: string;
  __v: number;
}
