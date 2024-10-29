import React from "react";
import Tooltip from "./Tooltip";
import { useNavigate } from "react-router-dom";

const modeDescriptions: { [key: string]: string } = {
   easy: "Ein einfacher Modus für Anfänger.",
   normal: "Ein ausgewogener Modus für durchschnittliche Spieler.",
   hard: "Ein herausfordernder Modus für erfahrene Spieler.",
   hardcore: "Der schwierigste Modus mit minimalen Fehlern.",
};

const HomeScreen: React.FC = () => {
   const navigate = useNavigate();

   function startGame(difficulty: string) {
      navigate(`/${difficulty}`);
   }

   return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white p-4 relative overflow-hidden">
         <BackgroundAnimation />
         <h1 className="text-4xl font-bold mb-8 text-center text-zinc-100">Quizer - Remake by @prodbyeagle</h1>
         <h1 className="text-xl font-medium mb-8 text-center text-zinc-100">Todo: Remaining Tries, Bissl Ui updaten</h1>

         <div className="flex gap-4 z-20">
            {["easy", "normal", "hard", "hardcore"].map((mode) => (
               <div key={mode} className="relative">
                  <Tooltip fontSize="text-md" content={modeDescriptions[mode]} position="bottom">
                     <button
                        onClick={() => startGame(mode)}
                        className={`px-6 py-3 text-xl font-semibold text-white bg-zinc-800/90 backdrop-blur-xl rounded-lg shadow-lg transition-all duration-100 
                        ${mode === "hardcore" ? "hardcore-shake hover:bg-red-500/10 transition duration-100" : ""}
                        hover:bg-zinc-700/50 focus:outline-none hover:-translate-y-1 active:scale-95`}
                     >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                     </button>
                  </Tooltip>
               </div>
            ))}
         </div>
      </div>
   );
};

const BackgroundAnimation: React.FC = () => {
   return (
      <div className="absolute inset-0 overflow-hidden z-0">
         {[...Array(4)].map((_, index) => (
            <div
               key={index}
               className={`absolute bg-emerald-500 rounded-full blur-[100px] transition-all z-10 duration-[4000ms] ease-in-out opacity-30`}
               style={{
                  width: `${Math.random() * 200 + 300}px`, // Größe zwischen 300px und 500px
                  height: `${Math.random() * 200 + 300}px`, // Größe zwischen 300px und 500px
                  top: `${Math.random() * 40 + 30}vh`, // zufällige vertikale Position (30% bis 70% des Bildschirms)
                  left: `${Math.random() * 20 + 30}vw`, // zufällige horizontale Position (30% bis 70% des Bildschirms)
                  animation: `move ${Math.random() * 4 + 3}s infinite alternate`,
               }}
            />
         ))}
         <style>
            {`
               @keyframes move {
                  0% {
                     transform: translate(0, 0);
                  }
                  100% {
                     transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px);
                  }
               }
            `}
         </style>
      </div>
   );
};

export default HomeScreen;
