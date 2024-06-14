import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ethers } from "ethers";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [metamaskConnected, setMetamaskConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setMetamaskConnected(true);
        } else {
          setMetamaskConnected(false);
        }
      });
    }
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!metamaskConnected) {
      alert("Please connect to MetaMask");
      return;
    }

    try {
      const response = await axios.post(`${window.location.origin}/auth/login`, { email, password });
      const { data } = response;

      if (data.message === "success") {
        Cookies.set('token', data.token, { expires: 1 }); // Set token cookie to expire in 1 day
        Cookies.set('role', data.role, { expires: 1 });
        Cookies.set('email', email, { expires: 1 });

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else if (data.message === "notexist") {
        alert("User has not signed up");
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert("Wrong details");
    }
  }

  async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setMetamaskConnected(true);

      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert("Failed to connect to MetaMask");
      }
    } else {
      alert("MetaMask is not installed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="text" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9 12a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H9zm0-8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Don't have an account? Sign up</Link>
        </div>
        <div className="mt-6">
          <button onClick={connectMetaMask} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Connect with MetaMask
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
