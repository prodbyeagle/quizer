import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";

const QuizScreen: React.FC = () => {
   const { difficulty } = useParams<{ difficulty: string }>();
   const { currentQuestion, score, skips, timeLeft, checkAnswer, skipQuestion, isGameOver } = useQuiz(difficulty || "easy");
   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
   const [fadeOut, setFadeOut] = useState(false);

   useEffect(() => {
      if (selectedAnswer) {
         const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
               setFadeOut(false);
               setSelectedAnswer(null);
            }, 300);
         }, 200);
         return () => clearTimeout(timer);
      }
   }, [selectedAnswer]);

   if (isGameOver) {
      return (
         <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white p-6">
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-lg">Your Score: <span className="font-semibold">{score}</span></p>
            <button
               onClick={() => window.location.reload()}
               className="mt-8 px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition"
            >
               Try Again
            </button>
         </div>
      );
   }

   return (
      <div className="relative flex flex-col items-center justify-center h-screen p-4 bg-zinc-900">
         <div className="absolute top-4 left-4 text-zinc-300">
            Skips: {skips}
            <button onClick={skipQuestion} className="ml-2 p-1 bg-zinc-700 text-white rounded">Skip</button>
         </div>
         <div className="absolute top-4 right-4 text-zinc-300">Score: {score}</div>
         <div className="absolute top-4 text-zinc-300">
            Time Left: <span className="font-semibold">{timeLeft}s</span>
         </div>

         <div className={`p-6 rounded-lg transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
            <h2 className="text-2xl font-bold text-white">{currentQuestion?.question || "none"}</h2>
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
                        : "bg-zinc-800 border border-zinc-600 hover:bg-zinc-700"
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
