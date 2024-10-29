import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

import questionsData from '../data/questions.json';

const CustomModeEditor: React.FC = () => {
   const [name, setName] = useState("");
   const [creator, setCreator] = useState("");
   const [description, setDescription] = useState("");
   const [maxTime, setMaxTime] = useState(180);
   const [maxErrors, setMaxErrors] = useState(2);
   const [maxSkips, setMaxSkips] = useState(2);
   const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
   const [mode, setMode] = useState<"easy" | "normal" | "hard" | "hardcore">("easy");
   const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);

   const navigate = useNavigate();

   useEffect(() => {

      if (questionsData[mode]) {
         setAvailableQuestions(questionsData[mode]);
      }
   }, [mode]);

   const handleQuestionSelect = (question: string) => {
      setSelectedQuestions(prev =>
         prev.includes(question) ? prev.filter(q => q !== question) : [...prev, question]
      );
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const uuid = uuidv4();
      const customModeData = {
         name,
         creator,
         description,
         maxTime,
         maxErrors,
         maxSkips,
         selectedQuestions,
         uuid,
      };

      console.log(customModeData);
      navigate(`/${uuid}`);
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-6">
         <h1 className="text-4xl font-bold mb-8">Custom Mode Editor</h1>
         <h1 className="text-md italic font-light mb-8">cant be played yet..</h1>
         <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            <input
               type="text"
               placeholder="Name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring focus:ring-cyan-500"
               required
            />
            <input
               type="text"
               placeholder="Creator"
               value={creator}
               onChange={(e) => setCreator(e.target.value)}
               className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring focus:ring-cyan-500"
               required
            />
            <textarea
               placeholder="Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring focus:ring-cyan-500"
               required
            />
            <div className="flex flex-col space-y-2">
               <label className="text-lg">Max Time (seconds):</label>
               <input
                  type="number"
                  value={maxTime}
                  onChange={(e) => setMaxTime(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring focus:ring-cyan-500"
                  required
               />
            </div>
            <div className="flex flex-col space-y-2">
               <label className="text-lg">Max Errors:</label>
               <input
                  type="number"
                  value={maxErrors}
                  onChange={(e) => setMaxErrors(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring focus:ring-cyan-500"
                  required
               />
            </div>
            <div className="flex flex-col space-y-2">
               <label className="text-lg">Max Skips:</label>
               <input
                  type="number"
                  value={maxSkips}
                  onChange={(e) => setMaxSkips(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring focus:ring-cyan-500"
                  required
               />
            </div>

            <div className="space-y-4">
               <h2 className="text-xl font-semibold">Select Mode</h2>
               <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as "easy" | "normal" | "hard" | "hardcore")}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring focus:ring-cyan-500"
               >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                  <option value="hardcore">Hardcore</option>
               </select>

               <h2 className="text-xl font-semibold mt-4">Available Questions</h2>
               {availableQuestions.map((question: { question: string }, index) => (
                  <div key={index} className="flex items-center mb-2">
                     <input
                        type="checkbox"
                        id={`question-${index}`}
                        checked={selectedQuestions.includes(question.question)}
                        onChange={() => handleQuestionSelect(question.question)}
                        className="hidden"
                     />
                     <label
                        htmlFor={`question-${index}`}
                        className={`flex items-center cursor-pointer border border-zinc-700 rounded-lg p-2 transition-colors duration-200 ${selectedQuestions.includes(question.question) ? "bg-cyan-600/50" : "bg-zinc-800"}`}
                     >
                        <span className="mr-2">{selectedQuestions.includes(question.question) ? "✅" : ""}</span>
                        {question.question}
                     </label>
                  </div>
               ))}
            </div>

            <button
               type="submit"
               className="mt-6 w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition duration-200"
            >
               Create Custom Mode
            </button>
         </form>
      </div>
   );
};

export default CustomModeEditor;
