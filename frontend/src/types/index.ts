export interface Property {
  id: string;
  title: string;
  description?: string | null;
  propertyType: string;
  listingType: "SALE" | "RENT";
  status: "AVAILABLE" | "PENDING" | "SOLD" | "RENTED" | "WITHDRAWN";
  price: string;
  priceType: "FIXED" | "MONTHLY";
  bedrooms: number;
  bathrooms: number;
  areaSqft?: string | null;
  addressLine: string;
  amenities: string[];
  images: string[];
  visibleToAiAgent: boolean;
  featured: boolean;
  active: boolean;
  aiAgentId?: string | null;
  createdAt: string;
}

export interface PropertyListResult {
  items: Property[];
  total: number;
  page: number;
  pageSize: number;
  counters: Record<string, number>;
}

export interface AIAgent {
  id: string;
  name: string;
  specialty?: string | null;
  greetingScript: string;
  voiceId?: string | null;
  personality?: string | null;
  active: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  budgetRange?: string | null;
  financing?: string | null;
  createdAt: string;
  appointments?: Appointment[];
}

export interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
}

export interface Appointment {
  id: string;
  type: "VIEWING" | "CONSULTATION";
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "RESCHEDULE_REQUESTED" | "COMPLETED";
  scheduledDate: string;
  durationMinutes: number;
  notes?: string | null;
  paymentStatus: "UNPAID" | "PAY_IN_CASH" | "PAID_ONLINE";
  property: Property;
  client: Client;
  payment?: Payment | null;
  createdAt: string;
}

export interface AppointmentListResult {
  items: Appointment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CallLog {
  id: string;
  callerName?: string | null;
  callerPhone?: string | null;
  direction: "INBOUND" | "OUTBOUND";
  durationSeconds: number;
  outcome: string;
  transcript?: string | null;
  createdAt: string;
  aiAgent: AIAgent;
  property?: Property | null;
}

export interface Website {
  id: string;
  slug: string;
  themeColor: string;
  fontFamily: string;
  heroImage?: string | null;
  heroText?: string | null;
  aiAgentId?: string | null;
  published: boolean;
}
