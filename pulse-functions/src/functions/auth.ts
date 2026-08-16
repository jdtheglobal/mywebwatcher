import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OAuth2Client } from "google-auth-library";
import * as jwt from "jsonwebtoken";

export async function googleAuth(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed auth request`);

    try {
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
        const JWT_SECRET = process.env.JWT_SECRET || "default_secret_do_not_use_in_prod";
        
        if (!GOOGLE_CLIENT_ID) {
            return { status: 500, body: "Server configuration missing GOOGLE_CLIENT_ID" };
        }

        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const body = await request.text();
        const data = JSON.parse(body);

        if (!data.credential) {
            return { status: 400, body: "Missing credential" };
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: data.credential,
            audience: GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        if (!payload) {
            return { status: 401, body: "Invalid Google token" };
        }

        const userId = `google:${payload.sub}`;
        const email = payload.email;
        const name = payload.name;

        // Sign custom JWT
        const token = jwt.sign(
            { userId, email, name },
            JWT_SECRET,
            { expiresIn: '7d' } // 7-day session
        );

        return {
            status: 200,
            jsonBody: {
                token,
                user: {
                    userId,
                    email,
                    name,
                    picture: payload.picture
                }
            }
        };

    } catch (error: any) {
        context.error(error);
        return { status: 500, body: `Internal Server Error: ${error.message || String(error)}` };
    }
}

app.http('googleAuth', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/google',
    handler: googleAuth
});
