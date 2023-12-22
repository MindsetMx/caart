export interface loginResponse {
  data: Data;
  meta: Meta;
}

interface Data {
  type: string;
  id: string;
  attributes: User;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  accountVerified: boolean;
}

interface Meta {
  token: string;
}
