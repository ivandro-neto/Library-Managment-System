import { Router } from "express";
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoanByUserId,
} from "../controllers/loan-controller";

const router = Router();

router.get("/loans", getLoans);
router.get("/loans/:id", getLoanByUserId);
router.get("/loans/:id", getLoanById);
router.post("/loans", createLoan);
router.put("/loans/:id", updateLoan);
router.delete("/loans/:id", deleteLoan);

export default router;
