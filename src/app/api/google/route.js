// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

export async function POST(req) {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const data = await req.json();
        const access_token = data.access_token;

        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        console.log("userInfoRes", userInfoRes);

        const profile = await userInfoRes.json();
        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error("Error verifying Google ID token:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Error verifying ID token" },
            { status: 500 }
        );
    }
}
