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
}

export interface Steps {
  generalInfo: boolean;
  exterior: boolean;
  interior: boolean;
  mechanics: boolean;
  extras: boolean;
  confirmation: boolean;
}
