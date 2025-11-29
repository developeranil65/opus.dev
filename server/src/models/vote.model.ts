import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVote extends Document {
    poll: Types.ObjectId;
    selectedOptions: string[];
    voterIP?: string;
    user?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
	{
		poll: {
            type: Schema.Types.ObjectId,
            ref: 'Poll'
        },
        selectedOptions: [String], 

        voterIP: String,

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null 
        }
	}, 
	{ timestamps: true }
);

export const Vote = mongoose.model<IVote>("Vote", voteSchema);