import { Router } from "express";
import { authController } from "./auth.controller";
import { requireAnyAuth } from "../../middleware/auth";

const router = Router();

// Called once, right after supabase.auth.signUp() on the frontend
router.post("/agent/complete-profile", authController.completeAgentProfile);
router.post("/client/complete-profile", authController.completeClientProfile);

// Returns whichever profile (agent or client) matches the current Supabase session
router.get("/me", requireAnyAuth, authController.me);

export default router;
