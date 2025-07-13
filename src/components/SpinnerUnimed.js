import React from "react";
const brandColors = ["#15803d", "#16a34a", "#22c55e", "#4ade80"];
export default function SpinnerUnimed({ className = "w-12 h-12" }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen fixed top-0 left-0 z-50 bg-white bg-opacity-70">
      <div className="flex items-center">
        {brandColors.map((color, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full animate-bounce"
            style={{
              backgroundColor: color,
              animationDelay: `${index * 0.2}s`,
              marginRight: index < brandColors.length - 1 ? "1rem" : "0",
            }}
          ></div>
        ))}
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Carregando...</p>
    </div>
  );
}