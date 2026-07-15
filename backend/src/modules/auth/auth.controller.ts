import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { completeAgentProfileSchema, completeClientProfileSchema } from "./auth.schema";
import { ApiError } from "../../utils/ApiError";
import { supabaseAdmin } from "../../config/supabase";

// These endpoints take the Supabase access token directly (not requireAgentAuth/
// requireClientAuth) because at this point the domain profile row doesn't exist yet -
// that's exactly what these endpoints create.
async function getSupabaseUserFromHeader(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw ApiError.unauthorized("Missing bearer token");
  const { data, error } = await supabaseAdmin.auth.getUser(header.slice("Bearer ".length));
  if (error || !data.user) throw ApiError.unauthorized("Invalid or expired session");
  return data.user;
}

export const authController = {
  completeAgentProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await getSupabaseUserFromHeader(req);
    const data = completeAgentProfileSchema.parse(req.body);
    const agent = await authService.completeAgentProfile(user.id, user.email!, data);
    res.status(201).json({ success: true, data: agent });
  }),

  completeClientProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await getSupabaseUserFromHeader(req);
    const data = completeClientProfileSchema.parse(req.body);
    const client = await authService.completeClientProfile(user.id, user.email!, data);
    res.status(201).json({ success: true, data: client });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    // req.auth is populated by requireAnyAuth
    if (req.auth!.audience === "agent") {
      res.json({ success: true, data: { ...(await authService.getAgentProfile(req.auth!.authUserId)), audience: "agent" } });
    } else {
      res.json({ success: true, data: { ...(await authService.getClientProfile(req.auth!.authUserId)), audience: "client" } });
    }
  }),
};
