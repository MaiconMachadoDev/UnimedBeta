import { useState,useEffect } from "react";
import { sendEmailVerification,getAuth, } from "firebase/auth"; // opcional, se usar Firebase Auth
import { app } from "../../firebase/config"; // ajuste o caminho conforme necessário

export default function AccountPage() {
  // 👉 estado da foto
  const auth = getAuth(app);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  // 👉 estado geral do formulário
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "cirurgiao", // valor inicial
    crm: "",
    especialidade: "",
    coren: "",
    medicoResponsavel: "",
    emailVerified: false, // novo campo
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
        emailVerified: user.emailVerified || false,
      }));
    }
  }, []);


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
  };

  const handleVerifyEmail = async () => {
  if (!auth.currentUser) return;

  try {
    await sendEmailVerification(auth.currentUser);
    alert("Email de verificação enviado. Confira sua caixa de entrada.");
  } catch (err) {
    console.error("Erro ao enviar verificação:", err);
    alert("Erro ao enviar verificação. Tente novamente.");
  }
};

  const { role, emailVerified } = form;
  useEffect(() => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    setForm((prev) => ({
      ...prev,
      name: currentUser.displayName || "",
      email: currentUser.email || "",
      emailVerified: currentUser.emailVerified || false,
    }));
  }
}, []);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-green-800 text-center mb-2">
          Minha Conta
        </h1>

        {/* Foto do usuário */}
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

        {/* Email (somente leitura) */}
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

        {/* Status verificação de email */}
        <div className="flex items-center justify-center">
             {!emailVerified ? (
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="w-44 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm"
              >
                Verificar Email
              </button>
            ) : (
              <p className="text-sm text-green-600 font-semibold">Email verificado ✔️</p>
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
        {(role === "cirurgiao" ) && (
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
          </>
        )}
         {( role === "anestesista") && (
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
            <span className="text-sm text-gray-700">Nome do(s) Médico(s) responsável(is)</span>
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
  );
}
