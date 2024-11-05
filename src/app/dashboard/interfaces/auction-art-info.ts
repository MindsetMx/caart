export interface AuctionArtInfo {
  data: AuctionArtInfoData[];
}

export interface AuctionArtInfoData {
  aceeptedByUser: boolean;
  artHistoryExists: boolean;
  auctionArtId: string;
  comingSoon: boolean;
  name: string;
  paymentCompleted: boolean;
  published: boolean;
  publishImages: boolean;
  status: AuctionArtStatus;
  wizardSteps: AuctionArtInfoWizardSteps;
  year: number;
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
