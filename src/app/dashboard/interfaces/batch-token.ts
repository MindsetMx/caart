export interface BatchToken {
  result: BatchTokenResult;
  success: boolean;
  errors: any[];
  messages: any[];
}

export interface BatchTokenResult {
  token: string;
  expiresAt: Date;
}
