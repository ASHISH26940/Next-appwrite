import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const { email } = requestBody;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!, { expiresIn: "1h" });
        // console.log("forgot Password page : ",token);
        
        // await User.findByIdAndUpdate(user._id, {
        //     forgotPasswordToken: token,
        //     forgotPasswordTokenExpiry: Date.now() + 3600000
        // });

        // Ensure sendEmail function is working and handles errors appropriately
        await sendEmail({
            email,
            emailType: "RESET",
            userId: user._id
        });

        return NextResponse.json({ message: "Reset link sent" }, { status: 200 });//teri chudiyon 

    } catch (error: any) {
        console.error("Error sending reset link:", error);
        return NextResponse.json({ message: "Failed to send the reset link" }, { status: 500 });
    }
}
