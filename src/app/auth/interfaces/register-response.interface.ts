export interface RegisterResponse {
  data: Data;
}

export interface Data {
  attributes: User;
  id: string;
  type: string;
}

export interface User {
  accountVerified: boolean;
  email: string;
  firstName: string;
  lastName: string;
}
