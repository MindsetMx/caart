export interface PersonalData {
  data: PersonalDataData;
}

export interface PersonalDataData {
  type: string;
  id: string;
  attributes: PersonalDataAttributes;
}

export interface PersonalDataAttributes {
  firstName: string;
  lastName: string;
  username: string;
  sellerType: string;
  country: string;
  city: string;
  state: string;
}

