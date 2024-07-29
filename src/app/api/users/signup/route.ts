import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("Received request body:", reqBody);

    const user = await User.findOne({ email });

    if (user) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    console.log("Attempting to save new user");
    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    console.log("Attempting to send verification email");
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    console.log("Verification email sent successfully");

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.error("Error in user signup:", error);
    return NextResponse.json(
      { error: "An error occurred during signup. Please try again later." },
      { status: 500 }
    );
  }
}
