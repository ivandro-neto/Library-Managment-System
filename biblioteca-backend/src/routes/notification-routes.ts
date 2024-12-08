import { Router } from "express";
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification-controller";

const router = Router();

// Listar notificações de um usuário
router.get("notifications/:userId", getNotifications);

// Criar uma nova notificação
router.post("notifications/", createNotification);

// Marcar uma notificação como lida
router.patch("notifications/:id/read", markNotificationAsRead);

// Deletar uma notificação
router.delete("notifications/:id", deleteNotification);

export default router;
