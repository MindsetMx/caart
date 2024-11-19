export interface CheckTokenResponse {
  data: Data;
  meta: Meta;
}

interface Data {
  type: string;
  id: string;
  attributes: User;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  accountVerified: boolean;
  admin: boolean;
}

interface Meta {
  token: string;
}
