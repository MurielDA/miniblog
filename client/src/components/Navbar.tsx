import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return(
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-orange-500">🐦 CyaCya</Link>
                    <div className="flex items-center space-x-4">
                        {user?
                            (   <>
                                    <Link to="/" className="text-gray-600 hover:text-orange-500 transition">Home</Link>
                                    <Link to={`/profile/${user.id}`} className="text-gray-600 hover:text-orange-500 transition">Profile</Link>
                                    <button onClick={handleLogout} className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition">Logout</button>
                                </>
                            )
                        :
                            (
                                <>
                                    <Link to="/login" className="text-gray-600 hover:text-orange-500 transition">Login</Link>
                                    <Link to="/register" 
                                        className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
                                        Sign Up
                                    </Link>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;