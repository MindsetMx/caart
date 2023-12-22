export interface VerifiedAccount {
  data: Data;
  meta: Meta;
}

interface Data {
  type: string;
  id: string;
  attributes: Attributes;
}

interface Attributes {
  accountVerified: boolean;
}

interface Meta {
  message: string;
}
