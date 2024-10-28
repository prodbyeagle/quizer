import { useState, useEffect } from "react";
import questionsData from "../data/questions.json";

interface Question {
   question: string;
   answers: string[];
   correct: string[];
}

function getQuestionsByDifficulty(difficulty: string): Question[] {
   const difficultyMap: { [key: string]: Question[] } = questionsData as any;
   return difficultyMap[difficulty] || [];
}

// Funktion zum Mischen des Arrays
function shuffleArray(array: Question[]): Question[] {
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
}

export function useQuiz(difficulty: string) {
   const questions = shuffleArray(getQuestionsByDifficulty(difficulty)); // Fragen mischen
   const maxErrorsMap: Record<string, number> = { easy: 8, normal: 4, hard: 2, hardcore: 1 };
   const maxTimeMap: Record<string, number> = { easy: 120, normal: 90, hard: 60, hardcore: 30 };
   const maxErrors = maxErrorsMap[difficulty];
   const maxTime = maxTimeMap[difficulty];

   const [score, setScore] = useState(0);
   const [skips, setSkips] = useState(6);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [timeLeft, setTimeLeft] = useState(maxTime);
   const [errors, setErrors] = useState(0);
   const [isGameOver, setIsGameOver] = useState(false);
   const [fade, setFade] = useState(false);

   const currentQuestion = questions[currentQuestionIndex];

   useEffect(() => {
      if (timeLeft > 0 && !isGameOver) {
         const timer = setInterval(() => {
            setTimeLeft((prev: number) => prev - 1);
         }, 1000);
         return () => clearInterval(timer);
      } else if (timeLeft === 0) {
         setIsGameOver(true);
      }
   }, [timeLeft, isGameOver]);

   useEffect(() => {
      if (errors >= maxErrors) {
         setIsGameOver(true);
      }
   }, [errors, maxErrors]);

   function checkAnswer(selectedAnswer: string) {
      if (currentQuestion.correct.includes(selectedAnswer)) {
         setScore((prev: number) => prev + 1);
         setTimeLeft((prev: number) => prev + 10);
      } else {
         setErrors((prev: number) => prev + 1);
         setTimeLeft((prev: number) => Math.max(0, prev - 10));
      }

      setFade(true);
      setTimeout(() => {
         setCurrentQuestionIndex((prev) => prev + 1);
         setFade(false);
      }, 500);
   }

   function skipQuestion() {
      if (skips > 0) {
         setSkips((prev: number) => prev - 1);
         setCurrentQuestionIndex((prev) => prev + 1);
      }
   }

   return { currentQuestion, score, skips, timeLeft, checkAnswer, skipQuestion, isGameOver, fade };
}
