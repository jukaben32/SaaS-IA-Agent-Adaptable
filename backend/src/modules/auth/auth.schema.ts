import { z } from "zod";

// Called right after supabase.auth.signUp() on the frontend, using the session
// access token to identify the Supabase user this profile belongs to.
export const completeAgentProfileSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  phone: z.string().optional(),
});

// Client accounts are created implicitly the first time someone books an appointment
// (see appointments.service.ts). This endpoint links that existing Client row to a
// freshly created Supabase auth user - mirrors "create your account with the same
// email you used for booking" from the product walkthrough.
export const completeClientProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
});
