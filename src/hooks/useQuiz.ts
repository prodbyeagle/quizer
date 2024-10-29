// src/hooks/useQuiz.ts

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

export function useQuiz(difficulty: string) {
   const questions = getQuestionsByDifficulty(difficulty);
   const maxErrorsMap: Record<string, number> = { easy: 8, normal: 4, hard: 2, hardcore: 1 };
   const maxTimeMap: Record<string, number> = { easy: 540, normal: 320, hard: 180, hardcore: 120 };
   const maxSkipsMap: Record<string, number> = { easy: 8, normal: 4, hard: 2, hardcore: 0 }; // Maximal erlaubte Skips

   const maxErrors = maxErrorsMap[difficulty];
   const maxTime = maxTimeMap[difficulty];
   const maxSkips = maxSkipsMap[difficulty]; // Maximal erlaubte Skips für den Schwierigkeitsgrad

   const [score, setScore] = useState(0);
   const [skips, setSkips] = useState(maxSkips); // Setze die Skips auf die maximalen Skips
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [timeLeft, setTimeLeft] = useState(maxTime);
   const [errors, setErrors] = useState(0);
   const [isGameOver, setIsGameOver] = useState(false);
   const [fade, setFade] = useState(false);

   const currentQuestion = questions[currentQuestionIndex];

   // Timer-Effect
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
      if (errors >= maxErrors || (skips === 0 && difficulty !== "hardcore")) {
         setIsGameOver(true); // Spiel beenden, wenn keine Skips mehr vorhanden sind (außer im Hardcore-Modus)
      }
   }, [errors, maxErrors, skips, difficulty]);

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

   return {
      currentQuestion,
      score,
      skips,
      timeLeft,
      checkAnswer,
      skipQuestion,
      isGameOver,
      fade,
      errors
   };
}
