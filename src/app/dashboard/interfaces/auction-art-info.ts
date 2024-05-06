export interface AuctionArtInfo {
  data: AuctionArtInfoData[];
}

export interface AuctionArtInfoData {
  auctionArtId: string;
  year: number;
  name: string;
  wizardSteps: AuctionArtInfoWizardSteps;
  paymentCompleted: boolean;
  carHistoryExists: boolean;
  published: boolean;
}

export interface AuctionArtInfoWizardSteps {
  generalInfo: boolean;
  artDetails: boolean;
}
