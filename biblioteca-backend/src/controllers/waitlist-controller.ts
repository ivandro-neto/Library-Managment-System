import Waitlist from "../models/Waitlist";
import type { Request, Response } from "express";

// Listar todos os usuários na lista de espera
export const getWaitlistEntries = async (req: Request, res: Response) => {
  try {
    const waitlist = await Waitlist.findAll();

    if (waitlist.length === 0) {
      return res.status(404).json({ status: 404, message: "No waitlist entries found." });
    }

    res.status(200).json({ status: 200, data: { waitlist } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Failed to fetch waitlist entries.", error: error.message });
  }
};

// Obter uma entrada na lista de espera por ID
export const getWaitlistEntryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const entry = await Waitlist.findByPk(id);

    if (!entry) {
      return res.status(404).json({ status: 404, message: "Waitlist entry not found." });
    }

    res.status(200).json({ status: 200, data: { entry } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error fetching the waitlist entry.", error: error.message });
  }
};

// Criar uma nova entrada na lista de espera
export const createWaitlistEntry = async (req: Request, res: Response) => {
  const { userId, bookId, position } = req.body;

  try {
    const newEntry = await Waitlist.create({
      userId,
      bookId,
    });

    res.status(201).json({ status: 201, message: "Waitlist entry created successfully.", data: { newEntry } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error creating waitlist entry.", error: error.message });
  }
};

// Atualizar uma entrada na lista de espera
export const updateWaitlistEntry = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, bookId, position } = req.body;

  try {
    const entry = await Waitlist.findByPk(id);

    if (!entry) {
      return res.status(404).json({ status: 404, message: "Waitlist entry not found." });
    }

    await entry.update({ userId, bookId, position });
    res.status(200).json({ status: 200, message: "Waitlist entry updated successfully.", data: { entry } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error updating the waitlist entry.", error: error.message });
  }
};

// Deletar uma entrada na lista de espera
export const deleteWaitlistEntry = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const entry = await Waitlist.findByPk(id);

    if (!entry) {
      return res.status(404).json({ status: 404, message: "Waitlist entry not found." });
    }

    await entry.destroy();
    res.status(200).json({ status: 200, message: "Waitlist entry deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error deleting the waitlist entry.", error: error.message });
  }
};
