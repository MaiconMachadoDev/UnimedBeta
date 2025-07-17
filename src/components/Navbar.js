import { useState, useEffect, useRef } from "react";
import { NavLink,useParams } from "react-router-dom";
import { useAuthValue } from "../context/AuthContext";
import { useAuthentication } from "../hooks/useAuthentication";

export default function Navbar() {
  const { user } = useAuthValue();
  const { logout } = useAuthentication();
  const [isOpen, setIsOpen] = useState(false);      // menu mobile
  const [modalOpen, setModalOpen] = useState(false); // modal usuário
  const dropdownRef = useRef(null);

  function getInitials(name = "") {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    }
    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
const Usuario = () => {
  const { id } = useParams();
  // Use esse id para buscar os dados do usuário, se necessário
};
  return (
    <nav className="bg-green-50 shadow-md py-4 px-6 md:px-12 flex justify-between items-center relative">
      {/* Logo */}
      <NavLink to="/" className="text-2xl font-bold text-green-700">
        Unimed{" "}
        <span className="uppercase font-black text-green-900">Cirurgias</span>
      </NavLink>

      {/* Botão Hamburguer para mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col space-y-1 focus:outline-none"
        aria-label="Abrir menu"
      >
        <span className="w-6 h-0.5 bg-green-900"></span>
        <span className="w-6 h-0.5 bg-green-900"></span>
        <span className="w-6 h-0.5 bg-green-900"></span>
      </button>

      {/* Menu Links */}
      <ul
        className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 absolute md:static bg-green-50 md:bg-transparent shadow-md md:shadow-none p-6 md:p-0 rounded-md md:rounded-none top-16 right-6 md:top-auto md:right-auto transition-all duration-300 ${
          isOpen ? "block" : "hidden md:flex"
        } justify-center flex-1`}
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <li>
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                isActive
                  ? "bg-green-700 text-white"
                  : "hover:bg-green-100"
              }`
            }
          >
            Home
          </NavLink>
        </li>

        {user?.emailVerified &&  (
          <>
            <li>
              <NavLink
                to="/cliente/register"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "hover:bg-green-100"
                  }`
                }
              >
                Cadastrar Paciente
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cirurgias/mapa"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md font-medium transition duration-200 ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "hover:bg-green-100"
                  }`
                }
              >
                Mapa Cirúrgico
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
                      : "hover:bg-green-100"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
          </>
        )}

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
                      : " hover:bg-green-100"
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
                      : "hover:bg-green-100"
                  }`
                }
              >
                Cadastre-se
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
                  : "hover:bg-green-100"
              }`
            }
          >
            Sobre
          </NavLink>
        </li>
      </ul>

      {/* Avatar com Dropdown */}
      {user &&   (
        <div className="relative ml-4" ref={dropdownRef}>
          <button
            onClick={() => setModalOpen((prev) => !prev)}
            className="relative flex items-center justify-center 
  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
  rounded-full bg-green-600 text-white font-bold 
  text-base sm:text-lg md:text-xl select-none mr-6"
            aria-label="Abrir informações do usuário"
            type="button"
          >
            {user.fotoUrl ? (
              <img
                src={user.fotoUrl}
                alt="Foto do usuário"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user.displayName || user.name || "Usuário")
            )}
          </button>

          {modalOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4 text-gray-700 space-y-2">
                  <p>
                    <strong>Nome:</strong> {user.displayName || user.name || "Usuário"}
                  </p>
                  <div className="flex gap-2 items-start">
                      <strong className="text-sm whitespace-nowrap">Email:</strong>
                      <span
                        className="text-sm w-64 truncate break-keep"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </div>
                  <p>
                    <strong>Perfil:</strong> {user.perfil || "Não informado"}
                  </p>
                </div>
                <NavLink
                  to={`/usuario/${user.id}`}           // ajuste para a rota que você quiser
                  onClick={() => setModalOpen(false)}
                  className="block w-full text-center text-green-700 hover:bg-green-100 py-2 border-t border-gray-200"
                >
                  Configurações
                </NavLink>
                <div className="flex justify-center">
                  <button
                  onClick={() => {
                    logout();
                    setModalOpen(false);
                  }}
                  className="flex items-center w-15 h-8 bg-green-600 hover:bg-green-700 hover:text-red-500 text-white font-semibold py-2 rounded-b-md"
                >
                  Sair
                </button>
                </div>
                
              </div>
          )}
        </div>
      )}
    </nav>
  );
}
