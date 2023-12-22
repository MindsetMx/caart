export interface RegisterResponse {
  data: Data;
}

interface Data {
  attributes: User;
  id: string;
  type: string;
}

interface User {
  accountVerified: boolean;
  email: string;
  firstName: string;
  lastName: string;
}
