import { useState, useEffect } from "react";
import { getAuth, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase/config";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const {
    updateUserName,
    deleteUserAccount,
    loading: authLoading,
    error: authError,
    logout,
  } = useAuthentication();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [needsReload, setNeedsReload] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [reauthModalOpen, setReauthModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "cirurgiao",
    crm: "",
    especialidade: "",
    coren: "",
    medicoResponsavel: "",
    emailVerified: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setForm((prev) => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || "",
          emailVerified: user.emailVerified || false,
        }));
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUserName(form.name);
      openModal("Dados salvos com sucesso ✔️");
    } catch {
      openModal("Erro ao salvar os dados. Tente novamente.");
    }
  };

  const actionCodeSettings = {
    url: "https://maiconmachadodev.github.io/UnimedBeta/",
    handleCodeInApp: false,
  };

  const openModal = (msg, reload = false) => {
    setModalMessage(msg);
    setNeedsReload(reload);
    setModalOpen(true);
  };

  const closeModal = async () => {
    setModalOpen(false);
    if (needsReload) {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        setForm((prev) => ({ ...prev, emailVerified: user.emailVerified }));
        if (user.emailVerified) {
          window.location.reload();
        }
      }
    }
  };

  const handleVerifyEmail = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await user.reload();

      if (user.emailVerified) {
        setForm((prev) => ({ ...prev, emailVerified: true }));
        openModal("Seu e‑mail já está verificado ✔️");
        return;
      }

      await sendEmailVerification(user, actionCodeSettings);
      openModal(`E‑mail de verificação enviado para ${user.email}. Confira sua caixa de entrada.`, false);
    } catch (err) {
      console.error("Erro ao enviar verificação:", err);
      openModal("Erro ao enviar verificação. Tente novamente.", false);
    }
  };
const CONFIRM_TEXT = "sim quero excluir minha conta";
  const handleDeleteAccount = async () => {
  try {
    await deleteUserAccount();
    alert("Conta excluída com sucesso.");
    navigate("/entrar", { replace: true });
  } catch (err) {
    if (err.code === "auth/requires-recent-login") {
      setReauthModalOpen(true);      // abre modal para login novamente
    } else {
      console.error(err);
      openModal("Erro ao excluir conta. Tente novamente.");
    }
  } finally {
    setConfirmModalOpen(false);
    setDeleteConfirmText("");
  }
};

  const { role, emailVerified } = form;

  return(
    <>
      <div className="min-h-screen bg-green-50 flex items-center justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-green-800 text-center mb-2">
            Minha Conta
          </h1>

          {/* Foto */}
          <div className="flex flex-col items-center gap-2">
            <label className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-green-700">Escolher foto</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <p className="text-xs text-gray-500">Clique na foto para alterar</p>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Nome</span>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="px-3 py-2 bg-gray-100 rounded-md border w-full cursor-not-allowed"
            />
          </label>

          {/* Verificação */}
          <div className="flex items-center justify-center">
            {!emailVerified ? (
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm"
              >
                Verificar E‑mail
              </button>
            ) : (
              <p className="text-sm text-green-600 font-semibold">
                E‑mail verificado ✔️
              </p>
            )}
          </div>

          {/* Telefone */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Telefone</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          {/* Tipo de usuário */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Tipo de Usuário</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            >
              <option value="cirurgiao">Cirurgião</option>
              <option value="anestesista">Anestesista</option>
              <option value="enfermeira">Enfermeira</option>
              <option value="secretaria">Secretária</option>
            </select>
          </label>

          {/* Campos condicionais */}
          {(role === "cirurgiao" || role === "anestesista") && (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-700">CRM</span>
                <input
                  type="text"
                  name="crm"
                  value={form.crm}
                  onChange={handleChange}
                  className="px-3 py-2 bg-green-50 rounded-md border w-full"
                />
              </label>
              {role === "cirurgiao" && (
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Especialidade</span>
                  <input
                    type="text"
                    name="especialidade"
                    value={form.especialidade}
                    onChange={handleChange}
                    className="px-3 py-2 bg-green-50 rounded-md border w-full"
                  />
                </label>
              )}
            </>
          )}

          {role === "enfermeira" && (
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">COREN</span>
              <input
                type="text"
                name="coren"
                value={form.coren}
                onChange={handleChange}
                className="px-3 py-2 bg-green-50 rounded-md border w-full"
              />
            </label>
          )}

          {role === "secretaria" && (
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Médico Responsável</span>
              <input
                type="text"
                name="medicoResponsavel"
                value={form.medicoResponsavel}
                onChange={handleChange}
                className="px-3 py-2 bg-green-50 rounded-md border w-full"
              />
            </label>
          )}
          <div className="flex justify-center">
            <button
            type="submit"
            className="mt-4  bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full w-80 transition duration-300"
          >
            Salvar
          </button>
          </div>
           
           <div className="flex justify-center">
            <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="mt-2 text-sm text-red-600 hover:underline hover:bg-red-600 hover:text-white  px-3 py-2 rounded-full w-80 transition duration-300"
          >
            Excluir conta
          </button>
           </div>
          
        </form>
      </div>
      {reauthModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-semibold text-red-700 mb-4">
              Sessão expirada
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Por segurança, faça login novamente para concluir a exclusão da conta.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReauthModalOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  logout();                 // encerra sessão
                  navigate("/entrar", { replace: true });  // ou "/register"
                }}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Sair e entrar/cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 mx-4 text-center">
            <h2 className="text-lg font-bold text-green-800 mb-4">Notificação</h2>
            <p className="mb-6 text-gray-700">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-red-700 mb-4">Tem certeza?</h2>
            <p className="text-sm text-gray-700 mb-4">
              Esta ação é <strong>irreversível</strong>. Para confirmar, digite:
              <br />
              <code className="font-semibold">{CONFIRM_TEXT}</code>
            </p>

            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 mb-4"
              placeholder={`Digite: "${CONFIRM_TEXT}"`}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value.toLowerCase())}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== CONFIRM_TEXT}
                className={`px-4 py-2 text-sm rounded-md text-white transition ${
                  deleteConfirmText === CONFIRM_TEXT
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                Excluir conta
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal bonito */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 mx-4 text-center">
            <h2 className="text-lg font-bold text-green-800 mb-4">Notificação</h2>
            <p className="mb-6 text-gray-700">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      
    </>
  );
}
