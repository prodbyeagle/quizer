import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/:difficulty" element={<QuizScreen />} />
    </Routes>
  </Router>
);

export default App;
