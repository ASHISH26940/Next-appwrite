import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"email!!"],
        unique:true,
    },
    password: {
        type: String,
        required: [true,"pass!!"],
    },
    isAdmin:{
        type:Boolean,
        default: false,
    },
    forgotPasswordTojen: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken :String,
    verifyTokenExpiry:Date,
});

const User = mongoose.models.users || mongoose.model("User",userSchema);

export default User;