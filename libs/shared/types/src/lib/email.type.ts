import { z } from 'zod';

export interface IContactFormInput {
  name: string;
  email: string;
  enquiryType: string;
  message: string;
  agreeToTerms: boolean;
}
