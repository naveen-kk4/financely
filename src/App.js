
import './app.css';
import Header from './components/Header';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <>
    <ToastContainer
  

/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
