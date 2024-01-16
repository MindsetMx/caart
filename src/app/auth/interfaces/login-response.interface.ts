export interface loginResponse {
  data: UserData;
  meta: Meta;
}

export interface UserData {
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
