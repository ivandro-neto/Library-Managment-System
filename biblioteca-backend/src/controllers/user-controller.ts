import User from "../models/User";
import type { Request, Response } from "express";

// Listar todos os usuários
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();

    if (users.length === 0) {
      return res.status(404).json({ status: 404, message: "No users found." });
    }

    res.status(200).json({ status: 200, data: { users } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Failed to fetch users.", error: error.message });
  }
};

// Obter um usuário por ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    res.status(200).json({ status: 200, data: { user } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error fetching the user.", error: error.message });
  }
};

// Criar um novo usuário
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, roles } = req.body;

  try {
    // Verificar se o usuário já existe com o mesmo nome de usuário
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ status: 400, message: "Username is already in use." });
    }

    // Criar o novo usuário
    const newUser = await User.create({
      username,
      email,
      password,
      roles: roles || ["user"], // Se não for fornecido, atribui o papel padrão 'user'
    });

    res.status(201).json({ status: 201, message: "User created successfully.", data: { newUser } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error creating user.", error: error.message });
  }
};

// Atualizar um usuário
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password, roles } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    // Atualizar os dados do usuário
    await user.update({ username, password, roles });
    
    res.status(200).json({ status: 200, message: "User updated successfully.", data: { user } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error updating the user.", error: error.message });
  }
};

// Deletar um usuário
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    await user.destroy();

    res.status(200).json({ status: 200, message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Error deleting the user.", error: error.message });
  }
};
