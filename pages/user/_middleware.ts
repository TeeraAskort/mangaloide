import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { JWT } from "../../utils";

export default async function midddleware(
  req: NextRequest,
  ev: NextFetchEvent
) {
  const page = req.page.name;

  switch (page) {
    case "/user/profile":
      try {
        const { token } = req.cookies;
        await JWT.isValidToken(token);
        return NextResponse.next();
      } catch (error) {
        return NextResponse.redirect(`${req.nextUrl.origin}/auth/login`);
      }

    default:
      return NextResponse.next();
  }
}
