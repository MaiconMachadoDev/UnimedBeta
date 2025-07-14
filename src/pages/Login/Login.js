import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import SpinnerUnimed from "../../components/SpinnerUnimed";
import { NavLink } from "react-router-dom";
import Glogo from "../../assets/logoGoogle.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, error: authError, loading, signInWithGoogle } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = { email, password };
    const res = await login(user);

    console.log(res);
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="min-h-[80vh] bg-gradient-to-r from-green-100 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-2">
          Entrar
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Faça o login para acessar o sistema
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col text-left">
            <span className="text-sm text-green-800 mb-1">Email:</span>
            <input
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              name="email"
              required
              placeholder="seuemail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-left">
            <span className="text-sm text-green-800 mb-1">Senha:</span>
            <input
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="password"
              name="password"
              required
              placeholder="Insira sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {!loading && (
            <div className="flex items-center justify-center mt-4">
              <button
              type="submit"
              className=" bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full w-80 transition duration-300"
            >
              Entrar
            </button>
            </div>
            
          )}
          <div className="flex items-center justify-center mt-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-3 text-gray-600 font-medium text-sm">ou</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
          {!loading && (
            <div className="flex justify-center mt-4 border-2 border-gray-400
                    rounded-full
                    bg-white
                    hover:bg-gray-50
                    transition duration-200">
                <button
                  onClick={signInWithGoogle}
                  type="button"
                  className="
                    flex items-center justify-center gap-2
                    w-80
                    py-2
                    
                  "
                >
                  <img src={Glogo} alt="Logo Google" className="w-6 h-6" />
                  <span className="text-gray-700 font-medium text-sm">
                    Continuar com o Google
                  </span>
                </button>
              </div>
            
          )}
          {!loading && (
            <NavLink
              to="/register"
              className="text-center text-sm text-green-700 font-semibold rounded-md transition duration-300"
            >
              Cadastrar
            </NavLink>
          )}
       
          {!loading && (
            <NavLink
              to="/recoverPassword"
              className="text-center  text-sm text-green-700 font-semibold  rounded-md transition duration-300"
            >
              Esqueci minha  senha
            </NavLink>
          )}
          {loading && (
            <button
              type="submit"
              disabled
              className="bg-green-600 text-white font-semibold py-2 rounded-md opacity-70 cursor-not-allowed"
            >
              Aguarde...
            </button>
          )}

          {error && (
            <p className="text-red-600 bg-red-100 border border-red-300 rounded-md px-4 py-2 text-sm mt-2 w-full max-w-md text-center">
              {error}
            </p>
          )}
        </form>
        {loading && <SpinnerUnimed />}
      </div>
    </div>
  );
};

export default Login;
