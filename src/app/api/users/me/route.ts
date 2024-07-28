import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userID = await getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");
    return NextResponse.json({ message: "USer Found", data: user });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 400,
      }
    );
  }
}
