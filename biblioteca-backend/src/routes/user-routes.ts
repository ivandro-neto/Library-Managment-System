import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user-controller";
import {authMiddleware} from "../middlewares/auth-middleware"; // Middleware de autenticação
import { rolesValidation } from "../middlewares/roles-validation-middleware";
import { Roles } from "../utils/Roles";

const router = Router();

router.get("/users", authMiddleware, rolesValidation([Roles.admin]), getUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.post("/users", authMiddleware, rolesValidation([Roles.admin]), createUser);
router.put("/users/:id", authMiddleware, rolesValidation([Roles.admin]), updateUser);
router.delete("/users/:id", authMiddleware, rolesValidation([Roles.admin]), deleteUser);

export default router;
