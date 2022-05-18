import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { JWT } from "../../../utils";

export default async function midddleware(
  req: NextRequest,
  ev: NextFetchEvent
) {
  if (req.method === "POST") {
    const { token } = req.cookies;

    try {
      await JWT.isValidToken(token);
      return NextResponse.next();
    } catch (error) {
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    return NextResponse.next();
  }
}
