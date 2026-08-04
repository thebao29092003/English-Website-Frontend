export interface CreateContactRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  content: string;
  turnstileToken?: string;
}
