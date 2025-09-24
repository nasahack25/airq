"use client";

import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface AuthFormProps {
    type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    // const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const url = type === 'login' ? '/api/v1/auth/user/signin' : '/api/v1/auth/user/signup';
            const payload = type === 'login' ? { email: formData.email, password: formData.password } : formData;
            const response = await api.post(url, payload);

            if (response.data.user) {
                login(response.data.user);
            }
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } }
            setError(anyErr.response?.data?.message || `An error occurred during ${type}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // Redirect the user to the backend's Google OAuth endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">{type === 'login' ? 'Welcome Back!' : 'Create an Account'}</h1>
                    <p className="mt-2 text-gray-400">
                        {type === 'login'
                            ? "Don't have an account? "
                            : 'Already have an account? '}
                        <Link href={type === 'login' ? '/signup' : '/signin'} className="font-medium text-blue-400 hover:text-blue-300">
                            {type === 'login' ? 'Sign up' : 'Log in'}
                        </Link>
                    </p>
                </div>

                <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium transition-colors">
                    {/* Simple Google SVG icon */}
                    <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.128,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                    Continue with Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-400">OR</span>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {type === 'signup' && (
                        <input name="username" type="text" placeholder="Username" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 rounded-md text-white border-gray-600 focus:ring-blue-500 focus:outline-none" />
                    )}
                    <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 rounded-md text-white border-gray-600 focus:ring-blue-500 focus:outline-none" />
                    <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 rounded-md text-white border-gray-600 focus:ring-blue-500 focus:outline-none" />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition-colors disabled:bg-blue-800">
                        {loading ? 'Processing...' : (type === 'login' ? 'Log In' : 'Sign Up')}
                    </button>
                </form>
            </div>
        </div>
    );
}
