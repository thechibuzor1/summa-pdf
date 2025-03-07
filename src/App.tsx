import Auth from './screens/Auth/Auth';
import { Routes, Route } from "react-router-dom";
import Home from './screens/Home/Home';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
