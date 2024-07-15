export interface ArtWizard {
  data: ArtWizardData;
}

export interface ArtWizardData {
  registerArtDetails: ArtWizardRegisterArtDetails;
  artDetails: ArtWizardArtDetails;
}

export interface ArtWizardArtDetails {
  _id: string;
  additionalCharges: ArtWizardDetailsAdditionalCharges[];
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
  reserve: boolean;
  reserveAmount: number;
  rarity: string;
  edition: string;
  height: string;
  width: string;
  depth: string;
  unit: string;
  condition: string;
  postalCode: string;
  state: string;
  userId: string;
  photos: string[];
  videos: any[];
  interest: string;
  acceptTerms: boolean;
  status: string;
  __v: number;
}

export interface ArtWizardDetailsAdditionalCharges {
  chargeType: string;
  amount: number;
  _id: string;
}
