import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { AxiosError } from "axios";
const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try{
            await login(email,password);
            navigate('/');

        }catch(err){
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Login failed");
            } else {
                setError("Login failed");
            }
        }finally{
            setIsLoading(false);
        }

    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-500">🐦 CyaCya</h1>
                    <p className="text-gray-600 mt-2">Login to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                            {error}
                        </div>)
                    }
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} 
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50">
                        {isLoading? "Logging in ..." : "Login"}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-orange-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;