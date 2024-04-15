export interface UploadCroppedImage {
  result: UploadCroppedImageResult;
  success: boolean;
  errors: any[];
  messages: any[];
}

export interface UploadCroppedImageResult {
  id: string;
  filename: string;
  uploaded: Date;
  requireSignedURLs: boolean;
  variants: string[];
}
