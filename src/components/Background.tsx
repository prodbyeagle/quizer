// src/components/Background.tsx
import React, { useEffect, useState } from "react";

const Background: React.FC<{ isCorrect: boolean | null; animate: boolean }> = ({ isCorrect, animate }) => {
   const bgColor = isCorrect === true ? "bg-green-500" : isCorrect === false ? "bg-red-500" : "bg-cyan-500";

   // Verwende useState, um die Stile zu speichern und bei Bedarf zu aktualisieren
   const [bubbleStyles, setBubbleStyles] = useState(() =>
      Array.from({ length: 4 }).map(() => ({
         top: `${Math.random() * 40 + 30}vh`,
         left: `${Math.random() * 60 + 10}vw`,
         width: `${Math.random() * 200 + 300}px`,
         height: `${Math.random() * 200 + 300}px`,
         opacity: Math.random() * 0.2 + 0.3, // Opazität zwischen 0.3 und 0.5
      }))
   );

   useEffect(() => {
      if (animate) {
         const interval = setInterval(() => {
            setBubbleStyles((prevStyles) =>
               prevStyles.map((style) => ({
                  ...style,
                  width: `${Math.random() * 200 + 300}px`, // Breite randomisieren
                  height: `${Math.random() * 200 + 300}px`, // Höhe randomisieren
                  opacity: Math.random() * 0.2 + 0.3, // Opazität randomisieren
               }))
            );
         }, 3000); // Alle 3 Sekunden die Form und Opazität aktualisieren

         return () => clearInterval(interval); // Timer bei Entladen entfernen
      }
   }, [animate]);

   return (
      <div className="absolute inset-0 overflow-hidden">
         {bubbleStyles.map((style, index) => (
            <div
               key={index}
               className={`absolute ${bgColor} rounded-full transition-all blur-[100px] duration-500 ease-in-out`}
               style={style}
            />
         ))}
      </div>
   );
};

export default Background;
