export interface loginResponse {
  data: Data;
  meta: Meta;
}

export interface Data {
  type: string;
  id: string;
  attributes: User;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  accountVerified: boolean;
}

interface Meta {
  token: string;
}
