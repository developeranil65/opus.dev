import mongoose, { Schema, Document, Types } from "mongoose";

interface IPollOption {
    text: string;
    votes: number;
}

interface IVoter {
    ip: string;
}

export interface IPoll extends Document {
    title: string;
    options: IPollOption[];
    pollCode: string;
    qrUrl?: string;
    isMultipleChoice: boolean;
    isPublicResult: boolean;
    expiresAt?: Date;
    createdBy: Types.ObjectId;
    voters: IVoter[];
    createdAt: Date;
    updatedAt: Date;
}

const pollSchema = new Schema<IPoll>(
	{
		title: {
            type: String,
            required: true,
            trim: true
        },
        options: [{
            text: { type: String, required: true },
            votes: { type: Number, default: 0 }
        }],
        pollCode: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        qrUrl: {
            type: String,
        },
        isMultipleChoice: {
            type: Boolean,
            default: false
        },
        isPublicResult: {
            type: Boolean,
            default: true
        },
        expiresAt: {
            type: Date,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        voters: [{
            ip: String, 
        }]
	}, 
	{ timestamps: true }
);

pollSchema.index({ createdBy: 1, createdAt: -1 });
// Added index for faster duplicate IP checks as discussed
pollSchema.index({ "voters.ip": 1 }); 

export const Poll = mongoose.model<IPoll>("Poll", pollSchema);