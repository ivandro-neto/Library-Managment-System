import axios from "axios";

const apiBaseURL = "https://library-managment-system-am61.onrender.com/api"; // Defina a URL da sua API

// Buscar um livro por ID
export const fetchBookById = async (id: string) => {
 
};

// Reservar um livro (chama uma API para atualizar a disponibilidade)


interface LoanData {
  userId: string;
  book: any;
}

// Função para criar um empréstimo
export const createLoan = async ({ userId, book }: LoanData) => {
  const token = localStorage.getItem("accesToken")
  try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      const response = await axios.post('https://library-managment-system-am61.onrender.com/api/loans',
        {userId, bookId: book.id, dueDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
       }
    );
      const notification = await axios.post(
        'https://library-managment-system-am61.onrender.com/api/notifications',
        { userId: user?.id, title : "You made it!",message: `You just loan the ${book?.title}, due this book until ${dueDate}! Check yours reserves to see more details.`, type: "info" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    return response; // Retorna os dados do empréstimo criado
  } catch (error) {
    console.error("Erro ao criar empréstimo", error);
    throw new Error("Falha ao criar o empréstimo.");
  }
};
