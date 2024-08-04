import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();
    console.log('Received token:', token);
    console.log('Received newPassword:', newPassword);

    if (!token || !newPassword) {
      console.log('Token or newPassword missing');
      return NextResponse.json(
        { message: "Token and new password are required" },
        { status: 400 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    console.log('Decoded ID:', decoded);

    const user = await User.findOne({
      _id: decoded.userId,
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log('User not found or token expired');
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { message: "Password reset unsuccessful" },
      { status: 500 }
    );
  }
}
