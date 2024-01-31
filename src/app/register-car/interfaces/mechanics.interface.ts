export interface Mechanics {
  data: MechanicsData;
}

export interface MechanicsData {
  type: string;
  attributes: MechanicsAttributes;
}

export interface MechanicsAttributes {
  originalRims: boolean;
  tireBrand: string;
  tireSize: string;
  tireDate: string;
  tireCondition: string;
  extraTiresOrRims: string;
  spareTire: boolean;
  originalTransmissionEngine: boolean;
  improvementModificationOriginal: boolean;
  performedServicesWithDates: string;
  mechanicalProblemDetail: boolean;
  illuminatedDashboardSensor: boolean;
  factoryEquipment: boolean;
  extraEquipment: boolean;
  comments: string;
  mechanicsPhotos: string[];
  mechanicsVideos: any[];
}
