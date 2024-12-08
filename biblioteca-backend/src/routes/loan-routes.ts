import { Router } from "express";
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
} from "../controllers/loan-controller";

const router = Router();

router.get("/loans", getLoans);
router.get("/loans/:id", getLoanById);
router.post("/loans", createLoan);
router.put("/loans/:id", updateLoan);
router.delete("/loans/:id", deleteLoan);

export default router;
