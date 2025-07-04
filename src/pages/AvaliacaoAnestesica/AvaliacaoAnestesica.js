import Header from "../AvaliacaoAnestesica/ComponentsAvaliacao/Header";
import InformacoesBasicas from "../AvaliacaoAnestesica/ComponentsAvaliacao/InformacoesBasicas";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-[#e6f2ec] p-6 text-green-900">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
        <Header />
        <InformacoesBasicas/>
        {/* <PatientData /> */}
        {/* <AnestheticHistory /> */}
        {/* <PhysicalExam /> */}
      </div>
    </div>
  );
};

export default MainPage;
