export interface ResendCode {
  data: Data;
  meta: Meta;
}

interface Data {
  type: string;
  id: string;
  attributes: Attributes;
}

interface Attributes {
  success: boolean;
}

interface Meta {
  message: string;
}
