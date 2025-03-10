import Book from "../models/Book";
import Loan from "../models/Loan";
import type { Request, Response } from "express";
import Waitlist from "../models/WaitList";

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
export const getLoanByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const loan = await Loan.findAll({where: {userId : id}});

    if (!loan) {
      return res.status(404).json({ status: 404, message: "Loan not found." });
    }

    res.status(200).json({ status: 200, data: { loan } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error fetching the loan.", error: error.message });
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
  const { userId, bookId, dueDate } = req.body;

  try {
    // Verificar se o livro existe
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        status: 404,
        message: "Book not found.",
      });
    }
    if(book.quantity < 1)
      await book.update({status : 'reserved'});
    // Verificar se o livro está disponível
    if (book.status === 'reserved') {
      // Adicionar à lista de espera
      const newEntry = await Waitlist.create({
        userId,
        bookId,
      });
      
      return res.status(201).json({
        status: 201,
        message: "You joined the waitlist for this book.",
        data: { newEntry },
      });
    } 
    const loan = await Loan.findOne({where:{userId, bookId}})
    if(loan)
      return res.status(401).json({
        status: 401,
        message: "You cannot loan the same book twice, return the book first to make it available again.",
      }); 
    // Criar empréstimo
      const newLoan = await Loan.create({
        userId,
        bookId,
        dueDate,
      });

     const bookQnt =  book.quantity-1;
      await book.update({ quantity: bookQnt, status: bookQnt < 1 ? 'reserved': book.status});
      
      return res.status(201).json({
        status: 201,
        message: "Loan created successfully.",
        data: { newLoan },
      });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Error creating loan.",
      error: error.message,
    });
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
    const book = await Book.findByPk(loan.bookId);
    const bookQnt = book.quantity +1;
    await book?.update({quantity: bookQnt, status : 'available'});
    await loan.destroy();
    res.status(200).json({ status: 200, message: "Loan deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error deleting the loan.", error: error.message });
  }
};

export const validateLoan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {code} = req.body;

  try {
    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({ status: 404, message: "Loan not found." });
    }
    const book = await Book.findByPk(loan.bookId);
    if (code !== loan.code) {
      return res.status(401).json({ status: 401, message: "Invalide code." });
    }
    if(loan.status === 'returned')
      return res.status(401).json({ status: 401, message: "You already returned this book." });
    await loan.update({status: 'returned', dueDate: new Date()});
    const bookQnt = book.quantity +1;
    await book?.update({quantity: bookQnt, status : 'available'});
    res.status(200).json({ status: 200, message: "Loan returned successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error returning the loan.", error: error.message });
  }
};