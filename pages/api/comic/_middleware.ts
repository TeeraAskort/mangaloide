import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { JWT } from "../../../utils";
import { db } from "../../../database";
import { UserModel } from "../../../models";

export default async function midddleware(
  req: NextRequest,
  ev: NextFetchEvent
) {
  if (req.method === "POST") {
    const { token } = req.cookies;

    let userId = "";

    try {
      userId = await JWT.isValidToken(token);
    } catch (error) {
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.connect();
    const user = await UserModel.findById(userId).select("_id").lean();

    if (!user) {
      return new Response(JSON.stringify({ message: "User doesn't exist" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.next();
  } else {
    return NextResponse.next();
  }
}
