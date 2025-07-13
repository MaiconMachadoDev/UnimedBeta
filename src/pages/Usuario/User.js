import { useState, useEffect } from "react";
import { getAuth, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase/config";

export default function AccountPage() {
  const auth = getAuth(app);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [needsReload, setNeedsReload] = useState(false);

  // Foto
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  // Formulário
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, photoFile });
    openModal("Dados salvos com sucesso (simulação).");
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
      // setNeedsReload(false);
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
      openModal(
        `E‑mail de verificação enviado para ${user.email}. Confira sua caixa de entrada.`,
        false
      );
    } catch (err) {
      console.error("Erro ao enviar verificação:", err);
      openModal("Erro ao enviar verificação. Tente novamente.", false);
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

          {/* Nome */}
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

          <button
            type="submit"
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
          >
            Salvar
          </button>
        </form>
      </div>

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
