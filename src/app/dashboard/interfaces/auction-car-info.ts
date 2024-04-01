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
  carHistoryExists: boolean;
}

export interface AuctionCarInfoWizardSteps {
  generalInfo: boolean;
  exterior: boolean;
  interior: boolean;
  mechanics: boolean;
  extras: boolean;
}
