import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";

const QuizScreen: React.FC = () => {
   const { difficulty } = useParams<{ difficulty: string }>();
   const { currentQuestion, score, skips, timeLeft, checkAnswer, skipQuestion, isGameOver, fade } = useQuiz(difficulty || "easy");
   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
   const [animate, setAnimate] = useState(true); // Zustand für die Animation

   useEffect(() => {
      if (selectedAnswer) {
         setAnimate(false); // Animation anhalten, wenn eine Antwort gewählt wird
         const timer = setTimeout(() => {
            setSelectedAnswer(null); // Antwort zurücksetzen für die nächste Frage
            setAnimate(true); // Animation wieder aktivieren
         }, 500);
         return () => clearTimeout(timer);
      }
   }, [selectedAnswer]);

   if (isGameOver) {
      return (
         <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white p-6 relative overflow-hidden">
            <BackgroundAnimation isCorrect={false} animate={false} />
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-lg">Your Score: <span className="font-semibold">{score}</span></p>
            <button
               onClick={() => window.location.reload()}
               className="mt-8 px-6 py-3 bg-zinc-800/50 backdrop-blur-xl text-white rounded-lg hover:bg-zinc-700/50 transition"
            >
               Try Again
            </button>
         </div>
      );
   }

   // Wenn keine Fragen mehr vorhanden sind
   if (!currentQuestion) {
      return (
         <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white p-6 relative overflow-hidden">
            <BackgroundAnimation isCorrect={false} animate={false} />
            <h1 className="text-4xl font-bold mb-4">Keine Fragen mehr verfügbar!</h1>
            <p className="text-lg">Your Score: <span className="font-semibold">{score}</span></p>
            <button
               onClick={() => window.location.reload()}
               className="mt-8 px-6 py-3 bg-zinc-800/50 backdrop-blur-xl text-white rounded-lg hover:bg-zinc-700/50 transition"
            >
               Try Again
            </button>
         </div>
      );
   }

   return (
      <div className="relative flex flex-col items-center justify-center h-screen p-4 bg-zinc-900">
         <BackgroundAnimation isCorrect={selectedAnswer ? currentQuestion.correct.includes(selectedAnswer) : null} animate={animate} />
         <div className="absolute top-4 left-4 text-zinc-300">
            Skips: {skips}
            <button onClick={skipQuestion} className="ml-2 p-1 bg-zinc-700 text-white rounded">Skip</button>
         </div>
         <div className="absolute top-4 right-4 text-zinc-300">Score: {score}</div>
         <div className="absolute top-4 text-zinc-300">
            Time Left: <span className="font-semibold">{timeLeft}s</span>
         </div>

         <div className={`p-6 rounded-lg transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
            <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>
            <div className="flex flex-col mt-4 space-y-2">
               {currentQuestion.answers.map((answer: string) => (
                  <button
                     key={answer}
                     onClick={() => {
                        setSelectedAnswer(answer);
                        checkAnswer(answer);
                     }}
                     className={`px-4 py-2 text-left text-white rounded transition-all duration-200 ${selectedAnswer
                        ? currentQuestion.correct.includes(answer)
                           ? "bg-green-500 border border-zinc-600"
                           : "bg-red-500 border border-zinc-600"
                        : "bg-zinc-800/50 backdrop-blur-xl border border-zinc-600 hover:bg-zinc-700/50"
                        }`}
                     disabled={!!selectedAnswer} // Disable buttons after selecting an answer
                  >
                     {answer}
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
};

const BackgroundAnimation: React.FC<{ isCorrect: boolean | null; animate: boolean }> = ({ isCorrect, animate }) => {
   const bgColor = isCorrect === true ? "bg-green-500" : isCorrect === false ? "bg-red-500" : "bg-transparent"; // Handling for default state

   return (
      <div className="absolute inset-0 overflow-hidden z-0">
         {[...Array(4)].map((_, index) => (
            <div
               key={index}
               className={`absolute ${bgColor} rounded-full blur-[100px] opacity-30 transition-all duration-[400ms] ease-in-out`}
               style={{
                  width: `${Math.random() * 200 + 300}px`, // Größe zwischen 300px und 500px
                  height: `${Math.random() * 200 + 300}px`, // Größe zwischen 300px und 500px
                  top: `${Math.random() * 40 + 30}vh`, // zufällige vertikale Position (30% bis 70% des Bildschirms)
                  left: `${Math.random() * 60 + 10}vw`, // zufällige horizontale Position (30% bis 70% des Bildschirms)
                  animation: animate ? `move ${Math.random() * 1 + 0.5}s infinite alternate` : 'none', // Animation nur beim Klicken
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

export default QuizScreen;
