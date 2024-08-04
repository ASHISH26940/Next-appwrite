import { NextResponse,NextRequest } from "next/server";
import User from '@/models/userModel';
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request:NextRequest){
    try{
        const {token}=await request.json();
        const user=await User.findOne({
            forgotPassword:token,
            forgorPasswordTokenExpiry:{$gt:Date.now()}
        });
        if(!user){
            return NextResponse.json({message:"Invalid or expired token"},{status:404})
        }
        return NextResponse.json({message:"Token is valid"},{status:200});
    }catch(error:any){
        console.error("Error in token verification",error);
        return NextResponse.json({message:"Token is invalid"})
    }
}