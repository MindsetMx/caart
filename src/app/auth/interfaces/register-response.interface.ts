export interface RegisterResponse {
  _id: string;
  acceptTermsAndConditions: boolean;
  accountVerified: boolean;
  city: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  username: string;
  validationImg: any[];
  verificationCode: string;
  verificationCodeExpires: string;
}
