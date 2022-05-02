import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default function midddleware(req: NextRequest, ev: NextFetchEvent) {
  const comicId = req.page.params?.comicId || "";

  const checkMongoIDRegExp = /^[0-9a-fA-F]{24}$/;

  if (!checkMongoIDRegExp.test(comicId)) {
    return new Response(
      JSON.stringify({
        message: "The comicId is not valid " + comicId,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return NextResponse.next();
}
