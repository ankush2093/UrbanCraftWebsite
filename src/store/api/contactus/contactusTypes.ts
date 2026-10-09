export interface ContactUsRequest {
  FullName: string;
  Email: string;
  MobileNumber: string;
  Topic: string;
  Message: string;
}

export interface ContactUsResponse {
  status: boolean;
  message: string;
  data: {
    ContactId: number;
    FullName: string;
    Email: string;
    MobileNumber: string;
    Topic: string;
    Message: string;
    IsResolved: boolean;
    CreatedAt: string;
    UpdatedAt: string;
  };
}
