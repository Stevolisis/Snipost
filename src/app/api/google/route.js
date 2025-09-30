// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

export async function POST(req) {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const data = await req.json();
        const idToken = data.idToken;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        // console.log(ticket);
        return NextResponse.json({ token: ticket}, { status: 200 });
    } catch (error) {
        console.error("Error verifying Google ID token:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Error verifying ID token" },
            { status: 500 }
        );
    }
}
