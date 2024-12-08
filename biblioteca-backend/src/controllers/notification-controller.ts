import { Request, Response } from "express";
import Notification from "../models/Notification";

// Listar notificações de um usuário
export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ status: 404, message: "No notifications found for this user." });
    }

    res.status(200).json({ status: 200, data: { notifications } });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ status: 500, message: "Error fetching notifications.", error: error.message });
  }
};

// Criar uma nova notificação
export const createNotification = async (req: Request, res: Response) => {
  const { userId, title, message, type } = req.body;

  try {
    const newNotification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    res.status(201).json({ status: 201, message: "Notification created successfully.", data: { newNotification } });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ status: 500, message: "Error creating notification.", error: error.message });
  }
};

// Marcar uma notificação como lida
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ status: 404, message: "Notification not found." });
    }

    await notification.update({ isRead: true });
    res.status(200).json({ status: 200, message: "Notification marked as read.", data: { notification } });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ status: 500, message: "Error marking notification as read.", error: error.message });
  }
};

// Deletar uma notificação
export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ status: 404, message: "Notification not found." });
    }

    await notification.destroy();
    res.status(200).json({ status: 200, message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ status: 500, message: "Error deleting notification.", error: error.message });
  }
};
