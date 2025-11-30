import { User } from "@/models/user.model";
import { AppError } from "@/types";
import { hashPassword, comparePassword } from "@/utils/password";
import { generateToken } from "@/utils/jwt";
import mongoose from 'mongoose';


interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

class AuthService {

    // create user
    async register(data: RegisterData) {
        const { username, email, password } = data;

        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        });

        if(existingUser){
            if(existingUser.email === email){
                throw new AppError(400, "Email already exists");
            }
            throw new AppError(400, "Username already exists");
        }
        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email
        });
        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        };
    }

    // user login
    async login(data: LoginData) {
        const { email, password } = data;
        const user = await User.findOne({email}).select("+password");

        if(!user){
            throw new AppError(401, "Invalid email or password");
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid){
            throw new AppError(401, "Invalid email or password");
        }

        const token = generateToken({
            userId: user._id.toString(),
            email,
        });

        return {
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        };
    }

    // get user by id
    async getUserById(userId: string) {
        if(!mongoose.Types.ObjectId.isValid(userId)){
            throw new AppError(400, "Invalid user ID");
        }
        const user = await User.findById(userId);
        if(!user){
            throw new AppError(404, "User not found");
        }

        return {
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatarUrl: user.avatarUrl,
            }
        }
    }
}

export const authService = new AuthService();