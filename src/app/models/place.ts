export interface Place {
  id: number;
  location: string;
  maxAttendees: number;
  placeTypeName: string;
  price: number;
  imageUrl?: string | null;
  securityClearanceUrl?: string | null;
  ownershipOrRentalContractUrl?: string | null;
  nationalIdFrontUrl?: string | null;
  nationalIdBackUrl?: string | null;
  stripePaymentLink?: string | null;
  isApproved: boolean;
  latitude?: number | null;
  longitude?: number | null;
  adminNote?: string | null;
}

export interface PlaceAvailability {
  id: number;
  date: string;
  isBlocked: boolean;
  note?: string | null;
}
