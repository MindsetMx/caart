export interface UserDetails {
  data: UserDetailsData;
}

export interface UserDetailsData {
  validationImg: any[];
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  sellerType: string;
  country: string;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
  password: string;
  acceptTermsAndConditions: boolean;
  accountVerified: boolean;
  verificationCode: null;
  verificationCodeExpires: null;
  __v: number;
  postalCode: string;
  streetAndNumber: string;
}
