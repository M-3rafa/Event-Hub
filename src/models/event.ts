export interface Event {
  id: number;
  name: string;
  date: string;
  isApproved: boolean;
  description: string;
  eventType: string;
  stadiumName?: string;
  teamA?: string;
  teamB?: string;
  performers?: string;
  placeName?: string;
  ticketTypes?: TicketTypeDto[];
  imageUrl?: string;
  securityClearanceUrl?: string;
  publicLicenseFrontUrl?: string;
  publicLicenseBackUrl?: string;
  civilProtectionApprovalFrontUrl?: string;
  civilProtectionApprovalBackUrl?: string;
  eventInsuranceUrl?: string;
  stripePaymentLink?: string;
  adminNote?: string;
  latitude?: number;
  longitude?: number;
}

interface TicketTypeDto {
  name: string;
  price: number;
  quantity: number;
}
