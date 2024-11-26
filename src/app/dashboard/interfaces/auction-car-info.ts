export interface AuctionCarInfo {
  data: AuctionCarInfoData[];
}

export interface AuctionCarInfoData {
  aceeptedByUser: boolean;
  auctionCarId: string;
  brand: string;
  carHistoryExists: boolean;
  comingSoon: boolean;
  model: string;
  paymentCompleted: boolean;
  published: boolean;
  startDate: string;
  endDate: string;
  publishImages: boolean;
  status: AuctionCarStatus;
  wizardSteps: AuctionCarInfoWizardSteps;
  year: number;
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
