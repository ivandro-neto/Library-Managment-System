import { Router } from "express";
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

// Listar notificações de um usuário
router.get("/notifications/:userId", authMiddleware, getNotifications);

// Criar uma nova notificação
router.post("/notifications", authMiddleware, createNotification);

// Marcar uma notificação como lida
router.patch("/notifications/:id/read", authMiddleware, markNotificationAsRead);

// Deletar uma notificação
router.delete("/notifications/:id", authMiddleware, deleteNotification);

export default router;
