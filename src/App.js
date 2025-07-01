import './App.css';


import { getAuth } from 'firebase/auth';
import {app} from '../src/firebase/config'
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

//context
import { AuthProvider } from './context/AuthContext';

//hooks
import { useState , useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthentication';

//pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Search from './pages/Search/Search';
import Paciente from './pages/Paciente/Paciente';
import EditPaciente from './pages/EditPaciente/EditPaciente';
import CadastrarClient from './pages/CadastratCliente/CadastrarCliente';



function App() {
  const [user, setUser]= useState(undefined);
  const {auth} = useAuthentication();
  const loadingUser= user === undefined;

  useEffect(()=>{
    onAuthStateChanged(auth, (user)=> {
      setUser(user)
    })
  },[auth]);

  if(loadingUser){
    return <p>Carregando...</p>
  }


  return (
    <div>
      <AuthProvider value={{user}}>
        <BrowserRouter  basename={process.env.PUBLIC_URL}>
        <Navbar/>
        <div className='min-h-[60vh] mb-20'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/paciente/:id' element={<Paciente/>}/>
          <Route path='/login' element={!user ? <Login/> : <Navigate to='/'/>}/>
          <Route path='/register' element={!user ? <Register/> : <Navigate to='/'/>}/>
          <Route path='/cliente/register' element={user ? <CadastrarClient/> : <Navigate to='/login'/>}/>
          <Route path='/pacient/edit/:id' element={user ? <EditPaciente/> : <Navigate to='/login'/>}/>
          <Route path='/dashboard' element={user ? <Dashboard/> : <Navigate to='/'/>}/>
          
        </Routes>
        </div>
        <Footer/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
