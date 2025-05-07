import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { isFirebaseInitialized } from '../../config/firebase';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(email, password);
      navigate('/profile-setup');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      if (!isFirebaseInitialized()) {
        throw new Error("Firebase is not initialized properly");
      }
      
      await loginWithGoogle();
      navigate('/profile-setup');
    } catch (err: any) {
      const errorCode = err?.code;
      if (errorCode === 'auth/configuration-not-found') {
        setError('Google sign-in is not properly configured. Please contact support.');
      } else if (errorCode === 'auth/popup-closed-by-user') {
        setError('Sign-up popup was closed before completing the sign-up.');
      } else if (errorCode === 'auth/popup-blocked') {
        setError('Sign-up popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setError(err.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto p-6 bg-[#1a1a1a] rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500">
          {error}
        </div>
      )}
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-[#2a2a2a] rounded border border-gray-700 text-white focus:outline-none focus:border-[#e5fb26]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#2a2a2a] rounded border border-gray-700 text-white focus:outline-none focus:border-[#e5fb26]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full bg-[#e5fb26] text-black py-3 rounded font-semibold hover:bg-[#d4ea15] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-4 flex items-center">
        <div className="flex-1 border-t border-gray-700"></div>
        <span className="px-3 text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-700"></div>
      </div>
      <button
        onClick={handleGoogleSignup}
        disabled={loading || googleLoading}
        className="w-full mt-4 bg-white text-black py-3 rounded font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {!googleLoading ? (
          <>
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span>Continue with Google</span>
          </>
        ) : (
          <span>Signing up...</span>
        )}
      </button>
      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-[#e5fb26] hover:underline">
          Log in
        </Link>
      </p>
    </motion.div>
  );
};

export default SignupForm; 