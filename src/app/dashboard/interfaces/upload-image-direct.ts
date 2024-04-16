export interface UploadImageDirect {
  result: UploadImageDirectResult;
  success: boolean;
  errors: any[];
  messages: any[];
}

export interface UploadImageDirectResult {
  id: string;
  uploadURL: string;
}
