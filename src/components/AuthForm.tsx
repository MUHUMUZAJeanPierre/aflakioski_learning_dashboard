'use client';

import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa'; 
import Link from 'next/link';
import '../app/globals.css';
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { login, register } from '../redux/slices/authSlice';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isLogin){
    if(formData.password !== formData.confirmPassword){
      alert("Passwords do not match");
      return;
    }}

    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

      try {
        let response;
        if (isLogin) {
          response = await dispatch(login(payload)).unwrap();
        } else {
          response = await dispatch(register(payload)).unwrap();
        }
  
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);
        }
      
      router.push('/courses');
    } catch (error) {
      console.error(`Authentication error:`, error.message || 'An error occurred');
    }
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    });
  };

  const handleGoogleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    const googleAuthUrl = new URL("https://course-back-2-00rq.onrender.com/auth/google");
    googleAuthUrl.searchParams.append('state', state);
    googleAuthUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/callback`);
    
    window.location.href = googleAuthUrl.toString();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-cover bg-center hero">
        <div className="absolute inset-0 bg-black/80"></div>
      </div>
      <div className="bg-white p-8 rounded-md shadow-lg w-[24rem] relative">
        <h2 className="text-xl font-semibold mb-6 font-sans text-[#16A34A]">
          {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="John Doe"
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  className="w-4 h-4 mr-2"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
                <label className="text-sm">
                  I agree to all statements in{' '}
                  <Link href="#" className="text-[#16A34A] font-semibold">
                    Terms of Service
                  </Link>
                </label>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#16A34A] to-[#16A34A] text-white py-2 rounded-md hover:opacity-90"
          >
            {isLogin ? 'LOGIN' : 'SIGN UP'}
          </button>
        </form>

        <div className="mt-4 flex justify-center gap-4 w-full bg-gradient-to-r from-[#16A34A] to-[#16A34A] text-white py-2 rounded-md hover:opacity-90">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center hover:bg-[#16A34A] text-white py-2 px-2 rounded-full hover:opacity-90"
          >
            <FaGoogle className="text-lg text-white hover:text-white" /> 
          </button>
        </div>

        <p className="text-center text-sm mt-4 flex gap-2">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={toggleForm}
                className="text-[#16A34A] font-semibold"
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={toggleForm}
                className="text-[#16A34A] font-semibold"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
