import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book-controller";
import { rolesValidation } from "../middlewares/roles-validation-middleware";
import { authMiddleware } from "../middlewares/auth-middleware";
import { Roles } from "../utils/Roles";

const router = Router();

router.get("/books", authMiddleware, rolesValidation([Roles.user, Roles.admin]), getBooks);
router.get("/books/:id", authMiddleware, rolesValidation([Roles.user, Roles.admin]), getBookById);
router.post("/books", authMiddleware, rolesValidation([Roles.admin]), createBook);
router.put("/books/:id", authMiddleware, rolesValidation([Roles.admin]), updateBook);
router.delete("/books/:id", authMiddleware, rolesValidation([Roles.admin]), deleteBook);

export default router;
