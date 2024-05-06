export interface ArtWizard {
  data: ArtWizardData;
}

export interface ArtWizardData {
  registerArtDetails: ArtWizardRegisterArtDetails;
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
