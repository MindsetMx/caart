export interface AuctionArtWizardSteps {
  data: AuctionArtWizardStepsData;
}

export interface AuctionArtWizardStepsData {
  type: string;
  id: string;
  attributes: AuctionArtWizardStepsAttributes;
}

export interface AuctionArtWizardStepsAttributes {
  steps: AuctionArtWizardStepsSteps;
  currentStep: number;
  completed: boolean;
  artDetails: AuctionArtWizardStepsArtDetails;
}

export interface AuctionArtWizardStepsArtDetails {
  title: string;
  photos: string[];
}

export interface AuctionArtWizardStepsSteps {
  payment: boolean;
}
