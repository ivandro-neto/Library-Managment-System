import Book from "../models/Book";
import type { Request, Response } from "express";
import Notification from "../models/Notification";
import User from "../models/User";

// Listar todos os livros
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();

    if (books.length === 0) {
      return res.status(404).json({ status: 404, message: "No books found." });
    }

    res.status(200).json({ status: 200, data: { books } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Failed to fetch books.", error: error.message });
  }
};

// Obter um livro por ID
export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ status: 404, message: "Book not found." });
    }

    res.status(200).json({ status: 200, data: { book } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error fetching the book.", error: error.message });
  }
};

// Criar um novo livro
export const createBook = async (req: Request, res: Response) => {
  const { title, author, description, isbn, status, releaseDate } = req.body;

  try {
    // Verificar se o livro já existe
    const bookExists = await Book.findOne({ where: { title } });

    if (bookExists) {
      return res.status(400).json({ status: 400, message: "Book with this title already exists." });
    }

    // Criar o livro
    const newBook = await Book.create({
      title,
      author,
      isbn,
      status,
      description,
      releaseDate
    });

    // Enviar a resposta com o livro criado
    res.status(201).json({
      status: 201,
      message: "Book created successfully.",
      data: { newBook }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Error creating book.",
      error: error.message
    });
  }
};

// Atualizar um livro
export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, releaseDate } = req.body;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ status: 404, message: "Book not found." });
    }

    await book.update({ title, description, releaseDate });
    res.status(200).json({ status: 200, message: "Book updated successfully.", data: { book } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error updating the book.", error: error.message });
  }
};

// Deletar um livro
export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ status: 404, message: "Book not found." });
    }

    await book.destroy();
    res.status(200).json({ status: 200, message: "Book deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error deleting the book.", error: error.message });
  }
};
