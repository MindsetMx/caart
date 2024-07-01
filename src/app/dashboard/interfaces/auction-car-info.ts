export interface AuctionCarInfo {
  data: AuctionCarInfoData[];
}

export interface AuctionCarInfoData {
  aceeptedByUser: boolean;
  auctionCarId: string;
  brand: string;
  model: string;
  year: number;
  wizardSteps: AuctionCarInfoWizardSteps;
  paymentCompleted: boolean;
  published: boolean;
  carHistoryExists: boolean;
  publishImages: boolean;
  status: AuctionCarStatus;
}

export interface AuctionCarInfoWizardSteps {
  generalInfo: boolean;
  exterior: boolean;
  interior: boolean;
  mechanics: boolean;
  extras: boolean;
}

export enum AuctionCarStatus {
  Active = 'active',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Preview = 'preview',
}
