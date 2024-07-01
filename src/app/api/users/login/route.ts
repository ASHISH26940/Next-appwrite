import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel"
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request:NextResponse)
{
    try{
        const reqBody = await request.json();
        const {email,password} = reqBody;

        const user = await User.findOne({email});

        if(!user)
        {
                return NextResponse.json({
                    error:"User does not exist"
                },{status:400})
        }

        const validPass = bcryptjs.compare(password,user.password);

        if(!validPass)
            {
                return NextResponse.json({
                    error:"Invalid Password"
                },{status:500})
            }
        
        //create token data 

        const tokenData = { 
            id:user._id,
            username:user.username,
            email:user.email
        }

        //set token data

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn: "1h"});

        const response = NextResponse.json({
            message: "Login sucessgul",
            success: true
        })

        response.cookies.set("token",token,{
            httpOnly:true
        })
        return response;

    }catch(error:any)
    {
        return NextResponse.json({
            error:error.message
        },{
            status:500
        })
    }
}