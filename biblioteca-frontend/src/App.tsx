import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Library from './pages/Library';
import ReservesPage from './pages/Reserves';
import InboxPage from './pages/Inbox';
import BookPage from './pages/Book';
import BooksPage from './pages/Books';
import ReserveAdminPage from './pages/ReserveAdmin';
import PrivateRoute from './components/PrivateRoute'; // Certifique-se de importar o PrivateRoute
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { Roles } from './utils/Roles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        {/* Student routes */}
        <Route path='/library' element={
          <PrivateRoute roles={[Roles.user]}>
            <Library />
          </PrivateRoute>
        } />
        <Route path='/reserves' element={
          <PrivateRoute roles={[Roles.user]}>
            <ReservesPage />
          </PrivateRoute>
          } />
        <Route path='/inbox' element={
          <PrivateRoute roles={[Roles.user, Roles.admin]}>
            <InboxPage/>
          </PrivateRoute>
          } />

        {/* Dynamic page */}
        <Route path='/book/:id' element={
          <PrivateRoute roles={[Roles.user, Roles.admin]}>
            <BookPage/>
          </PrivateRoute>} />

        {/* Admin routes */}
        <Route 
          path='/admin/library' 
          element={
            <PrivateRoute roles={[Roles.admin]}>
              <BooksPage />
            </PrivateRoute>
          }
        />
        <Route 
          path='/admin/reserves' 
          element={
            <PrivateRoute roles={[Roles.admin]}>
              <ReserveAdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
