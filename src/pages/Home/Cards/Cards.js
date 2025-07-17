import { Link } from "react-router-dom";

const Cards = ({ icon, title, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white rounded shadow p-4 flex flex-col items-center"
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

export default Cards;