import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare } from 'lucide-react';
import { isFirebaseInitialized, getFirebaseInitializationError } from '../config/firebase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Check for Firebase initialization issues on component mount
  useEffect(() => {
    const initError = getFirebaseInitializationError();
    if (initError) {
      console.error("Firebase initialization error detected:", initError);
      const errorCode = (initError as any)?.code;
      if (errorCode === 'auth/configuration-not-found') {
        setError('Firebase authentication configuration error. Please contact support.');
      } else {
        setError('Error connecting to authentication service. Please try again later.');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Failed to sign in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    
    try {
      // Check if Firebase is properly initialized
      if (!isFirebaseInitialized()) {
        throw new Error("Firebase is not initialized properly");
      }
      
      console.log("Attempting Google sign-in...");
      const user = await loginWithGoogle();
      console.log("Google sign-in successful");
      navigate('/dashboard');
    } catch (err) {
      console.error("Google sign-in error:", err);
      // Handle specific Firebase auth errors
      const errorCode = (err as any)?.code;
      if (errorCode === 'auth/configuration-not-found') {
        setError('Google sign-in is not properly configured. Please contact support.');
      } else if (errorCode === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing the sign-in.');
      } else if (errorCode === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (errorCode === 'auth/cancelled-popup-request') {
        setError('Multiple popup requests were made. Only one popup can be open at a time.');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError((err as Error).message || 'Failed to sign in with Google');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="bg-[#e5fb26] rounded-lg p-1.5 mr-2">
              <CheckSquare className="text-black" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#e5fb26]">TaskTribe</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6">Sign In to Your Account</h1>
          <p className="text-gray-400 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-white text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#e5fb26] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#e5fb26] focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-[#1a1a1a] text-[#e5fb26] focus:ring-[#e5fb26]"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-[#e5fb26] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className={`w-full py-3 px-4 rounded-lg bg-[#e5fb26] text-black font-semibold transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#d4ea15]'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="relative flex items-center justify-center mt-4">
            <hr className="w-full border-gray-700" />
            <span className="absolute bg-[#2a2a2a] px-2 text-gray-400 text-sm">
              Or continue with
            </span>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className={`w-full py-3 px-4 mt-4 rounded-lg border border-gray-700 bg-[#1a1a1a] text-white font-medium flex items-center justify-center space-x-2 transition-colors ${
              googleLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#333]'
            }`}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          <div className="text-center mt-6 text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#e5fb26] hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 