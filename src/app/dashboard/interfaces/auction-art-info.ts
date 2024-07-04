export interface AuctionArtInfo {
  data: AuctionArtInfoData[];
}

export interface AuctionArtInfoData {
  auctionArtId: string;
  year: number;
  name: string;
  wizardSteps: AuctionArtInfoWizardSteps;
  paymentCompleted: boolean;
  artHistoryExists: boolean;
  publishImages: boolean;
  published: boolean;
  status: AuctionArtStatus;
  aceeptedByUser: boolean;
}

export interface AuctionArtInfoWizardSteps {
  generalInfo: boolean;
  artDetails: boolean;
}

export enum AuctionArtStatus {
  Active = 'active',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Preview = 'preview',
}
