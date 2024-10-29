import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Korrekt importieren
import { useQuiz } from "../hooks/useQuiz";
import Background from "./Background";

const QuizScreen: React.FC = () => {
   const { difficulty } = useParams<{ difficulty: string }>();
   const navigate = useNavigate(); // useNavigate hier richtig aufrufen
   const {
      currentQuestion,
      score,
      skips,
      timeLeft,
      checkAnswer,
      skipQuestion,
      isGameOver,
      fade,
      errors
   } = useQuiz(difficulty || "easy");

   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
   const [animate, setAnimate] = useState(false);

   const maxErrorsMap: Record<string, number> = { easy: 8, normal: 4, hard: 2, hardcore: 1 };
   const maxErrors = maxErrorsMap[difficulty || "easy"];
   const remainingErrors = maxErrors - errors;

   useEffect(() => {
      if (selectedAnswer) {
         setAnimate(true);
         const timer = setTimeout(() => {
            setSelectedAnswer(null);
            setAnimate(false);
         }, 500);
         return () => clearTimeout(timer);
      }
   }, [selectedAnswer]);

   if (isGameOver) {
      return (
         <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white p-6 relative overflow-hidden">
            <Background isCorrect={false} animate={false} />
            <h1 className="text-5xl font-bold mb-4 z-20">Game Over</h1>
            <p className="text-lg z-20">Your Score: <span className="font-semibold">{score}</span></p>
            <button
               onClick={() => window.location.reload()}
               className="mt-8 px-6 py-3 z-20 bg-zinc-800/50 backdrop-blur-xl text-white rounded-lg hover:bg-zinc-700/50 transition"
            >
               Try Again
            </button>
         </div>
      );
   }

   if (!currentQuestion) {
      return (
         <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white p-6 relative overflow-hidden">
            <Background isCorrect={false} animate={false} />
            <h1 className="text-5xl font-bold mb-4 z-20">Keine Fragen mehr verfügbar!</h1>
            <p className="text-lg z-20">Your Score: <span className="font-semibold">{score}</span></p>
            <button
               onClick={() => window.location.reload()}
               className="mt-8 px-6 py-3 z-20 bg-zinc-800 text-white rounded-lg border border-zinc-600 hover:rounded-xl hover:bg-zinc-700 transition-all duration-100"
            >
               Try Again
            </button>
            <button
               onClick={() => navigate('/')}
               className="mt-8 px-6 py-3 z-20 bg-zinc-800 text-white rounded-lg border border-zinc-600 hover:rounded-xl hover:bg-zinc-700 transition-all duration-100"
            >
               To Home
            </button>
         </div>
      );
   }

   // Hier werden die maximalen Zeiten abgerufen
   const maxTimeMap: Record<string, number> = { easy: 320, normal: 240, hard: 180, hardcore: 120 };
   const maxTime = maxTimeMap[difficulty || "easy"];
   const progress = (timeLeft / maxTime) * 100; // Berechnung des Fortschritts
   const progressColor = progress < 15 ? "bg-red-500" : progress < 50 ? "bg-yellow-500" : "bg-green-500";

   return (
      <div className="relative flex flex-col items-center justify-center h-screen p-4 bg-zinc-900">
         {/* Responsiver Timer-Balken */}
         <div
            className={`absolute top-0 left-0 h-2 ${progressColor} transition-all duration-300`}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%`, transform: `translateX(-${100 - progress}%)` }} // Balken von links nach rechts abnehmen
         />
         <Background isCorrect={selectedAnswer ? currentQuestion.correct.includes(selectedAnswer) : null} animate={animate} />

         {/* Anzeige der verbleibenden Fehler */}
         <div className="absolute top-4 left-4 text-zinc-300 flex items-center">
            {difficulty !== "hardcore" && (
               <>
                  <span className="text-lg">Skips: {skips}</span>
                  <button
                     onClick={skipQuestion}
                     className="ml-2 p-1 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
                  >
                     Skip
                  </button>
               </>
            )}
         </div>
         <div className="absolute top-4 right-4 text-zinc-300 text-lg font-semibold">Score: {score}</div>
         <div className="absolute top-14 right-4 text-zinc-300 text-lg font-semibold">
            Time Left: <span className="text-zinc-100">{timeLeft}s</span>
         </div>
         <div className="absolute top-20 text-zinc-300 text-lg">
            Verbleibende Fehler: <span className="font-semibold">{remainingErrors}</span>
         </div>

         <div className={`p-6 z-20 rounded-lg transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
            <h2 className="text-3xl font-bold text-white z-20">{currentQuestion.question}</h2>
            <div className="flex flex-col mt-4 space-y-2 z-20">
               {currentQuestion.answers.map((answer: string) => (
                  <button
                     key={answer}
                     onClick={() => {
                        setSelectedAnswer(answer);
                        checkAnswer(answer);
                     }}
                     className={`px-6 py-3 text-left text-white rounded transition-all duration-200 ${selectedAnswer
                        ? currentQuestion.correct.includes(answer)
                           ? "bg-green-500 border border-zinc-600"
                           : "bg-red-500 border border-zinc-600"
                        : "bg-zinc-800/50 backdrop-blur-xl border border-zinc-600 hover:bg-zinc-700/50"
                        }`}
                     disabled={!!selectedAnswer}
                  >
                     {answer}
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
};

export default QuizScreen;
