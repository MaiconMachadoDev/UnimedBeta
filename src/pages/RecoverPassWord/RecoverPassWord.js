import { useState, useEffect } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import SpinnerUnimed from "../../components/SpinnerUnimed";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (email !== confirmEmail) {
      setError("Os e-mails não coincidem.");
      return;
    }

    if (!email.includes("@")) {
      setError("Digite um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`E-mail de recuperação enviado para ${email}.`);
      setEmail("");
      setConfirmEmail("");
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
      if (err.code === "auth/user-not-found") {
        setError("Nenhum usuário encontrado com esse e-mail.");
      } else if (err.code === "auth/invalid-email") {
        setError("E-mail inválido.");
      } else {
        setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-r from-green-100 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-2">
          Recuperar Senha
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Digite seu e-mail para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col text-left">
            <span className="text-sm text-green-800 mb-1">Email:</span>
            <input
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-left">
            <span className="text-sm text-green-800 mb-1">Confirme seu Email:</span>
            <input
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              required
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white font-semibold py-2 rounded-md transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>

          {error && (
            <p className="text-red-600 bg-red-100 border border-red-300 rounded-md px-4 py-2 text-sm text-center">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="text-green-600 bg-green-100 border border-green-300 rounded-md px-4 py-2 text-sm text-center">
              {successMessage}
            </p>
          )}
        </form>

        {loading && <SpinnerUnimed />}
      </div>
    </div>
  );
};

export default ResetPassword;