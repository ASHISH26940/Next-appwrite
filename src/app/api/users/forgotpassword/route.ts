import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { sendEmail } from "@/helpers/mailer";
connect();

export async function POST(request:NextRequest){
    try{
        const requestBody=await request.json();
        const {email}=requestBody;
        console.log(email);
        const user=await User.findOne({email});
        console.log(user);
        
        if(!user){
            return NextResponse.json({message:"User is not valid"},{status:404})
        }
        const token=await jwt.sign({userId:user._id},process.env.TOKEN_SECRET!,{expiresIn:"1h"});
        
        await User.findByIdAndUpdate(user._id,{
            forgotPasswordToken:token,
            forgotPasswordTokenExpiry:Date.now()+3600000
        })
        await sendEmail({
            email,
            emailType:"RESET",
            userId:user._id//ye line mai error khaya tha
        })
        return NextResponse.json({message:"Reset Link is send"},{status:500});
    }catch(error:any){
        return NextResponse.json({message:"Failed to send the reset"},{status:404})
    }
}