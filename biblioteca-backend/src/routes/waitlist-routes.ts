import { Router } from "express";
import {
  getWaitlistEntries,
  getWaitlistEntryById,
  createWaitlistEntry,
  updateWaitlistEntry,
  deleteWaitlistEntry,
} from "../controllers/waitlist-controller";

const router = Router();

router.get("/waitlist", getWaitlistEntries);
router.get("/waitlist/:id", getWaitlistEntryById);
router.post("/waitlist", createWaitlistEntry);
router.put("/waitlist/:id", updateWaitlistEntry);
router.delete("/waitlist/:id", deleteWaitlistEntry);

export default router;
