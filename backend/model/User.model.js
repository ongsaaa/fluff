import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "Username Exists"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    education: {
        type: [String],
    },
    line: {
        type: String,
    },
    discord: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    interested_topics: {type: [String]},
    address: { type: String },
    profile: { type: String }
});

export default mongoose.model.User || mongoose.model('User', UserSchema);