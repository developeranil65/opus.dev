import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

// 1. Define Interface
export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    refreshToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String, 
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    }, 
    { timestamps: true }
);

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password!, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password: string) {
    return await bcrypt.compare(password, this.password!);
};

userSchema.methods.generateAccessToken = function() {
    const rawSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!rawSecret) throw new Error("ACCESS_TOKEN_SECRET is missing");

    const secret: Secret = rawSecret;

    const payload = {
        _id: this._id.toString(),
        username: this.username,
        email: this.email,
    };

    const options: SignOptions = {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as any 
    };

    return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function() {
    const rawSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!rawSecret) throw new Error("REFRESH_TOKEN_SECRET is missing");

    const secret: Secret = rawSecret;

    const payload = {
        _id: this._id.toString(),
    };

    const options: SignOptions = {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as any
    };

    return jwt.sign(payload, secret, options);
};

export const User = mongoose.model<IUser>("User", userSchema);