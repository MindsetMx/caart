export interface AuctionCarInfo {
  data: AuctionCarInfoData[];
}

export interface AuctionCarInfoData {
  auctionCarId: string;
  brand: string;
  model: string;
  year: number;
  wizardSteps: AuctionCarInfoWizardSteps;
  paymentCompleted: boolean;
  published: boolean;
  carHistoryExists: boolean;
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
