import Auth from './screens/Auth/Auth';
import { Routes, Route } from "react-router-dom";
import Home from './screens/Home/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
