import axios from "axios";

const apiBaseURL = "http://localhost:3000/api"; // Defina a URL da sua API

// Buscar um livro por ID
export const fetchBookById = async (id: string) => {
 
};

// Reservar um livro (chama uma API para atualizar a disponibilidade)


interface LoanData {
  userId: string;
  bookId: string;
  dueDate: Date; // Exemplo: "2024-12-15"
}

// Função para criar um empréstimo
export const createLoan = async ({ userId, bookId, dueDate }: LoanData) => {
  const token = localStorage.getItem("accesToken")
  try {
    const response = await axios.post(`${apiBaseURL}/loans`, {
      userId,
      bookId,
      dueDate
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Adicionando o token no header
      },
    });
    return response.data; // Retorna os dados do empréstimo criado
  } catch (error) {
    console.error("Erro ao criar empréstimo", error);
    throw new Error("Falha ao criar o empréstimo.");
  }
};
