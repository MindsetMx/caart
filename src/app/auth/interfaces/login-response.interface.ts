export interface loginResponse {
  userId: string;
  token: string; //TODO pedir al backend que devuelva el token
  accountVerified: boolean;
}
