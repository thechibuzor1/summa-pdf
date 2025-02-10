import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Handle authentication (Sign Up / Sign In)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);
      }
      navigate("/"); // Redirect after authentication
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center px-6">
      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-bold text-[#008585] text-center leading-none">
        SummaPDF
      </h1>
      <h4 className="text-gray-600 text-center text-sm md:text-base mt-2">
        AI-Powered PDF Summarization – Fast & Accurate
      </h4>

      {/* Auth Form */}
      <div className="mt-6 bg-white p-6 md:p-8 shadow-lg rounded-xl w-full max-w-md">
        <form onSubmit={handleAuth}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008585]"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008585]"
            />
          </div>

          {/* Confirm Password (Only for Sign Up) */}
          {isSignUp && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-gray-700 font-semibold">Confirm Password:</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008585]"
              />
            </div>
          )}

          {/* Forgot Password (Only for Sign In) */}
          {!isSignUp && (
            <div className="text-right mb-4">
              <a href="#" className="text-[#008585] text-sm hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Sign In / Sign Up Button */}
          <button type="submit" className="w-full bg-[#008585] text-white text-lg py-3 rounded-lg font-semibold hover:bg-[#006060] transition">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
      </div>

      {/* Toggle Sign In / Sign Up */}
      <p className="text-sm text-gray-500 mt-6">
        {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[#008585] font-semibold hover:underline"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}

export default Auth;
