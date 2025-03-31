import Auth from './screens/Auth/Auth';
import { Routes, Route } from "react-router-dom";
import Home from './screens/Home/Home';
import { AuthProvider } from './context/AuthContext';
import FlashcardRoom from './screens/FlashcardRoom/FlashcardRoom';
import QuizRoom from './screens/QuizRoom/QuizRoom';

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/flashcard" element={<FlashcardRoom />} />
      <Route path="/quiz" element={<QuizRoom />} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
