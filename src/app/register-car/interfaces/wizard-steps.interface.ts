export interface WizardSteps {
  data: WizardStepsData;
}

export interface WizardStepsData {
  type: string;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  steps: Steps;
  currentStep: number;
  originalAuctionCarId: string;
  carDetails: CarDetails;
}

export interface Steps {
  generalInfo: boolean;
  exterior: boolean;
  interior: boolean;
  mechanics: boolean;
  extras: boolean;
  confirmation: boolean;
}

export interface CarDetails {
  type: string;
  brand: string;
  year: number;
  carModel: string;
  exteriorColor: string;
  interiorColor: string;
  city: string;
  postalCode: string;
  reserve: boolean;
  reserveAmount: null;
  kmType: string;
  kmInput: number;
  howDidYouHearAboutUs: string;
  photos: string[];
  interest: string;
  acceptTerms: boolean;
  status: string;
}
