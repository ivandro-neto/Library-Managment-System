import { useState, useEffect, useContext } from "react";
import axios from "axios";
import LibraryTable from "../../components/LibraryTable";
import CreateBookModal from "../../components/CreateModal";
import UpdateBookModal from "../../components/UpdateBookModal";
import DeleteBookModal from "../../components/DeleteBookModal";
import Layout from "../Layout";
import { AuthContext } from "../../context/AuthContext";
import { Roles } from "../../utils/Roles";
import SearchBar from "../../components/SearchInput";
import styles from './css/styles.module.css'
const apiBaseURL = "https://library-managment-system-am61.onrender.com/api"; // Ajuste conforme necessário

interface PopUp{
  success: boolean;
  content: string;
}

const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [popupList, setPopUpList] = useState<PopUp[]>([]);
  
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const { accessToken } = useContext(AuthContext);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (!query) {
      setFilteredBooks(books); // Exibe todos os livros se não houver consulta
    } else {
      const results = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(results); // Atualiza a lista filtrada
    }
  }, [query, books]);
  // Função para carregar os livros da API
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/books`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Passando o token no header
        },
      });
      if(response.status === 404)
        setBooks(response.data)
      setBooks(response.data.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPopUpList((prevList) => {
        const updatedList = [...prevList]; // Cria uma cópia do estado atual
        updatedList.pop(); // Remove o último elemento
        return updatedList; // Atualiza o estado com a nova lista
      });
    }, 2000);
  
    return () => clearTimeout(timeout); // Limpa o timeout quando o componente desmontar
  }, [popupList]);
  // Carregar livros quando o componente for montado ou quando o token mudar
  useEffect(() => {
    if (accessToken) {
      fetchBooks();
    }
  }, [accessToken]);

  // Criar livro
  const handleCreate = async (title: string, author: string, isbn: string, description: string, quantity: number, releaseDate: string) => {
    try {
      const response = await axios.post(
        `${apiBaseURL}/books`,
        { title,author, isbn, description, quantity, releaseDate },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      if(response.status < 400){
        setPopUpList((prevList) => [
          ...prevList,
          { success: true, content: "Book created successfully" },
        ]);
      }else{
        setPopUpList((prevList) => [
          ...prevList,
          { success: false, content: "Error creating the book" },
        ]);
      }
      const result = await axios.get(
        `${apiBaseURL}/users`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      const commonUsers = result.data.data.users.filter(user => user.roles[0] === Roles.user)

      for (let u = 0; u < commonUsers.length; u++) {
        
        
        const notification = await axios.post(
          `${apiBaseURL}/notifications`,
          { userId: commonUsers[u].id, title : "New book added!",message: `Check out the new book called ${title}!`, type: "info" },
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );
      }

      fetchBooks(); // Recarregar livros após a criação
    } catch (error) {
      console.error("Error creating book:", error);
      setPopUpList((prevList) => [
        ...prevList,
        { success: false, content: "Error creating the book" },
      ]);
    }
  };

  // Atualizar livro
  const handleUpdate = async (id: string, title: string, author: string, isbn: string, description: string, quantity:number, status: string, releaseDate: string) => {
    try {
      const response = await axios.put(
        `${apiBaseURL}/books/${id}`,
        { title,author, isbn, description, status, quantity, releaseDate },
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      handleClose();
      if(response.status < 400){
        setPopUpList((prevList) => [
          ...prevList,
          { success: true, content: "Book updated successfully" },
        ]);
      }else{
        setPopUpList((prevList) => [
          ...prevList,
          { success: false, content: "Error updating the book" },
        ]);
      }
      fetchBooks(); // Recarregar livros após a atualização
    } catch (error) {
      console.error("Error updating the book:", error);
      setPopUpList((prevList) => [
        ...prevList,
        { success: false, content: "Error updating the book" },
      ]);
    }
  };

  // Deletar livro
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${apiBaseURL}/books/${selectedBook.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Passando o token no header
        },
      });
      fetchBooks(); // Recarregar livros após a exclusão
      setIsDeleteModalOpen(false);
      if(response.status < 400){
        setPopUpList((prevList) => [
          ...prevList,
          { success: true, content: "Book updated successfully" },
        ]);
      }else{
        setPopUpList((prevList) => [
          ...prevList,
          { success: false, content: "Error updating the book" },
        ]);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setPopUpList((prevList) => [
        ...prevList,
        { success: false, content: "Error deleting book" },
      ]);
    }
  };
  const handleClose = () =>{
    setIsUpdateModalOpen(false);
    setSelectedBook(null);
  }
  return (
    <Layout>
      <div className={styles.header}>
        <SearchBar onSearch={setQuery} /> {/* Passa a função para atualizar a query */}
      </div>
      <div>
        <LibraryTable
          books={filteredBooks}
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
            onClose={handleClose}
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
      <div className={'popups'}>
        {popupList.map(pop =>
          <span key={pop.content} className={`popup ${pop.success ? 'success' : 'error'}`}>{pop.content}</span>
        )}
      </div>
    </Layout>
  );
};

export default LibraryPage;
