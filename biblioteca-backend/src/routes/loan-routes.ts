import { Router } from "express";
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoanByUserId,
  validateLoan,
} from "../controllers/loan-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { Roles } from "../utils/Roles";
import { rolesValidation } from "../middlewares/roles-validation-middleware";

const router = Router();

router.get("/loans", authMiddleware, rolesValidation([Roles.user, Roles.admin]), getLoans);
router.get("/loans/:id", authMiddleware, rolesValidation([Roles.user, Roles.admin]), getLoanByUserId);
router.get("/loans/:id", authMiddleware, rolesValidation([Roles.user, Roles.admin]), getLoanById);
router.post("/loans", authMiddleware, rolesValidation([Roles.user, Roles.admin]), createLoan);
router.put("/loans/:id", authMiddleware, rolesValidation([Roles.user, Roles.admin]), updateLoan);
router.delete("/loans/:id", authMiddleware, rolesValidation([Roles.user, Roles.admin]), deleteLoan);
router.post("/loans/:id", authMiddleware, rolesValidation([Roles.admin]), validateLoan);

export default router;
