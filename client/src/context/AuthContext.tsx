import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";
import { authAPI } from "../api"


interface AuthContextType {
    user: User | null;
    token: string |null;
    isLoading: boolean;
    register: (email: string, username: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ( {children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User|null>(null);
    const [token, setToken] = useState<string|null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if(token){
                try{
                    const response = await authAPI.getMe();
                    setUser(response.data.data.user);
                }catch(error){
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setToken(null);
                }
            }   
            setIsLoading(false);
        }
        loadUser();
    }, [token]);

    const login = async (email: string, password: string) => {
        const response = await authAPI.login({email, password});
        const {token: newToken, user: newUser} = response.data.data;

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(newToken);
        setUser(newUser);
    };
    
    const register = async (username: string, email: string, password: string) => {
        const response = await authAPI.register({ username, email, password });
        const { token: newToken, user: newUser } = response.data.data;
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setToken(null);
        setUser(null);
    };
    
    return(
        <AuthContext.Provider value={{user, token, isLoading, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    )

}