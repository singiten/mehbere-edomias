import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo(null);

    // Validate input
    if (!phoneNumber || !password) {
      setError('Please enter both phone number and password');
      setLoading(false);
      return;
    }

    // Clean phone number (remove spaces, etc.)
    const cleanPhone = phoneNumber.trim();

    console.log('🔍 ===== LOGIN ATTEMPT =====');
    console.log('🔍 API URL:', import.meta.env.VITE_API_URL);
    console.log('🔍 Phone Number:', cleanPhone);
    console.log('🔍 Password length:', password.length);

    try {
      console.log('🔍 Attempting login...');
      
      // Call the login function from AuthContext
      const result = await login(cleanPhone, password);
      console.log('✅ Login Success:', result);
      
      const userData = result.user || result;
      console.log('✅ User role:', userData?.role);
      
      setDebugInfo({ 
        status: 'success', 
        user: userData,
        role: userData?.role
      });
      
      toast.success(`Welcome ${userData?.fullName || 'Member'}!`);
      
      // Redirect based on role
      setTimeout(() => {
        if (userData?.role === 'super_admin' || userData?.role === 'admin') {
          console.log('🔍 Redirecting to Admin Dashboard...');
          navigate('/admin');
        } else if (userData?.role === 'member') {
          console.log('🔍 Redirecting to Member Dashboard...');
          navigate('/dashboard');
        } else {
          console.log('🔍 Redirecting to Home...');
          navigate('/');
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ ===== LOGIN ERROR =====');
      console.error('❌ Error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error response data:', error.response?.data);
      
      // Extract the actual error message
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setDebugInfo({ 
        status: 'error', 
        message: errorMessage,
        statusCode: error.response?.status,
        fullError: error.response?.data
      });
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Quick test function to check backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/public/services`);
      console.log('✅ Backend test response:', response.status);
      if (response.ok) {
        toast.success('Backend is reachable!');
      } else {
        toast.error(`Backend returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Backend test failed:', error);
      toast.error('Cannot reach backend. Make sure the server is running.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Mehbere Edomias
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-900 hover:text-blue-700">
              register as a new member
            </Link>
          </p>
          
          
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {/* Debug Status */}
          {debugInfo && (
            <div className="mt-4 p-3 rounded-md text-xs font-mono" style={{
              background: debugInfo.status === 'success' ? '#d1fae5' : '#fee2e2',
              color: debugInfo.status === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${debugInfo.status === 'success' ? '#34d399' : '#f87171'}`
            }}>
              <strong>Debug:</strong> 
              <pre className="mt-1 whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-900 focus:border-blue-900 focus:z-10 sm:text-sm"
                placeholder="Phone Number (09xxxxxxxx)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-900 focus:border-blue-900 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;