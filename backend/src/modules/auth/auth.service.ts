import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { sendEmail, emailTemplates } from "../../utils/email";
import { env } from "../../config/env";

export const authService = {
  // Creates the Agent profile row for a Supabase auth user that just signed up
  // on the dashboard's /signup page.
  async completeAgentProfile(authUserId: string, email: string, data: { fullName: string; companyName?: string; phone?: string }) {
    const existing = await prisma.agent.findUnique({ where: { authUserId } });
    if (existing) throw ApiError.conflict("Agent profile already exists for this account");

    const agent = await prisma.agent.create({
      data: { authUserId, email, fullName: data.fullName, companyName: data.companyName, phone: data.phone },
    });
    return agent;
  },

  // Links a freshly created Supabase auth user to an existing Client row (created
  // earlier from an appointment booking). Fails if no Client exists for that email yet,
  // exactly like the "book a viewing first, then create your portal account" flow.
  async completeClientProfile(authUserId: string, email: string, data: { fullName?: string }) {
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      throw ApiError.badRequest("No appointment found for this email yet. Book a viewing first, then create your portal account.");
    }
    if (client.authUserId) {
      throw ApiError.conflict("A portal account already exists for this email.");
    }

    return prisma.client.update({
      where: { email },
      data: { authUserId, ...(data.fullName && { fullName: data.fullName }) },
    });
  },

  async getAgentProfile(authUserId: string) {
    const agent = await prisma.agent.findUnique({ where: { authUserId } });
    if (!agent) throw ApiError.notFound("Agent profile not found");
    return agent;
  },

  async getClientProfile(authUserId: string) {
    const client = await prisma.client.findUnique({ where: { authUserId } });
    if (!client) throw ApiError.notFound("Client profile not found");
    return client;
  },

  // Sent right after a booking to nudge the client toward creating portal access,
  // mirroring the "special link" email in the walkthrough. Points to the Next.js
  // signup page which calls supabase.auth.signUp() and then completeClientProfile.
  async sendPortalInvite(email: string, fullName: string) {
    const link = `${env.clientDashboardUrl}/signup?role=client&email=${encodeURIComponent(email)}`;
    const { subject, html } = emailTemplates.clientPortalWelcome(fullName, link);
    await sendEmail({ to: email, subject, html });
  },
};
