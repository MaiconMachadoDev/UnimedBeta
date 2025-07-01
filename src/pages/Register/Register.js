import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [perfil, setPerfil] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { createUser, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!acceptedTerms) {
      setError("É preciso aceitar os termos de uso.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais");
      return;
    }

    const user = {
      displayName,
      email,
      telefone,
      telefone2,
      perfil,
      password,
    };

    const res = await createUser(user);
    console.log(res);
  };

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-800 text-center mb-2">Cadastre-se</h1>
        <p className="text-gray-600 text-center mb-6">Preencha seus dados para acesso</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            <span className="text-sm text-gray-700">Nome:</span>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          <label>
            <span className="text-sm text-gray-700">Email:</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          <label>
            <span className="text-sm text-gray-700">Telefone Celular:</span>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          <label>
            <span className="text-sm text-gray-700">Segundo Telefone:</span>
            <input
              type="tel"
              value={telefone2}
              onChange={(e) => setTelefone2(e.target.value)}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          <label>
            <span className="text-sm text-gray-700">Perfil de Usuário:</span>
            <select
              required
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            >
              <option value="">Selecione</option>
              <option value="enfermeira">Enfermeira</option>
              <option value="secretario">Secretário(a)</option>
              <option value="anestesista">Anestesista</option>
              <option value="cirurgiao">Cirurgião</option>
            </select>
          </label>

          <label>
            <span className="text-sm text-gray-700">Senha:</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          <label>
            <span className="text-sm text-gray-700">Confirme a Senha:</span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-3 py-2 bg-green-50 rounded-md border w-full"
            />
          </label>

          <label className="text-sm text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>
              Eu li e concordo com os{" "}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-green-600 underline"
              >
                Termos de Uso
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={!acceptedTerms || loading}
            className={`${
              acceptedTerms
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-semibold py-2 rounded-md transition duration-300`}
          >
            {loading ? "Aguarde..." : "Cadastrar"}
          </button>

          {error && (
            <p className="text-red-600 bg-red-100 border border-red-300 rounded-md px-4 py-2 text-sm text-center">
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Modal de Termos de Uso */}
        {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold text-green-700 mb-2">Termos de Uso e Política de Privacidade</h2>
            <div className="text-sm text-gray-700 mb-4 h-60 overflow-y-auto space-y-4">
              <p>
                <strong>1. Finalidade do Aplicativo:</strong><br />
                Este aplicativo é destinado ao uso por profissionais da saúde e colaboradores autorizados para o gerenciamento de dados clínicos e cirúrgicos. Seu uso é restrito ao ambiente hospitalar, com fins operacionais e administrativos.
              </p>

              <p>
                <strong>2. Consentimento e Aceitação dos Termos:</strong><br />
                Ao utilizar o sistema, você declara que leu, compreendeu e concorda com os termos aqui descritos, assumindo total responsabilidade pela forma como utiliza o aplicativo.
              </p>

              <p>
                <strong>3. Responsabilidades do Usuário:</strong><br />
                O acesso ao sistema é pessoal e intransferível. O usuário compromete-se a proteger suas credenciais, não compartilhar dados sensíveis, respeitar o sigilo profissional e cumprir a legislação vigente. Todas as ações realizadas com seu login serão de sua responsabilidade.
              </p>

              <p>
                <strong>4. Privacidade e LGPD:</strong><br />
                Em conformidade com a Lei nº 13.709/2018 (LGPD), os dados pessoais e sensíveis inseridos no sistema são tratados exclusivamente para fins médicos, administrativos e legais. Asseguramos confidencialidade, integridade e segurança dos dados mediante medidas técnicas adequadas.
              </p>

              <p>
                <strong>5. Isenção de Responsabilidade do Desenvolvedor:</strong><br />
                O desenvolvedor do sistema não se responsabiliza por uso indevido por parte dos usuários. Todo conteúdo e ações realizadas no sistema são de responsabilidade exclusiva dos usuários autenticados.
              </p>

              <p>
                <strong>6. Auditoria e Monitoramento:</strong><br />
                O sistema poderá registrar logs de acesso e atividade, com fins de segurança, auditoria e rastreabilidade.
              </p>

              <p>
                <strong>7. Revogação de Acesso:</strong><br />
                O acesso poderá ser suspenso ou revogado em caso de uso indevido, violação dos termos ou encerramento de vínculo com a instituição.
              </p>

              <p>
                <strong>8. Atualizações dos Termos:</strong><br />
                Os termos podem ser atualizados periodicamente. O uso contínuo do sistema após atualizações será considerado como aceitação tácita das novas condições.
              </p>

              <p>
                <strong>9. Foro e Legislação Aplicável:</strong><br />
                Estes termos são regidos pelas leis brasileiras, sendo eleito o foro da comarca da instituição hospitalar responsável pelo sistema para dirimir eventuais controvérsias.
              </p>

              <p className="font-semibold text-green-700">
                ✅ Declaro que li e aceito os Termos de Uso e Política de Privacidade.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md w-full mt-4"
            >
              Fechar e Concordar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;
