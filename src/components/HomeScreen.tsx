import React from "react";
import { useNavigate } from "react-router-dom";

const HomeScreen: React.FC = () => {
   const navigate = useNavigate();

   function startGame(difficulty: string) {
      navigate(`/quiz/${difficulty}`);
   }

   return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white p-4">
         <h1 className="text-4xl font-bold mb-8 text-center text-zinc-100 shadow-md">Quizer - Remake by @prodbyeagle</h1>

         <div className="flex flex-col gap-4 w-full max-w-xs">
            {["easy", "normal", "hard", "hardcore"].map((mode) => (
               <button
                  key={mode}
                  onClick={() => startGame(mode)}
                  className={`px-6 py-3 text-xl font-semibold text-white bg-zinc-800 rounded-lg shadow-lg transition-all duration-100 
                     ${mode === "hardcore" ? "hardcore-shake hover:bg-red-400/70 transition duration-1000" : ""}
                     hover:bg-zinc-700 focus:outline-none active:scale-95`}
               >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
               </button>
            ))}
         </div>
      </div>
   );
};

export default HomeScreen;
