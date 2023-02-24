import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import NavBar from "./components/NavBar";
import Register from "./components/Register";
import Login from "./components/Login";
import QuizPage from "./components/QuizPage";
import Me from "./components/Me";
import EditQuiz from "./components/EditQuiz/EditQuiz";
import LeaderBoard from "./components/LeaderBoard";
import { useState } from "react";
import PreLoader from "./components/PreLoader";
function App() {
  const [loading, setLoading] = useState(true)
  if (loading) {
    return <PreLoader setLoading={setLoading}></PreLoader>
  }
  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quizes/:quiz_id" element={<QuizPage />} />
        <Route path="/quizes/:quiz_id/edit" element={<EditQuiz />} />
        <Route
          path="/quizes/:quiz_id/leaderboard"
          element={<LeaderBoard mobile={true} />}
        />
        <Route path="/me" element={<Me />} />
      </Routes>
    </>
  );
}

export default App;
