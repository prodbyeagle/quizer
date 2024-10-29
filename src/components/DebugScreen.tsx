import React, { useState } from "react";
import questionsData from "../data/questions.json";
import Modal from "./Modal";

interface Question {
   question: string;
   answers: string[];
   correct: string[];
}

interface QuestionsByDifficulty {
   easy: Question[];
   normal: Question[];
   hard: Question[];
   hardcore: Question[];
}

const DebugScreen: React.FC = () => {
   const [questions, setQuestions] = useState<QuestionsByDifficulty>(questionsData);
   const [newQuestion, setNewQuestion] = useState<Question>({ question: "", answers: [], correct: [] });
   const [difficulty, setDifficulty] = useState<keyof QuestionsByDifficulty>("easy");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);

   const handleInputChange = (field: keyof Question, value: string) => {
      if (field === "answers" || field === "correct") {
         setNewQuestion((prev) => ({ ...prev, [field]: value.split(",").map((ans) => ans.trim()) }));
      } else {
         setNewQuestion((prev) => ({ ...prev, [field]: value }));
      }
   };

   const handleAddQuestion = () => {
      setQuestions((prev) => ({
         ...prev,
         [difficulty]: [...prev[difficulty], newQuestion],
      }));
      setNewQuestion({ question: "", answers: [], correct: [] });
   };

   const handleDeleteQuestion = (index: number) => {
      setQuestions((prev) => {
         const updatedQuestions = [...prev[difficulty]];
         updatedQuestions.splice(index, 1);
         return {
            ...prev,
            [difficulty]: updatedQuestions,
         };
      });
   };

   const openModal = (index: number) => {
      setCurrentQuestionIndex(index);
      setNewQuestion(questions[difficulty][index]);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setCurrentQuestionIndex(null);
      setNewQuestion({ question: "", answers: [], correct: [] }); // Reset newQuestion
   };

   const handleUpdateQuestion = () => {
      if (currentQuestionIndex !== null) {
         const updatedQuestions = [...questions[difficulty]];
         updatedQuestions[currentQuestionIndex] = newQuestion;
         setQuestions((prev) => ({
            ...prev,
            [difficulty]: updatedQuestions,
         }));
         closeModal();
      }
   };

   return (
      <div className="p-6 bg-zinc-900 min-h-screen text-white">
         <h1 className="text-2xl font-bold mb-4">Debug Screen - Fragenverwaltung</h1>

         <div className="flex space-x-4 mb-6">
            <select
               value={difficulty}
               onChange={(e) => setDifficulty(e.target.value as keyof QuestionsByDifficulty)}
               className="p-2 bg-zinc-700 text-white rounded"
            >
               {Object.keys(questions).map((level) => (
                  <option key={level} value={level}>
                     {level}
                  </option>
               ))}
            </select>
         </div>

         <div className="mb-4">
            <h2 className="text-xl font-semibold">Neue Frage hinzufügen</h2>
            <input
               type="text"
               placeholder="Frage eingeben"
               value={newQuestion.question}
               onChange={(e) => handleInputChange("question", e.target.value)}
               className="p-2 bg-zinc-700 text-white rounded mb-2 w-full"
            />
            <input
               type="text"
               placeholder="Antworten durch Kommas trennen"
               value={newQuestion.answers.join(", ")}
               onChange={(e) => handleInputChange("answers", e.target.value)}
               className="p-2 bg-zinc-700 text-white rounded mb-2 w-full"
            />
            <input
               type="text"
               placeholder="Korrekte Antworten (Kommas trennen)"
               value={newQuestion.correct.join(", ")}
               onChange={(e) => handleInputChange("correct", e.target.value)}
               className="p-2 bg-zinc-700 text-white rounded mb-2 w-full"
            />
            <button onClick={handleAddQuestion} className="bg-green-600 px-4 py-2 rounded mt-2">
               Frage hinzufügen
            </button>
         </div>

         <h2 className="text-xl font-semibold mb-4">Aktuelle Fragen</h2>
         <div className="grid grid-cols-1 gap-4">
            {questions[difficulty].map((question, index) => (
               <div key={index} className="relative bg-zinc-800 p-4 rounded-lg shadow-lg border border-zinc-600">
                  <p className="font-bold">{question.question}</p>
                  <p className="text-gray-300">Antworten: {question.answers.join(", ")}</p>
                  <p className="text-gray-300">Korrekte Antworten: {question.correct.join(", ")}</p>
                  <div className="flex justify-between mt-2">
                     <button onClick={() => openModal(index)} className="text-cyan-400 hover:text-cyan-300">
                        Bearbeiten
                     </button>
                     <button onClick={() => handleDeleteQuestion(index)} className="text-red-400 hover:text-red-300">
                        Löschen
                     </button>
                  </div>
               </div>
            ))}
         </div>

         {isModalOpen && (
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Frage bearbeiten">
               <div className="flex flex-col mb-4">
                  <input
                     type="text"
                     placeholder="Frage eingeben"
                     value={newQuestion.question}
                     onChange={(e) => handleInputChange("question", e.target.value)}
                     className="p-2 bg-zinc-700 text-white rounded mb-2"
                  />
                  <input
                     type="text"
                     placeholder="Antworten durch Kommas trennen"
                     value={newQuestion.answers.join(", ")}
                     onChange={(e) => handleInputChange("answers", e.target.value)}
                     className="p-2 bg-zinc-700 text-white rounded mb-2"
                  />
                  <input
                     type="text"
                     placeholder="Korrekte Antworten (Kommas trennen)"
                     value={newQuestion.correct.join(", ")}
                     onChange={(e) => handleInputChange("correct", e.target.value)}
                     className="p-2 bg-zinc-700 text-white rounded mb-2"
                  />
                  <button onClick={handleUpdateQuestion} className="bg-cyan-600 px-4 py-2 rounded mt-2">
                     Frage aktualisieren
                  </button>
               </div>
            </Modal>
         )}
      </div>
   );
};

export default DebugScreen;
