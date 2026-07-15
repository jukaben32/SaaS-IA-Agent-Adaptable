import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/db";
import { env } from "../config/env";

export type AuthAudience = "agent" | "client";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        id: string; // our domain id (Agent.id or Client.id), NOT the Supabase auth user id
        authUserId: string; // Supabase auth.users.id
        email: string;
        role?: string;
        audience: AuthAudience;
      };
    }
  }
}

function extractBearerToken(req: Request): string {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing bearer token");
  }
  return header.slice("Bearer ".length);
}

// Verifies the Supabase-issued access token and returns the Supabase auth user
async function getSupabaseUser(token: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) throw ApiError.unauthorized("Invalid or expired session");
  return data.user;
}

// Requires a valid Supabase session AND a matching Agent profile row (dashboard user)
export async function requireAgentAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req);
    const user = await getSupabaseUser(token);

    const agent = await prisma.agent.findUnique({ where: { authUserId: user.id } });
    if (!agent) throw ApiError.forbidden("No agent profile found for this account");

    req.auth = { id: agent.id, authUserId: user.id, email: agent.email, role: agent.role, audience: "agent" };
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : ApiError.unauthorized("Invalid or expired agent session"));
  }
}

// Requires a valid Supabase session AND a matching Client profile row (portal user)
export async function requireClientAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req);
    const user = await getSupabaseUser(token);

    const client = await prisma.client.findUnique({ where: { authUserId: user.id } });
    if (!client) throw ApiError.forbidden("No client profile found for this account");

    req.auth = { id: client.id, authUserId: user.id, email: client.email, audience: "client" };
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : ApiError.unauthorized("Invalid or expired client session"));
  }
}

// Accepts either an Agent or a Client session (e.g. shared read/cancel endpoints)
export async function requireAnyAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req);
    const user = await getSupabaseUser(token);

    const agent = await prisma.agent.findUnique({ where: { authUserId: user.id } });
    if (agent) {
      req.auth = { id: agent.id, authUserId: user.id, email: agent.email, role: agent.role, audience: "agent" };
      return next();
    }

    const client = await prisma.client.findUnique({ where: { authUserId: user.id } });
    if (client) {
      req.auth = { id: client.id, authUserId: user.id, email: client.email, audience: "client" };
      return next();
    }

    throw ApiError.forbidden("No profile found for this account");
  } catch (err) {
    next(err instanceof ApiError ? err : ApiError.unauthorized("Invalid or expired session"));
  }
}

// Gate for the voice AI orchestrator / internal webhooks (not a Supabase user)
export function requireServiceKey(req: Request, _res: Response, next: NextFunction) {
  const key = req.headers["x-service-key"];
  if (!key || key !== env.aiServiceKey) {
    return next(ApiError.unauthorized("Invalid service key"));
  }
  next();
}
