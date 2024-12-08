import { useState, useEffect, useContext } from "react";
import axios from "axios";
import LibraryTable from "../../components/LibraryTable";
import CreateBookModal from "../../components/CreateModal";
import UpdateBookModal from "../../components/UpdateBookModal";
import DeleteBookModal from "../../components/DeleteBookModal";
import Layout from "../Layout";
import { AuthContext } from "../../context/AuthContext";

const apiBaseURL = "http://localhost:3000/api"; // Ajuste conforme necessário

const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const { accessToken } = useContext(AuthContext);

  // Função para carregar os livros da API
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/books`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Passando o token no header
        },
      });
      setBooks(response.data.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Carregar livros quando o componente for montado ou quando o token mudar
  useEffect(() => {
    if (accessToken) {
      fetchBooks();
    }
  }, [accessToken]);

  // Criar livro
  const handleCreate = async (title: string,author: string, isbn: string, description: string, releaseDate: string) => {
    try {
      await axios.post(
        `${apiBaseURL}/books`,
        { title,author, isbn, description, releaseDate },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      fetchBooks(); // Recarregar livros após a criação
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  // Atualizar livro
  const handleUpdate = async (id: string, title: string,author: string, isbn: string, description: string,status: string, releaseDate: string) => {
    try {
      await axios.put(
        `${apiBaseURL}/books/${id}`,
        { title,author, isbn, description, status, releaseDate },
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      fetchBooks(); // Recarregar livros após a atualização
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Deletar livro
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiBaseURL}/books/${selectedBook.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Passando o token no header
        },
      });
      fetchBooks(); // Recarregar livros após a exclusão
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <Layout>
      <div>
        <LibraryTable
          books={books}
          onCreate={() => setIsCreateModalOpen(true)}
          onEdit={(id) => {
            setSelectedBook(books.find((book) => book.id === id));
            setIsUpdateModalOpen(true);
          }}
          onDelete={(id) => {
            setSelectedBook(books.find((book) => book.id === id));
            setIsDeleteModalOpen(true);
          }}
        />
        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
        />
        {selectedBook && (
          <UpdateBookModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            book={selectedBook}
            onUpdate={handleUpdate}
          />
        )}
        <DeleteBookModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default LibraryPage;
