import { CarDetails } from "./car-details.interface";

export interface WizardSteps {
  data: WizardStepsData;
}

interface WizardStepsData {
  type: string;
  id: string;
  attributes: Attributes;
}

interface Attributes {
  steps: Steps;
  currentStep: number;
  originalAuctionCarId: string;
  carDetails: CarDetails;
}

interface Steps {
  generalInfo: boolean;
  exterior: boolean;
  interior: boolean;
  mechanics: boolean;
  extras: boolean;
  confirmation: boolean;
}
