import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export const getDataFromToken = async (request:NextRequest)=>{
    try{
        const token=request.cookies.get("token")?.value||"";
        const decoded:any= await jwt.verify(token,process.env.TOKEN_SECRET!);
        return decoded.id;
    }catch(err:any){
        throw new Error(err.message)
    }
}