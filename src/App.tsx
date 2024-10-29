import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";
import DebugScreen from "./components/DebugScreen";
import CustomModeEditor from "./components/CustomModeEditor";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/:difficulty" element={<QuizScreen />} />
      <Route path="/debug" element={<DebugScreen />} />
      <Route path="/custom" element={<CustomModeEditor />} />
      <Route path="/:uuid" element={<QuizScreen />} />
    </Routes>
  </Router>
);

export default App;
