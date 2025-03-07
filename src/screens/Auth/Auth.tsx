import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
export const BASE_URL = "https://school-aid.onrender.com";


const Auth: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/${isSignUp ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed");

      login(data.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center px-6">
      <h1 className="text-5xl md:text-6xl font-bold text-primary text-center leading-none">
        EduSphere
      </h1>
      <h4 className="text-gray-600 text-center text-sm md:text-base mt-2">
        AI-Powered Study Guide
      </h4>
      <div className="mt-6 bg-white p-6 md:p-8 rounded-xl w-full max-w-lg">
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:bg-[#9AC2C2]"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:bg-[#9AC2C2] focus:outline-none"
            />
          </div>
          {isSignUp && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-gray-700 font-semibold">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:bg-[#9AC2C2]"
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white text-lg py-2 rounded-lg mt-6 font-[700] hover:bg-[#006060] transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
            ) : (
              isSignUp ? "Sign Up" : "Sign In"
            )}
          </button>
        </form>
      </div>
      <p className="font-[700] text-gray-500 mt-6">
        {isSignUp ? "Already have an account?" : "Don’t have an account?"} {" "}
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-[700] hover:underline">
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
