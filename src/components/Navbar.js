import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthValue } from "../context/AuthContext";
import { useAuthentication } from "../hooks/useAuthentication";

const Navbar = () => {
  const { user } = useAuthValue();
  const { logout } = useAuthentication();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-green-50 shadow-md py-4 px-6 md:px-12 flex justify-between items-center relative">
      <NavLink to="/" className="text-2xl font-bold text-green-700">
        Unimed  <span className="uppercase font-black text-green-900">Cirurgias</span>
      </NavLink>

      {/* Botão Hamburguer */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col space-y-1 focus:outline-none"
      >
        <span className="w-6 h-0.5 bg-green-900"></span>
        <span className="w-6 h-0.5 bg-green-900"></span>
        <span className="w-6 h-0.5 bg-green-900"></span>
      </button>

      {/* Menu */}
      <ul
        className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-4 absolute md:static bg-green-50 md:bg-transparent shadow-md md:shadow-none p-6 md:p-0 rounded-md md:rounded-none top-16 right-6 md:top-auto md:right-auto transition-all duration-300 ${
          isOpen ? "block" : "hidden md:flex"
        }`}
      >
        <li>
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                isActive
                  ? "bg-green-700 text-white"
                  : "text-green-900 hover:bg-green-100"
              }`
            }
          >
            Home
          </NavLink>
        </li>

        {!user && (
          <>
            <li>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-green-900 hover:bg-green-100"
                  }`
                }
              >
                Entrar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-green-900 hover:bg-green-100"
                  }`
                }
              >
                Cadastre-se
              </NavLink>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <NavLink
                to="/cliente/register"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-green-900 hover:bg-green-100"
                  }`
                }
              >
                Cadastrar Paciente
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-green-900 hover:bg-green-100"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
          </>
        )}

        <li>
          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                isActive
                  ? "bg-green-700 text-white"
                  : "text-green-900 hover:bg-green-100"
              }`
            }
          >
            Sobre
          </NavLink>
        </li>

        {user && (
          <li>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="text-sm px-3 py-2 rounded-md font-medium text-green-900 hover:bg-green-100 transition duration-200"
            >
              Sair
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
