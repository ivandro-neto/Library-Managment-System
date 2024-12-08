import Loan from "../models/Loan";
import type { Request, Response } from "express";

// Listar todos os empréstimos
export const getLoans = async (req: Request, res: Response) => {
  try {
    const loans = await Loan.findAll();

    if (loans.length === 0) {
      return res.status(404).json({ status: 404, message: "No loans found." });
    }

    res.status(200).json({ status: 200, data: { loans } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Failed to fetch loans.", error: error.message });
  }
};

// Obter um empréstimo por ID
export const getLoanById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({ status: 404, message: "Loan not found." });
    }

    res.status(200).json({ status: 200, data: { loan } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error fetching the loan.", error: error.message });
  }
};

// Criar um novo empréstimo
export const createLoan = async (req: Request, res: Response) => {
  const { userId, bookId,dueDate } = req.body;

  try {
    const newLoan = await Loan.create({
      userId,
      bookId,
      dueDate,
    });

    res.status(201).json({ status: 201, message: "Loan created successfully.", data: { newLoan } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error creating loan.", error: error.message });
  }
};

// Atualizar um empréstimo
export const updateLoan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, bookId, dueDate } = req.body;

  try {
    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({ status: 404, message: "Loan not found." });
    }

    await loan.update({ userId, bookId, dueDate });
    res.status(200).json({ status: 200, message: "Loan updated successfully.", data: { loan } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error updating the loan.", error: error.message });
  }
};

// Deletar um empréstimo
export const deleteLoan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({ status: 404, message: "Loan not found." });
    }

    await loan.destroy();
    res.status(200).json({ status: 200, message: "Loan deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error deleting the loan.", error: error.message });
  }
};
