import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const profile = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "cache-control": "no-cache",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    const profileJson = await profile.json();
    return Response.json(profileJson, { status: profile.status });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        {
          error: "Error fetching LinkedIn profile",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        error: "Error fetching LinkedIn profile",
        message: String(error),
      },
      { status: 500 }
    );
  }
}
