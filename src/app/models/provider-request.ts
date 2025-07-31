export interface ProviderRequest {
  id: number;
  userId: string;
  userName: string;
  email: string;
  nationalIdFrontUrl: string;
  nationalIdBackUrl: string;
  holdingIdUrl: string;
  stripePaymentLink: string | null;
  requestedAt: string;
  isApproved: boolean | null;
  adminNote: string | null;
}
